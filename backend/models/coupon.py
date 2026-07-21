from datetime import datetime
from backend.extensions import db

class Coupon(db.Model):
    __tablename__ = 'coupons'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    discount_type = db.Column(db.String(20), nullable=False) # 'Percentage', 'Fixed'
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    min_purchase_amount = db.Column(db.Numeric(10, 2), default=0.00)
    max_discount_amount = db.Column(db.Numeric(10, 2))
    expiration_date = db.Column(db.DateTime(timezone=True))
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def is_valid(self, cart_total):
        # Check active status
        if not self.active:
            return False
            
        # Check expiration date
        if self.expiration_date and self.expiration_date < datetime.utcnow():
            return False
            
        # Check min purchase constraint
        if cart_total < float(self.min_purchase_amount):
            return False
            
        return True

    def calculate_discount(self, cart_total):
        if not self.is_valid(cart_total):
            return 0.00
            
        if self.discount_type == 'Percentage':
            discount = cart_total * (float(self.discount_value) / 100.00)
            if self.max_discount_amount:
                discount = min(discount, float(self.max_discount_amount))
            return round(discount, 2)
        elif self.discount_type == 'Fixed':
            discount = float(self.discount_value)
            return min(discount, cart_total)
            
        return 0.00

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_purchase_amount': float(self.min_purchase_amount),
            'max_discount_amount': float(self.max_discount_amount) if self.max_discount_amount else None,
            'expiration_date': self.expiration_date.isoformat() if self.expiration_date else None,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
