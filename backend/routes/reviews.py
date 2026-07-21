from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.review import Review
from backend.models.product import Product

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@reviews_bp.route('', methods=['GET'])
@jwt_required()
def get_all_reviews():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews]), 200


@reviews_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id, status='Approved').order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews]), 200


@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Administrators cannot write reviews'}), 400
        
    data = request.get_json() or {}
    product_id = data.get('product_id')
    rating = data.get('rating')
    title = data.get('title', '')
    comment = data.get('comment')
    image_url = data.get('image_url', '')
    
    if not product_id or not rating or not comment:
        return jsonify({'message': 'Product ID, rating (1-5), and comment are required'}), 400
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    rating = int(rating)
    if rating < 1 or rating > 5:
        return jsonify({'message': 'Rating must be an integer between 1 and 5'}), 400
        
    review = Review(
        user_id=int(user_id),
        product_id=product_id,
        rating=rating,
        title=title,
        comment=comment,
        image_url=image_url,
        status='Pending' # Default to pending review approval
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'message': 'Review submitted and is awaiting moderation approval',
        'review': review.to_dict()
    }), 201


@reviews_bp.route('/<int:review_id>/approve', methods=['PUT'])
@jwt_required()
def approve_review(review_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
        
    review.status = 'Approved'
    db.session.commit()
    return jsonify({'message': 'Review approved successfully', 'review': review.to_dict()}), 200


@reviews_bp.route('/<int:review_id>/reject', methods=['PUT'])
@jwt_required()
def reject_review(review_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
        
    review.status = 'Rejected'
    db.session.commit()
    return jsonify({'message': 'Review rejected successfully', 'review': review.to_dict()}), 200


@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
        
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted successfully'}), 200
