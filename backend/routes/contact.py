from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.contact import ContactMessage
from backend.models.newsletter import NewsletterSubscriber

contact_bp = Blueprint('contact', __name__, url_prefix='/api/contact')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@contact_bp.route('/messages', methods=['POST'])
def send_message():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    subject = data.get('subject', 'General Inquiry')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({'message': 'Name, email, and message body are required'}), 400
        
    msg = ContactMessage(name=name, email=email, phone=phone, subject=subject, message=message)
    db.session.add(msg)
    db.session.commit()
    
    return jsonify({
        'message': 'Message sent successfully. Our wellness team will reach out to you shortly.',
        'message_id': msg.id
    }), 201


@contact_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([msg.to_dict() for msg in messages]), 200


@contact_bp.route('/messages/<int:msg_id>', methods=['PUT'])
@jwt_required()
def update_message_status(msg_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    msg = ContactMessage.query.get(msg_id)
    if not msg:
        return jsonify({'message': 'Message not found'}), 404
        
    data = request.get_json() or {}
    msg.status = data.get('status', msg.status) # 'New', 'Read', 'Replied'
    db.session.commit()
    
    return jsonify({'message': 'Message status updated successfully', 'msg': msg.to_dict()}), 200


@contact_bp.route('/messages/<int:msg_id>', methods=['DELETE'])
@jwt_required()
def delete_message(msg_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    msg = ContactMessage.query.get(msg_id)
    if not msg:
        return jsonify({'message': 'Message not found'}), 404
        
    db.session.delete(msg)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully'}), 200


# Newsletter Endpoints
@contact_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    data = request.get_json() or {}
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email address is required'}), 400
        
    existing = NewsletterSubscriber.query.filter_by(email=email).first()
    if existing:
        if not existing.active:
            existing.active = True
            db.session.commit()
        return jsonify({'message': 'You have already subscribed to Lumina newsletter!'}), 200
        
    sub = NewsletterSubscriber(email=email)
    db.session.add(sub)
    db.session.commit()
    return jsonify({'message': 'Thank you for subscribing to Lumina Care newsletters!'}), 201


@contact_bp.route('/newsletter/subscribers', methods=['GET'])
@jwt_required()
def get_subscribers():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    subscribers = NewsletterSubscriber.query.order_by(NewsletterSubscriber.created_at.desc()).all()
    return jsonify([sub.to_dict() for sub in subscribers]), 200
