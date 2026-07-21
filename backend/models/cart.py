from datetime import datetime
from backend.extensions import db

class Cart(db.Model):
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('CartItem', backref='cart', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'items': [item.to_dict() for item in self.items],
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    size = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint check
    __table_args__ = (
        db.UniqueConstraint('cart_id', 'product_id', 'size', name='uq_cart_product_size'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown Product',
            'product_slug': self.product.slug if self.product else 'unknown',
            'product_price': float(self.product.price) if self.product else 0.0,
            'product_image': next((img.image_url for img in self.product.images if img.is_primary), None) if self.product and self.product.images else None,
            'quantity': self.quantity,
            'size': self.size,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Wishlist(db.Model):
    __tablename__ = 'wishlist'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    
    # Unique constraint check
    __table_args__ = (
        db.UniqueConstraint('user_id', 'product_id', name='uq_user_wishlist'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown Product',
            'product_slug': self.product.slug if self.product else 'unknown',
            'product_price': float(self.product.price) if self.product else 0.0,
            'product_image': next((img.image_url for img in self.product.images if img.is_primary), None) if self.product and self.product.images else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
