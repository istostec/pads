from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.faq import FAQ

faq_bp = Blueprint('faq', __name__, url_prefix='/api/faq')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@faq_bp.route('', methods=['GET'])
def get_faqs():
    faqs = FAQ.query.order_by(FAQ.order_index.asc(), FAQ.id.asc()).all()
    return jsonify([f.to_dict() for f in faqs]), 200


@faq_bp.route('', methods=['POST'])
@jwt_required()
def create_faq():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    data = request.get_json() or {}
    question = data.get('question')
    answer = data.get('answer')
    category = data.get('category', 'Products')
    order_index = int(data.get('order_index', 0))
    
    if not question or not answer:
        return jsonify({'message': 'Question and answer are required fields'}), 400
        
    faq = FAQ(question=question, answer=answer, category=category, order_index=order_index)
    db.session.add(faq)
    db.session.commit()
    
    return jsonify(faq.to_dict()), 201


@faq_bp.route('/<int:faq_id>', methods=['PUT'])
@jwt_required()
def update_faq(faq_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({'message': 'FAQ entry not found'}), 404
        
    data = request.get_json() or {}
    faq.question = data.get('question', faq.question)
    faq.answer = data.get('answer', faq.answer)
    faq.category = data.get('category', faq.category)
    faq.order_index = int(data.get('order_index', faq.order_index))
    
    db.session.commit()
    return jsonify(faq.to_dict()), 200


@faq_bp.route('/<int:faq_id>', methods=['DELETE'])
@jwt_required()
def delete_faq(faq_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({'message': 'FAQ entry not found'}), 404
        
    db.session.delete(faq)
    db.session.commit()
    return jsonify({'message': 'FAQ entry deleted successfully'}), 200
