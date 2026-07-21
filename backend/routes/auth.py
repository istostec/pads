from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.user import User
from backend.models.admin import Admin
from backend.models.cart import Cart

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    
    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields (name, email, password)'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email address already registered'}), 409
        
    user = User(name=name, email=email, phone=phone)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    # Initialize an empty cart for this user
    cart = Cart(user_id=user.id)
    db.session.add(cart)
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Registration successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401
        
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
        
    admin = Admin.query.filter_by(email=email).first()
    

        
    if not admin or not admin.check_password(password):
        return jsonify({'message': 'Invalid admin credentials'}), 401
        
    # Standard Admin identity starts with admin- prefix to distinguish roles
    access_token = create_access_token(identity=f'admin-{admin.id}')
    refresh_token = create_refresh_token(identity=f'admin-{admin.id}')
    
    return jsonify({
        'message': 'Admin login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'admin': admin.to_dict()
    }), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
        
    user = User.query.filter_by(email=email).first()
    admin = Admin.query.filter_by(email=email).first()
    
    if not user and not admin:
        return jsonify({'message': 'Email address not found'}), 404
        
    # In a real production system we would generate a JWT token or code and email it.
    # For demo ease, we return a mock link with token
    reset_token = create_access_token(identity=email, expires_delta=False)
    return jsonify({
        'message': 'Password reset instructions have been simulated.',
        'reset_token': reset_token,
        'reset_url': f'/reset-password?token={reset_token}'
    }), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    password = data.get('password')
    token = data.get('token')
    
    if not password or not token:
        return jsonify({'message': 'Password and reset token are required'}), 400
        
    try:
        # Decrypt identity from custom token
        from flask_jwt_extended import decode_token
        decoded = decode_token(token)
        email = decoded['sub']
    except Exception:
        return jsonify({'message': 'Invalid or expired reset token'}), 400
        
    user = User.query.filter_by(email=email).first()
    admin = Admin.query.filter_by(email=email).first()
    
    if user:
        user.set_password(password)
        db.session.commit()
    elif admin:
        admin.set_password(password)
        db.session.commit()
    else:
        return jsonify({'message': 'Account not found for email'}), 404
        
    return jsonify({'message': 'Password has been updated successfully'}), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()

    if identity.startswith('admin-'):
        admin_id = identity.replace('admin-', '')
        admin = Admin.query.get(int(admin_id))
        if not admin:
            return jsonify({'success': False, 'message': 'Admin session invalid'}), 401

        profile = admin.to_dict()
        return jsonify({'success': True, 'user': profile}), 200

    user = User.query.get(int(identity))
    if not user:
        return jsonify({'success': False, 'message': 'User profile invalid'}), 401

    profile = user.to_dict()

    # Ensure required frontend shape fields exist
    # (role may be optional in DB schema)
    if 'role' not in profile:
        profile['role'] = 'user'

    return jsonify({'success': True, 'user': profile}), 200

