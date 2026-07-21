from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta
from backend.extensions import db
from backend.models.product import Product, Inventory
from backend.models.user import User
from backend.models.review import Review
from backend.models.bulk_inquiry import BulkInquiry
from backend.models.order import Order
from backend.models.coupon import Coupon


admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@admin_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    """Return aggregated dashboard stats for the admin dashboard."""
    import traceback
    import decimal
    from collections import defaultdict

    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    try:
        # Normalize Decimal -> float for JSON serialization
        def to_float(v):
            if v is None:
                return 0.0
            if isinstance(v, decimal.Decimal):
                return float(v)
            return float(v)

        # Product count
        total_products = int(Product.query.count())

        # Orders & Revenue
        total_orders = int(db.session.query(func.count()).select_from(Order).scalar() or 0)

        revenue_row = db.session.query(func.coalesce(func.sum(Order.final_amount), 0)).one()
        total_revenue = revenue_row[0]

        # Customers
        total_customers = int(User.query.count())

        # Pending reviews
        pending_reviews_count = int(Review.query.filter(Review.status == 'Pending').count())

        # Warehouse stock (inventory table)
        warehouse_stock_row = db.session.query(func.coalesce(func.sum(Inventory.quantity), 0)).one()
        warehouse_stock = warehouse_stock_row[0] or 0

        # --- Recent Orders (last 5) ---
        recent_orders = (
            Order.query
            .order_by(Order.created_at.desc())
            .limit(5)
            .all()
        )
        recent_orders_data = [o.to_dict() for o in recent_orders]

        # --- Monthly Stats (last 6 months) ---
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        monthly_orders = (
            Order.query
            .filter(Order.created_at >= six_months_ago)
            .all()
        )

        # Group by YYYY-MM
        month_buckets = defaultdict(lambda: {'sales': 0.0, 'orders': 0})
        for o in monthly_orders:
            month_key = o.created_at.strftime('%Y-%m') if o.created_at else 'unknown'
            month_buckets[month_key]['sales'] += to_float(o.final_amount)
            month_buckets[month_key]['orders'] += 1

        # Generate last 6 months in order (ensure no gaps)
        monthly_stats = []
        for i in range(5, -1, -1):
            dt = datetime.utcnow() - timedelta(days=30 * i)
            month_key = dt.strftime('%Y-%m')
            short_label = dt.strftime('%b')  # e.g. "Jan"
            bucket = month_buckets.get(month_key, {'sales': 0.0, 'orders': 0})
            monthly_stats.append({
                'month': short_label,
                'sales': round(bucket['sales'], 2),
                'orders': bucket['orders'],
            })

        # --- Category Distribution ---
        from backend.models.category import Category
        categories = Category.query.all()
        category_distribution = []
        for cat in categories:
            product_count = len(cat.products)
            if product_count > 0:
                category_distribution.append({
                    'name': cat.name,
                    'value': product_count,
                })

        response = {
            'total_revenue': to_float(total_revenue),
            'total_orders': int(total_orders),
            'total_customers': int(total_customers),
            'pending_reviews': int(pending_reviews_count),
            'products': int(total_products),
            'warehouse_stock': int(to_float(warehouse_stock)),
            'recent_orders': recent_orders_data,
            'monthly_stats': monthly_stats,
            'category_distribution': category_distribution,
        }
        return jsonify(response), 200

    except Exception as e:
        # Log full stack trace for debugging 500s
        traceback.print_exc()
        return jsonify({'message': str(e)}), 500



@admin_bp.route('/customers', methods=['GET'])
@jwt_required()
def list_customers():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route('/customers/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(user_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


import traceback

@admin_bp.route('/recent-activities', methods=['GET'])
@jwt_required()
def recent_activities():
    try:
        identity = get_jwt_identity()

        if not is_admin(identity):
            return jsonify({'message': 'Administrative privileges required'}), 403

        activities = []

        inquiries = BulkInquiry.query.order_by(BulkInquiry.created_at.desc()).limit(5).all()

        for i in inquiries:
            activities.append({
                "id": f"act-inq-{i.id}",
                "type": "inquiry_created",
                "message": f"New Bulk Inquiry from {i.full_name}",
                "time": i.created_at.isoformat() if i.created_at else None
            })

        return jsonify(activities)

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Coupons CRUD Endpoints
@admin_bp.route('/coupons', methods=['GET'])
@jwt_required()
def get_coupons():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    coupons = Coupon.query.order_by(Coupon.id.desc()).all()
    return jsonify([c.to_dict() for c in coupons]), 200


@admin_bp.route('/coupons', methods=['POST'])
@jwt_required()
def create_coupon():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    data = request.get_json() or {}
    code = data.get('code')
    discount_type = data.get('discount_type') # 'Percentage' or 'Fixed'
    discount_value = data.get('discount_value')
    min_purchase_amount = data.get('min_purchase_amount', 0.00)
    max_discount_amount = data.get('max_discount_amount')
    expiration_date_str = data.get('expiration_date')
    active = data.get('active', True)
    
    if not code or not discount_type or not discount_value:
        return jsonify({'message': 'Code, discount_type, and discount_value are required'}), 400
        
    if Coupon.query.filter_by(code=code).first():
        return jsonify({'message': 'Coupon code already exists'}), 409
        
    expiration_date = None
    if expiration_date_str:
        try:
            expiration_date = datetime.fromisoformat(expiration_date_str.replace('Z', '+00:00'))
        except Exception:
            return jsonify({'message': 'Invalid date format (use ISO format)'}), 400
            
    coupon = Coupon(
        code=code,
        discount_type=discount_type,
        discount_value=discount_value,
        min_purchase_amount=min_purchase_amount,
        max_discount_amount=max_discount_amount,
        expiration_date=expiration_date,
        active=active
    )
    
    db.session.add(coupon)
    db.session.commit()
    return jsonify(coupon.to_dict()), 201


@admin_bp.route('/coupons/<int:coupon_id>', methods=['PUT'])
@jwt_required()
def update_coupon(coupon_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    coupon = Coupon.query.get(coupon_id)
    if not coupon:
        return jsonify({'message': 'Coupon not found'}), 404
        
    data = request.get_json() or {}
    coupon.code = data.get('code', coupon.code)
    coupon.discount_type = data.get('discount_type', coupon.discount_type)
    coupon.discount_value = data.get('discount_value', coupon.discount_value)
    coupon.min_purchase_amount = data.get('min_purchase_amount', coupon.min_purchase_amount)
    coupon.max_discount_amount = data.get('max_discount_amount', coupon.max_discount_amount)
    coupon.active = data.get('active', coupon.active)
    
    expiration_date_str = data.get('expiration_date')
    if expiration_date_str:
        try:
            coupon.expiration_date = datetime.fromisoformat(expiration_date_str.replace('Z', '+00:00'))
        except Exception:
            return jsonify({'message': 'Invalid date format'}), 400
            
    db.session.commit()
    return jsonify(coupon.to_dict()), 200


@admin_bp.route('/coupons/<int:coupon_id>', methods=['DELETE'])
@jwt_required()
def delete_coupon(coupon_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    coupon = Coupon.query.get(coupon_id)
    if not coupon:
        return jsonify({'message': 'Coupon not found'}), 404
        
    db.session.delete(coupon)
    db.session.commit()
    return jsonify({'message': 'Coupon deleted successfully'}), 200
