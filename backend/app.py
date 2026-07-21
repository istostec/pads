from flask import Flask, jsonify, render_template_string

# Allow running this file directly (python app.py) without failing `import backend.*`.
# If `python app.py` is run from `backend/`, the repo root is not on sys.path.
import sys
from pathlib import Path
_repo_root = Path(__file__).resolve().parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from backend.config import Config
from backend.extensions import db, migrate, bcrypt, jwt, cors
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
import os
# Blueprints
from backend.routes.auth import auth_bp
from backend.routes.users import users_bp
from backend.routes.products import products_bp
from backend.routes.categories import categories_bp
from backend.routes.orders import orders_bp
from backend.routes.payments import payments_bp
from backend.routes.cart import cart_bp
from backend.routes.wishlist import wishlist_bp
from backend.routes.reviews import reviews_bp
from backend.routes.blogs import blogs_bp
from backend.routes.faq import faq_bp
from backend.routes.contact import contact_bp
from backend.routes.admin import admin_bp
from backend.routes.bulk_inquiries import bulk_inquiries_bp
from backend.routes.uploads import uploads_bp




def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # Auto Create Database if not exists
    db_url = app.config.get("SQLALCHEMY_DATABASE_URI")

    url = make_url(db_url)
    db_name = url.database

    admin_url = url.set(database="postgres")

    engine = create_engine(admin_url)

    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")

        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname=:name"),
            {"name": db_name}
        ).scalar()

        if not exists:
            conn.execute(text(f'CREATE DATABASE "{db_name}"'))
            print(f"Database '{db_name}' created.")
        else:
            print(f"Database '{db_name}' already exists.")
    

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import all models
    import backend.models

    # Auto Create Tables
    with app.app_context():
        db.create_all()
        print("All tables created successfully.")
    # Enable CORS
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    # Serve uploaded images from /uploads/* (required for shop/product pages)
    from flask import send_from_directory
    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        # uploads directory is at repo root: <repo>/uploads
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        uploads_root = os.path.join(project_root, 'uploads')
        return send_from_directory(uploads_root, filename)


    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)

    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(wishlist_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(blogs_bp)
    app.register_blueprint(faq_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(bulk_inquiries_bp)
    app.register_blueprint(uploads_bp)


    # Home Route
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Jiyoni Sanitary Pads API Running Successfully',
            'status': 'success'
        })

    # Health Check Route
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'server': 'running'
        })

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'message': 'Requested API resource not found'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'message': 'An internal server error occurred'
        }), 500


    # Swagger Documentation UI
    @app.route('/api/docs')
    def get_docs():
        swagger_ui_html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Lumina Care API Documentation</title>
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css">
        </head>
        <body>
            <div id="swagger-ui"></div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>

            <script>
                window.onload = function() {
                    SwaggerUIBundle({
                        url: "/api/swagger.json",
                        dom_id: '#swagger-ui'
                    });
                };
            </script>
        </body>
        </html>
        """
        return render_template_string(swagger_ui_html)

    # Swagger JSON
    @app.route('/api/swagger.json')
    def swagger_json():
        return jsonify({
            "openapi": "3.0.0",
            "info": {
                "title": "Lumina Care API",
                "version": "1.0.0",
                "description": "REST API for Lumina Care"
            },
            "servers": [
                {
                    "url": "http://localhost:5000"
                }
            ],
            "paths": {
                "/api/auth/register": {
                    "post": {
                        "summary": "User Registration"
                    }
                },
                "/api/auth/login": {
                    "post": {
                        "summary": "User Login"
                    }
                },
                "/api/products": {
                    "get": {
                        "summary": "Get Products"
                    }
                }
            }
        })

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)