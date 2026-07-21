from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.cart import Wishlist
from backend.models.product import Product

wishlist_bp = Blueprint('wishlist', __name__, url_prefix='/api/wishlist')

@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify([]), 200
        
    wishlist = Wishlist.query.filter_by(user_id=int(user_id)).all()
    return jsonify([w.to_dict() for w in wishlist]), 200


@wishlist_bp.route('', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Admins do not maintain wishlists'}), 400
        
    data = request.get_json() or {}
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    # Check if duplicate
    existing = Wishlist.query.filter_by(user_id=int(user_id), product_id=product_id).first()
    if existing:
        return jsonify({'message': 'Item already in wishlist', 'wishlist': existing.to_dict()}), 200
        
    w = Wishlist(user_id=int(user_id), product_id=product_id)
    db.session.add(w)
    db.session.commit()
    
    return jsonify({'message': 'Item added to wishlist', 'wishlist': w.to_dict()}), 201


@wishlist_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Admins do not maintain wishlists'}), 400
        
    w = Wishlist.query.filter_by(user_id=int(user_id), product_id=product_id).first()
    if not w:
        return jsonify({'message': 'Item not found in wishlist'}), 404
        
    db.session.delete(w)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from wishlist'}), 200
