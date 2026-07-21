from datetime import datetime
from backend.extensions import db

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False) # 1 to 5
    title = db.Column(db.String(255))
    comment = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Pending') # 'Pending', 'Approved', 'Rejected'
    image_url = db.Column(db.String(1000), default='')
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Anonymous Customer',
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown Product',
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'status': self.status,
            'image_url': self.image_url or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
