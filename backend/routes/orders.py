from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import random
import string
from backend.extensions import db
from backend.models.order import Order, OrderItem
from backend.models.cart import Cart, CartItem
from backend.models.product import Product, Inventory
from backend.models.coupon import Coupon
from backend.models.user import ShippingAddress

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

def is_admin(identity):
    return identity and identity.startswith('admin-')

def generate_order_number():
    prefix = 'LM'
    digits = ''.join(random.choices(string.digits, k=8))
    return f'{prefix}-{digits}'

@orders_bp.route('', methods=['POST'])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Admins cannot place consumer retail orders'}), 400
        
    data = request.get_json() or {}
    shipping_address_id = data.get('shipping_address_id')
    address_data = data.get('shipping_address') # Alternatively, can pass fresh address details
    coupon_code = data.get('coupon_code')
    payment_method = data.get('payment_method', 'COD') # 'Stripe', 'Razorpay', 'COD'
    
    # 1. Fetch user's cart
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart or not cart.items:
        return jsonify({'message': 'Your shopping cart is empty'}), 400
        
    # 2. Retrieve address
    address = None
    if shipping_address_id:
        address = ShippingAddress.query.filter_by(id=shipping_address_id, user_id=int(user_id)).first()
    elif address_data:
        address = ShippingAddress(
            user_id=int(user_id),
            first_name=address_data.get('first_name'),
            last_name=address_data.get('last_name'),
            address_line1=address_data.get('address_line1'),
            address_line2=address_data.get('address_line2'),
            city=address_data.get('city'),
            state=address_data.get('state'),
            postal_code=address_data.get('postal_code'),
            phone=address_data.get('phone')
        )
        db.session.add(address)
        db.session.flush() # gets address.id
        
    if not address:
        return jsonify({'message': 'A valid shipping address is required'}), 400
        
    # 3. Calculate financial totals and reduce inventory
    total_amount = 0.00
    order_items_to_create = []
    
    for item in cart.items:
        product = Product.query.get(item.product_id)
        if not product or product.status != 'Active':
            return jsonify({'message': f'Product "{item.product_name}" is no longer available'}), 400
            
        # Check stock limits
        inv = Inventory.query.filter_by(product_id=product.id).first()
        if not inv or inv.quantity < item.quantity:
            return jsonify({'message': f'Insufficient stock for product "{product.name}". Available: {inv.quantity if inv else 0}'}), 400
            
        item_subtotal = float(product.price) * item.quantity
        total_amount += item_subtotal
        
        # Save inventory modifications for later commit
        inv.quantity -= item.quantity
        if inv.quantity <= 0:
            product.stock_status = 'Out of Stock'
        elif inv.quantity <= inv.low_stock_threshold:
            product.stock_status = 'Low Stock'
            
        order_item = OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
            size=item.size
        )
        order_items_to_create.append(order_item)
        
    # 4. Handle Coupon Discounts
    discount_amount = 0.00
    if coupon_code:
        coupon = Coupon.query.filter_by(code=coupon_code).first()
        if coupon and coupon.is_valid(total_amount):
            discount_amount = coupon.calculate_discount(total_amount)
            
    # Calculate delivery/shipping fees
    shipping_fee = 0.00 if total_amount >= 499.00 else 49.00
    final_amount = total_amount - discount_amount + shipping_fee
    
    # 5. Save Order
    order_number = generate_order_number()
    order = Order(
        user_id=int(user_id),
        order_number=order_number,
        total_amount=total_amount,
        discount_amount=discount_amount,
        shipping_fee=shipping_fee,
        final_amount=final_amount,
        status='Pending',
        coupon_code=coupon_code,
        payment_status='Paid' if payment_method == 'COD' else 'Pending', # COD is paid on delivery, here COD is marked Paid directly for convenience, or COD is marked Pending. Actually, COD payment status remains 'Pending' or 'Paid' on receipt. Let's make it 'Pending'.
        payment_method=payment_method
    )
    
    db.session.add(order)
    db.session.flush() # gets order.id
    
    # Connect order items
    for order_item in order_items_to_create:
        order_item.order_id = order.id
        db.session.add(order_item)
        
    # Bind shipping address to this order
    address.order_id = order.id
    
    # 6. Clear shopping cart
    CartItem.query.filter_by(cart_id=cart.id).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order placed successfully',
        'order': order.to_dict()
    }), 201


@orders_bp.route('/history', methods=['GET'])
@jwt_required()
def order_history():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        # Admin gets all orders
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.filter_by(user_id=int(user_id)).order_by(Order.created_at.desc()).all()
        
    return jsonify([ord.to_dict() for ord in orders]), 200


@orders_bp.route('/<string:order_number>', methods=['GET'])
@jwt_required()
def track_order(order_number):
    user_id = get_jwt_identity()
    
    if user_id.startswith('admin-'):
        order = Order.query.filter_by(order_number=order_number).first()
    else:
        order = Order.query.filter_by(order_number=order_number, user_id=int(user_id)).first()
        
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    return jsonify(order.to_dict()), 200


# Admin routes for managing orders
@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    data = request.get_json() or {}
    new_status = data.get('status')
    payment_status = data.get('payment_status')
    
    if new_status:
        order.status = new_status # 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    if payment_status:
        order.payment_status = payment_status # 'Pending', 'Paid', 'Failed', 'Refunded'
        
    db.session.commit()
    return jsonify({'message': 'Order updated successfully', 'order': order.to_dict()}), 200
