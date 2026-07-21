from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.category import Category

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@categories_bp.route('', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.id.asc()).all()
    return jsonify([c.to_dict() for c in categories]), 200


@categories_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    data = request.get_json() or {}
    name = data.get('name')
    slug = data.get('slug')
    description = data.get('description')
    image_url = data.get('image_url')
    
    if not name or not slug:
        return jsonify({'message': 'Category name and slug are required'}), 400
        
    if Category.query.filter_by(slug=slug).first():
        return jsonify({'message': 'Category with this slug already exists'}), 409
        
    category = Category(name=name, slug=slug, description=description, image_url=image_url)
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201


@categories_bp.route('/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
        
    data = request.get_json() or {}
    category.name = data.get('name', category.name)
    category.slug = data.get('slug', category.slug)
    category.description = data.get('description', category.description)
    category.image_url = data.get('image_url', category.image_url)
    
    db.session.commit()
    return jsonify(category.to_dict()), 200


@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Category not found'}), 404
        
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200
