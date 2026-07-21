from datetime import datetime
from backend.extensions import db

class FAQ(db.Model):
    __tablename__ = 'faq'
    
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False) # 'Products', 'Shipping', 'Returns', 'Subscription'
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'category': self.category,
            'order_index': self.order_index,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
