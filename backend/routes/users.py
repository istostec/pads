from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.user import User, ShippingAddress

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    if identity.startswith('admin-'):
        return jsonify({'message': 'Admin profiles must be updated by system administrators'}), 403
        
    user = User.query.get(int(identity))
    if not user:
        return jsonify({'message': 'User profile not found'}), 404
        
    data = request.get_json() or {}
    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    
    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200


@users_bp.route('/addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
         return jsonify([]), 200
         
    addresses = ShippingAddress.query.filter_by(user_id=int(user_id)).order_by(ShippingAddress.is_default.desc()).all()
    return jsonify([addr.to_dict() for addr in addresses]), 200


@users_bp.route('/addresses', methods=['POST'])
@jwt_required()
def add_address():
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Administrators do not require delivery addresses'}), 403
        
    data = request.get_json() or {}
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address_line1 = data.get('address_line1')
    address_line2 = data.get('address_line2')
    city = data.get('city')
    state = data.get('state')
    postal_code = data.get('postal_code')
    phone = data.get('phone')
    is_default = data.get('is_default', False)
    
    if not first_name or not last_name or not address_line1 or not city or not state or not postal_code or not phone:
        return jsonify({'message': 'Missing required fields'}), 400
        
    # If this is default, remove other defaults
    if is_default:
        ShippingAddress.query.filter_by(user_id=int(user_id)).update({ShippingAddress.is_default: False})
        
    address = ShippingAddress(
        user_id=int(user_id),
        first_name=first_name,
        last_name=last_name,
        address_line1=address_line1,
        address_line2=address_line2,
        city=city,
        state=state,
        postal_code=postal_code,
        phone=phone,
        is_default=is_default
    )
    
    db.session.add(address)
    db.session.commit()
    
    return jsonify({
        'message': 'Address added successfully',
        'address': address.to_dict()
    }), 201


@users_bp.route('/addresses/<int:address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Unauthorized'}), 403
        
    address = ShippingAddress.query.filter_by(id=address_id, user_id=int(user_id)).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404
        
    data = request.get_json() or {}
    address.first_name = data.get('first_name', address.first_name)
    address.last_name = data.get('last_name', address.last_name)
    address.address_line1 = data.get('address_line1', address.address_line1)
    address.address_line2 = data.get('address_line2', address.address_line2)
    address.city = data.get('city', address.city)
    address.state = data.get('state', address.state)
    address.postal_code = data.get('postal_code', address.postal_code)
    address.phone = data.get('phone', address.phone)
    
    is_default = data.get('is_default', address.is_default)
    if is_default and not address.is_default:
        ShippingAddress.query.filter_by(user_id=int(user_id)).update({ShippingAddress.is_default: False})
        address.is_default = True
        
    db.session.commit()
    return jsonify({
        'message': 'Address updated successfully',
        'address': address.to_dict()
    }), 200


@users_bp.route('/addresses/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    user_id = get_jwt_identity()
    if user_id.startswith('admin-'):
        return jsonify({'message': 'Unauthorized'}), 403
        
    address = ShippingAddress.query.filter_by(id=address_id, user_id=int(user_id)).first()
    if not address:
        return jsonify({'message': 'Address not found'}), 404
        
    db.session.delete(address)
    db.session.commit()
    return jsonify({'message': 'Address deleted successfully'}), 200
