from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from backend.extensions import db
from backend.models.blog import BlogPost

blogs_bp = Blueprint('blogs', __name__, url_prefix='/api/blogs')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@blogs_bp.route('', methods=['GET'])
def get_blogs():
    # Storefront only displays 'Published' blogs. Admin can request 'all'
    status_filter = request.args.get('status', 'Published')
    
    query = BlogPost.query
    if status_filter != 'all':
        query = query.filter(BlogPost.status == 'Published')
        
    posts = query.order_by(BlogPost.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts]), 200


@blogs_bp.route('/<string:id_or_slug>', methods=['GET'])
def get_blog(id_or_slug):
    post = None
    if id_or_slug.isdigit():
        post = BlogPost.query.get(int(id_or_slug))
    if not post:
        post = BlogPost.query.filter_by(slug=id_or_slug).first()
        
    if not post:
        return jsonify({'message': 'Article not found'}), 404
        
    return jsonify(post.to_dict()), 200


@blogs_bp.route('', methods=['POST'])
@jwt_required()
def create_blog():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    data = request.get_json() or {}
    title = data.get('title')
    slug = data.get('slug')
    content = data.get('content')
    image_url = data.get('image_url')
    author = data.get('author', 'Lumina Health Editorial')
    status = data.get('status', 'Draft')
    
    if not title or not slug or not content:
        return jsonify({'message': 'Title, unique slug, and content are required'}), 400
        
    if BlogPost.query.filter_by(slug=slug).first():
        return jsonify({'message': 'A blog post with this slug already exists'}), 409
        
    post = BlogPost(
        title=title,
        slug=slug,
        content=content,
        image_url=image_url,
        author=author,
        status=status,
        published_at=datetime.utcnow() if status == 'Published' else None
    )
    
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


@blogs_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_blog(post_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    post = BlogPost.query.get(post_id)
    if not post:
        return jsonify({'message': 'Article not found'}), 404
        
    data = request.get_json() or {}
    post.title = data.get('title', post.title)
    post.slug = data.get('slug', post.slug)
    post.content = data.get('content', post.content)
    post.image_url = data.get('image_url', post.image_url)
    post.author = data.get('author', post.author)
    
    old_status = post.status
    new_status = data.get('status', post.status)
    post.status = new_status
    
    if new_status == 'Published' and old_status != 'Published':
        post.published_at = datetime.utcnow()
        
    db.session.commit()
    return jsonify(post.to_dict()), 200


@blogs_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(post_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    post = BlogPost.query.get(post_id)
    if not post:
        return jsonify({'message': 'Article not found'}), 404
        
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Article deleted successfully'}), 200
