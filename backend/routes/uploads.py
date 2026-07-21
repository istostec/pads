from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from backend.extensions import db
import os
import uuid

uploads_bp = Blueprint('uploads', __name__, url_prefix='/api/uploads')

# NOTE: This is a minimal, single-purpose image upload helper.
# It DOES NOT change any existing product/business logic.


def is_admin(identity):
    return identity and identity.startswith('admin-')


ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def public_url_for(rel_path: str) -> str:
    # rel_path is like: uploads/products/<filename>
    # public URL should be /uploads/products/<filename>
    # Keep exactly that format to match frontend normalization and existing pages.
    rel_path = rel_path.replace('\\', '/')
    if rel_path.startswith('/'):
        rel_path = rel_path[1:]
    return f'/{rel_path}'


@uploads_bp.route('/products-images', methods=['POST'])
@jwt_required()
def upload_products_images():
    identity = get_jwt_identity()
    if not is_admin(identity):
        return jsonify({'message': 'Administrative privileges required'}), 403

    # Expect multipart/form-data. Field name: images (can be multiple)
    files = request.files.getlist('images')
    if not files:
        return jsonify({'message': 'No images uploaded'}), 400

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    dest_dir = os.path.join(project_root, 'uploads', 'products')
    ensure_dir(dest_dir)

    saved = []

    for f in files:
        if not f or not getattr(f, 'filename', None):
            continue

        # Validate size (best-effort; uses seek/tell)
        try:
            stream = f.stream
            stream.seek(0, os.SEEK_END)
            size = stream.tell()
            stream.seek(0)
        except Exception:
            size = None

        if size is not None and size > MAX_FILE_SIZE_BYTES:
            return jsonify({'message': 'Image too large. Max size is 5MB per image.'}), 400

        filename = secure_filename(f.filename)
        if '.' not in filename:
            return jsonify({'message': 'Invalid image filename'}), 400

        ext = filename.rsplit('.', 1)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify({'message': 'Invalid image type. Allowed: jpg, jpeg, png, webp'}), 400

        # UUID filename
        new_name = f'{uuid.uuid4()}.{ext}'
        dest_path = os.path.join(dest_dir, new_name)

        f.save(dest_path)

        rel_path = os.path.join('uploads', 'products', new_name)
        saved.append(public_url_for(rel_path))

    return jsonify({'success': True, 'images': saved}), 200

