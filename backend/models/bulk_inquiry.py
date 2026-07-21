from datetime import datetime
from backend.extensions import db


class BulkInquiry(db.Model):
    __tablename__ = 'bulk_inquiries'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    mobile_number = db.Column(db.String(50), nullable=False)
    email_address = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(20), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text)

    # Processing status
    # NOTE: Some DB schema versions may not have this column.
    # To avoid 500s (ProgrammingError: column bulk_inquiries.status does not exist),
    # treat status as an optional attribute at the model level.
    status = db.Column(db.String(50), default='New Inquiry', nullable=True)  # 'New Inquiry', 'Contacted', 'In Discussion', 'Completed'


    # Admin UI flag: mark as read/unread
    is_read = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'company_name': self.company_name,
            'mobile_number': self.mobile_number,
            'email_address': self.email_address,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'message': self.message,
            'status': self.status,
            'is_read': bool(self.is_read),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

