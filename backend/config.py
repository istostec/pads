import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'lumina-care-super-secret-key-13579')
    
    # Database Configuration - Connects to local PostgreSQL database 'pads'
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'postgresql://postgres:jay3234@localhost:5432/pads'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Extended Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'lumina-jwt-secret-key-24680')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Payment Gateway Keys (Razorpay & Stripe mock configurations)
    STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY', 'pk_test_mock_lumina')
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_mock_lumina')
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_mock_lumina')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'rzp_secret_mock_lumina')
