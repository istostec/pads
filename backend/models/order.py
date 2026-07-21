from datetime import datetime
from backend.extensions import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    order_number = db.Column(db.String(100), unique=True, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(10, 2), default=0.00)
    shipping_fee = db.Column(db.Numeric(10, 2), default=0.00)
    final_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='Pending') # 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    coupon_code = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='Pending') # 'Pending', 'Paid', 'Failed', 'Refunded'
    payment_method = db.Column(db.String(50)) # 'Stripe', 'Razorpay', 'COD'
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan', lazy=True)
    payments = db.relationship('Payment', backref='order', cascade='all, delete-orphan', lazy=True)
    shipping_addresses = db.relationship('ShippingAddress', backref='order', lazy=True)

    def to_dict(self):
        address = self.shipping_addresses[0].to_dict() if self.shipping_addresses else None
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'total_amount': float(self.total_amount),
            'discount_amount': float(self.discount_amount),
            'shipping_fee': float(self.shipping_fee),
            'final_amount': float(self.final_amount),
            'status': self.status,
            'coupon_code': self.coupon_code,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'items': [item.to_dict() for item in self.items],
            'shipping_address': address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='SET NULL'), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    size = db.Column(db.String(50))
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Deleted Product',
            'product_slug': self.product.slug if self.product else 'deleted',
            'quantity': self.quantity,
            'price': float(self.price),
            'size': self.size,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    transaction_id = db.Column(db.String(255), nullable=False)
    gateway = db.Column(db.String(50), nullable=False) # 'Stripe', 'Razorpay'
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False) # 'Success', 'Failed', 'Pending'
    raw_response = db.Column(db.JSON)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'transaction_id': self.transaction_id,
            'gateway': self.gateway,
            'amount': float(self.amount),
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
