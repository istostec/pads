from datetime import datetime
from backend.extensions import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='SET NULL'), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    compare_at_price = db.Column(db.Numeric(10, 2))
    product_type = db.Column(db.String(100))
    features = db.Column(db.JSON) # JSON array of features
    sizes = db.Column(db.JSON) # JSON array of sizes
    stock_status = db.Column(db.String(50), default='In Stock') # 'In Stock', 'Low Stock', 'Out of Stock'
    status = db.Column(db.String(50), default='Active') # 'Active', 'Draft', 'Archived'
    amazon_link = db.Column(db.String(1000), default='')
    flipkart_link = db.Column(db.String(1000), default='')
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', cascade='all, delete-orphan', lazy=True)
    inventory = db.relationship('Inventory', backref='product', uselist=False, cascade='all, delete-orphan', lazy=True)
    reviews = db.relationship('Review', backref='product', cascade='all, delete-orphan', lazy=True)
    cart_items = db.relationship('CartItem', backref='product', cascade='all, delete-orphan', lazy=True)
    wishlist_entries = db.relationship('Wishlist', backref='product', cascade='all, delete-orphan', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def to_dict(self):
        primary_image = next((img.image_url for img in self.images if img.is_primary), None)
        if not primary_image and self.images:
            primary_image = self.images[0].image_url
            
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else 'Uncategorized',
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'price': float(self.price),
            'compare_at_price': float(self.compare_at_price) if self.compare_at_price else None,
            'product_type': self.product_type,
            'features': self.features or [],
            'sizes': self.sizes or [],
            'stock_status': self.stock_status,
            'status': self.status,
            'amazon_link': self.amazon_link or '',
            'flipkart_link': self.flipkart_link or '',
            'primary_image': primary_image,
            'images': [img.to_dict() for img in self.images],
            'quantity': self.inventory.quantity if self.inventory else 0,
            'low_stock_threshold': self.inventory.low_stock_threshold if self.inventory else 10,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(1000), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), unique=True, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    low_stock_threshold = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'low_stock_threshold': self.low_stock_threshold,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
