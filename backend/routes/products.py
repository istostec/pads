from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime
import re
from backend.extensions import db
from backend.models.product import Product, ProductImage, Inventory
from backend.models.category import Category

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

# Helper to check admin role
def is_admin(identity):
    return identity and identity.startswith('admin-')

@products_bp.route('', methods=['GET'])
def get_products():
    category_slug = request.args.get('category')
    search_query = request.args.get('search')
    sort_by = request.args.get('sort_by') # 'price_low_high', 'price_high_low', 'newest'
    status_filter = request.args.get('status', 'Active') # Admins can view Draft/Archived
    
    query = Product.query
    
    # Filter by category slug if provided
    if category_slug:
        category = Category.query.filter_by(slug=category_slug).first()
        if category:
            query = query.filter(Product.category_id == category.id)
            
    # Filter by search term
    if search_query:
        query = query.filter(
            (Product.name.ilike(f'%{search_query}%')) | 
            (Product.description.ilike(f'%{search_query}%')) |
            (Product.product_type.ilike(f'%{search_query}%'))
        )
        
    # Standard storefront only displays active products unless specifically requested by admin
    if status_filter != 'all':
        query = query.filter(Product.status == status_filter)
        
    # Sort
    if sort_by == 'price_low_high':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_high_low':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.id.asc())
        
    products = query.all()
    return jsonify([p.to_dict() for p in products]), 200


@products_bp.route('/<string:id_or_slug>', methods=['GET'])
def get_product(id_or_slug):
    product = None
    if id_or_slug.isdigit():
        product = Product.query.get(int(id_or_slug))
    if not product:
        product = Product.query.filter_by(slug=id_or_slug).first()
        
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    return jsonify(product.to_dict()), 200


@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    data = request.get_json() or {}
    name = data.get('name')
    slug = data.get('slug')
    description = data.get('description')
    price = data.get('price')
    compare_at_price = data.get('compare_at_price')
    category_name = data.get('category_name', '').strip()
    product_type = data.get('product_type')
    features = data.get('features', []) # list
    sizes = data.get('sizes', []) # list
    stock_status = data.get('stock_status', 'In Stock')
    status = data.get('status', 'Active')
    primary_image_url = data.get('primary_image')
    additional_images = data.get('images', []) # list of strings
    quantity = data.get('quantity', 0)
    low_stock_threshold = data.get('low_stock_threshold', 10)
    amazon_link = data.get('amazon_link', '')
    flipkart_link = data.get('flipkart_link', '')
    
    if not name or not price or not slug:
        return jsonify({'message': 'Name, price, and unique slug are required fields'}), 400
        
    if Product.query.filter_by(slug=slug).first():
        return jsonify({'message': 'Product with this slug already exists'}), 409
    
    # Resolve or auto-create category from text input
    category_id = None
    if category_name:
        category = Category.query.filter(func.lower(Category.name) == func.lower(category_name)).first()
        if not category:
            cat_slug = re.sub(r'[^a-z0-9-]', '', category_name.lower().replace(' ', '-'))
            existing_slug = Category.query.filter_by(slug=cat_slug).first()
            if existing_slug:
                cat_slug = f"{cat_slug}-{int(datetime.utcnow().timestamp())}"
            category = Category(name=category_name, slug=cat_slug, description='')
            db.session.add(category)
            db.session.flush()
        category_id = category.id
        
    product = Product(
        name=name,
        slug=slug,
        description=description,
        price=price,
        compare_at_price=compare_at_price,
        category_id=category_id,
        product_type=product_type,
        features=features,
        sizes=sizes,
        stock_status=stock_status,
        status=status,
        amazon_link=amazon_link,
        flipkart_link=flipkart_link
    )
    
    db.session.add(product)
    db.session.commit()
    
    # Save Images
    if primary_image_url:
        img_primary = ProductImage(product_id=product.id, image_url=primary_image_url, is_primary=True)
        db.session.add(img_primary)
        
    for idx, img_url in enumerate(additional_images):
        # Prevent duplicates with primary
        if img_url != primary_image_url:
            img = ProductImage(product_id=product.id, image_url=img_url, is_primary=False)
            db.session.add(img)
            
    # Initialize Inventory
    inv = Inventory(product_id=product.id, quantity=quantity, low_stock_threshold=low_stock_threshold)
    db.session.add(inv)
    
    db.session.commit()
    return jsonify(product.to_dict()), 201
 
 
@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    data = request.get_json() or {}
    product.name = data.get('name', product.name)
    product.slug = data.get('slug', product.slug)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.compare_at_price = data.get('compare_at_price', product.compare_at_price)
    
    # Resolve or auto-create category from text input
    category_name = data.get('category_name', '').strip()
    if category_name:
        category = Category.query.filter(func.lower(Category.name) == func.lower(category_name)).first()
        if not category:
            cat_slug = re.sub(r'[^a-z0-9-]', '', category_name.lower().replace(' ', '-'))
            existing_slug = Category.query.filter_by(slug=cat_slug).first()
            if existing_slug:
                cat_slug = f"{cat_slug}-{int(datetime.utcnow().timestamp())}"
            category = Category(name=category_name, slug=cat_slug, description='')
            db.session.add(category)
            db.session.flush()
        product.category_id = category.id
    
    product.product_type = data.get('product_type', product.product_type)
    product.features = data.get('features', product.features)
    product.sizes = data.get('sizes', product.sizes)
    product.stock_status = data.get('stock_status', product.stock_status)
    product.status = data.get('status', product.status)
    product.amazon_link = data.get('amazon_link', product.amazon_link)
    product.flipkart_link = data.get('flipkart_link', product.flipkart_link)
    
    # Update inventory
    if product.inventory:
        product.inventory.quantity = data.get('quantity', product.inventory.quantity)
        product.inventory.low_stock_threshold = data.get('low_stock_threshold', product.inventory.low_stock_threshold)
    else:
        inv = Inventory(product_id=product.id, quantity=data.get('quantity', 0), low_stock_threshold=data.get('low_stock_threshold', 10))
        db.session.add(inv)
        
    # Update Images if provided
    if 'primary_image' in data or 'images' in data:
        # Simple policy: wipe and rewrite images
        ProductImage.query.filter_by(product_id=product_id).delete()
        primary_image_url = data.get('primary_image')
        if primary_image_url:
            db.session.add(ProductImage(product_id=product.id, image_url=primary_image_url, is_primary=True))
        for img_url in data.get('images', []):
            if img_url != primary_image_url:
                db.session.add(ProductImage(product_id=product.id, image_url=img_url, is_primary=False))
                
    db.session.commit()
    return jsonify(product.to_dict()), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200
