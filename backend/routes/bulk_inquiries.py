from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.extensions import db
from backend.models.bulk_inquiry import BulkInquiry

bulk_inquiries_bp = Blueprint('bulk_inquiries', __name__, url_prefix='/api/inquiries')

def is_admin(identity):
    return identity and identity.startswith('admin-')

@bulk_inquiries_bp.route('', methods=['POST'])
def create_inquiry():
    data = request.get_json() or {}
    full_name = data.get('full_name')
    company_name = data.get('company_name')
    mobile_number = data.get('mobile_number')
    email_address = data.get('email_address')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    pincode = data.get('pincode')
    product_name = data.get('product_name')
    quantity = data.get('quantity')
    message = data.get('message', '')

    if not all([full_name, company_name, mobile_number, email_address, address, city, state, pincode, product_name, quantity]):
        return jsonify({'message': 'All inquiry fields except additional message are required'}), 400

    try:
        quantity = int(quantity)
    except ValueError:
        return jsonify({'message': 'Quantity must be an integer'}), 400

    inquiry = BulkInquiry(
        full_name=full_name,
        company_name=company_name,
        mobile_number=mobile_number,
        email_address=email_address,
        address=address,
        city=city,
        state=state,
        pincode=pincode,
        product_name=product_name,
        quantity=quantity,
        message=message,
        status='New Inquiry'
    )

    db.session.add(inquiry)
    db.session.commit()

    return jsonify({
        'message': 'Inquiry submitted successfully',
        'inquiry': inquiry.to_dict()
    }), 201

@bulk_inquiries_bp.route('', methods=['GET'])
@jwt_required()
def get_inquiries():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    search_query = request.args.get('search')
    status = request.args.get('status')
    is_read = request.args.get('is_read')  # optional: true/false

    # Pagination (optional)
    try:
        page = int(request.args.get('page', 1))
    except ValueError:
        page = 1

    try:
        page_size = int(request.args.get('page_size', 20))
    except ValueError:
        page_size = 20

    page = max(page, 1)
    page_size = max(min(page_size, 100), 1)

    query = BulkInquiry.query

    if search_query:
        query = query.filter(
            (BulkInquiry.full_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.company_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.email_address.ilike(f'%{search_query}%')) |
            (BulkInquiry.product_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.mobile_number.ilike(f'%{search_query}%'))
        )

    if status:
        query = query.filter(BulkInquiry.status == status)

    if is_read is not None and str(is_read).strip() != '':
        lowered = str(is_read).strip().lower()
        if lowered in ['true', '1', 'yes']:
            query = query.filter(BulkInquiry.is_read.is_(True))
        elif lowered in ['false', '0', 'no']:
            query = query.filter(BulkInquiry.is_read.is_(False))

    base_q = query
    total = base_q.count()

    inquiries = (
        base_q.order_by(BulkInquiry.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return jsonify({
        'items': [i.to_dict() for i in inquiries],
        'total': total,
        'page': page,
        'page_size': page_size,
    }), 200


@bulk_inquiries_bp.route('/<int:inquiry_id>/read', methods=['PUT'])
@jwt_required()
def mark_inquiry_read(inquiry_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    inquiry = BulkInquiry.query.get(inquiry_id)
    if not inquiry:
        return jsonify({'message': 'Inquiry not found'}), 404

    data = request.get_json() or {}
    is_read = data.get('is_read', True)

    # Normalize boolean-like values
    if isinstance(is_read, str):
        is_read_norm = is_read.strip().lower() in ['true', '1', 'yes']
    else:
        is_read_norm = bool(is_read)

    inquiry.is_read = is_read_norm
    db.session.commit()

    return jsonify({
        'message': 'Inquiry read state updated successfully',
        'inquiry': inquiry.to_dict()
    }), 200


@bulk_inquiries_bp.route('/<int:inquiry_id>/status', methods=['PUT'])
@jwt_required()
def update_inquiry_status(inquiry_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    inquiry = BulkInquiry.query.get(inquiry_id)
    if not inquiry:
        return jsonify({'message': 'Inquiry not found'}), 404

    data = request.get_json() or {}
    status = data.get('status')
    if not status or status not in ['New Inquiry', 'Contacted', 'In Discussion', 'Completed']:
        return jsonify({'message': 'Invalid status. Status must be: New Inquiry, Contacted, In Discussion, Completed'}), 400

    inquiry.status = status
    db.session.commit()

    return jsonify({
        'message': 'Inquiry status updated successfully',
        'inquiry': inquiry.to_dict()
    }), 200

@bulk_inquiries_bp.route('/export', methods=['GET'])
@jwt_required()
def export_inquiries_csv():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    search_query = request.args.get('search')
    status = request.args.get('status')

    query = BulkInquiry.query

    if search_query:
        query = query.filter(
            (BulkInquiry.full_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.company_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.email_address.ilike(f'%{search_query}%')) |
            (BulkInquiry.product_name.ilike(f'%{search_query}%')) |
            (BulkInquiry.mobile_number.ilike(f'%{search_query}%'))
        )

    if status:
        query = query.filter(BulkInquiry.status == status)

    inquiries = query.order_by(BulkInquiry.created_at.desc()).all()

    import csv
    import io

    si = io.StringIO()
    writer = csv.writer(si)
    writer.writerow([
        'id','full_name','company_name','mobile_number','email_address','address','city','state','pincode',
        'product_name','quantity','message','status','is_read','created_at','updated_at'
    ])

    for i in inquiries:
        writer.writerow([
            i.id,
            i.full_name,
            i.company_name,
            i.mobile_number,
            i.email_address,
            i.address,
            i.city,
            i.state,
            i.pincode,
            i.product_name,
            i.quantity,
            i.message,
            i.status,
            bool(i.is_read),
            i.created_at.isoformat() if i.created_at else '',
            i.updated_at.isoformat() if i.updated_at else '',
        ])

    output = si.getvalue()

    from flask import Response
    return Response(
        output,
        mimetype='text/csv',
        headers={
            'Content-Disposition': 'attachment; filename="bulk_inquiries.csv"'
        }
    )


@bulk_inquiries_bp.route('/<int:inquiry_id>', methods=['DELETE'])
@jwt_required()
def delete_inquiry(inquiry_id):
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    inquiry = BulkInquiry.query.get(inquiry_id)
    if not inquiry:
        return jsonify({'message': 'Inquiry not found'}), 404

    db.session.delete(inquiry)
    db.session.commit()

    return jsonify({'message': 'Inquiry deleted successfully'}), 200
