from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.cart import Cart, CartItem
from backend.models.product import Product

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Admins do not have shopping carts'}), 400
        
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart:
        cart = Cart(user_id=int(user_id))
        db.session.add(cart)
        db.session.commit()
        
    return jsonify(cart.to_dict()), 200


@cart_bp.route('/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Admins do not have shopping carts'}), 400
        
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart:
        cart = Cart(user_id=int(user_id))
        db.session.add(cart)
        db.session.commit()
        
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    size = data.get('size', 'Regular (240mm)')
    
    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    # Check if item with same size already in cart
    item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id, size=size).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity, size=size)
        db.session.add(item)
        
    db.session.commit()
    return jsonify(cart.to_dict()), 200


@cart_bp.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart:
         return jsonify({'message': 'Cart not found'}), 404
         
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not item:
        return jsonify({'message': 'Cart item not found'}), 404
        
    data = request.get_json() or {}
    if 'quantity' in data:
        quantity = int(data.get('quantity'))
        if quantity <= 0:
            db.session.delete(item)
        else:
            item.quantity = quantity
            
    if 'size' in data:
        item.size = data.get('size')
        
    db.session.commit()
    return jsonify(cart.to_dict()), 200


@cart_bp.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart:
         return jsonify({'message': 'Cart not found'}), 404
         
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not item:
        return jsonify({'message': 'Cart item not found'}), 404
        
    db.session.delete(item)
    db.session.commit()
    return jsonify(cart.to_dict()), 200


@cart_bp.route('/sync', methods=['POST'])
@jwt_required()
def sync_cart():
    user_id = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=int(user_id)).first()
    if not cart:
        cart = Cart(user_id=int(user_id))
        db.session.add(cart)
        db.session.commit()
        
    # Expects list of { product_id, quantity, size }
    data = request.get_json() or {}
    items = data.get('items', [])
    
    for local_item in items:
        prod_id = local_item.get('product_id')
        qty = int(local_item.get('quantity', 1))
        sz = local_item.get('size')
        
        if not prod_id or not sz:
            continue
            
        # Check if item exists in db cart
        item = CartItem.query.filter_by(cart_id=cart.id, product_id=prod_id, size=sz).first()
        if item:
            item.quantity = max(item.quantity, qty) # merge by taking max or sum
        else:
            new_item = CartItem(cart_id=cart.id, product_id=prod_id, quantity=qty, size=sz)
            db.session.add(new_item)
            
    db.session.commit()
    return jsonify(cart.to_dict()), 200
