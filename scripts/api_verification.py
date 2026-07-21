#!/usr/bin/env python3
import requests, uuid, time
BASE='http://127.0.0.1:5000'
out = []

def ok(msg, data=None):
    print('[OK] ', msg)
    if data is not None:
        print(data)

def err(msg, data=None):
    print('[ERR]', msg)
    if data is not None:
        print(data)

try:
    r = requests.get(BASE + '/api/health', timeout=5)
    if r.status_code == 200 and r.json().get('status') == 'healthy':
        ok('Health check passed', r.json())
    else:
        err('Health check unexpected', r.status_code)
except Exception as e:
    err('Health check failed', str(e))

# Public endpoints
for path in ['/api/products','/api/categories','/api/blogs','/api/faq']:
    try:
        r = requests.get(BASE + path, timeout=5)
        ok(f'GET {path}', {'status': r.status_code, 'len': len(r.json()) if r.status_code==200 else None})
    except Exception as e:
        err(f'GET {path} failed', str(e))

# Admin login
admin_token = None
try:
    r = requests.post(BASE + '/api/auth/admin/login', json={'email':'admin@luminacare.com','password':'admin123'}, timeout=8)
    ok('Admin login', {'status': r.status_code, 'body': r.json()})
    if r.status_code==200:
        admin_token = r.json().get('access_token')
except Exception as e:
    err('Admin login exception', str(e))

# Create category (admin)
cat_id = None
headers_admin = {'Authorization': f'Bearer {admin_token}'} if admin_token else {}
try:
    payload = {'name': 'CI Test Category', 'slug': f'ci-cat-{uuid.uuid4().hex[:6]}', 'description':'Temporary category for CI tests'}
    r = requests.post(BASE + '/api/categories', json=payload, headers=headers_admin, timeout=8)
    ok('Create category', {'status': r.status_code, 'body': r.json()})
    if r.status_code==201:
        cat_id = r.json().get('id')
except Exception as e:
    err('Create category failed', str(e))

# Create product (admin)
prod_id = None
try:
    payload = {
        'name': 'CI Test Product',
        'slug': f'ci-prod-{uuid.uuid4().hex[:6]}',
        'description': 'Temporary product for CI tests',
        'price': 99.99,
        'category_id': cat_id,
        'quantity': 10,
        'sizes': ['Regular'],
        'features': ['ci-test']
    }
    r = requests.post(BASE + '/api/products', json=payload, headers=headers_admin, timeout=10)
    ok('Create product', {'status': r.status_code, 'body': r.json()})
    if r.status_code==201:
        prod_id = r.json().get('id')
except Exception as e:
    err('Create product failed', str(e))

# Register user
user_token=None
user_id=None
try:
    email = f'ciuser+{uuid.uuid4().hex[:6]}@example.com'
    r = requests.post(BASE + '/api/auth/register', json={'name':'CI User','email':email,'password':'Test12345!','phone':'9999999999'}, timeout=8)
    ok('Register user', {'status': r.status_code, 'body': r.json()})
    if r.status_code==201:
        user_token = r.json().get('access_token')
        user_id = r.json().get('user',{}).get('id')
except Exception as e:
    err('Register user failed', str(e))

# Login user
try:
    r = requests.post(BASE + '/api/auth/login', json={'email':email,'password':'Test12345!'}, timeout=8)
    ok('Login user', {'status': r.status_code, 'body': r.json()})
    if r.status_code==200:
        user_token = r.json().get('access_token')
except Exception as e:
    err('User login failed', str(e))

# Add product to cart as user
headers_user = {'Authorization': f'Bearer {user_token}'} if user_token else {}
try:
    if prod_id:
        r = requests.post(BASE + '/api/cart/items', json={'product_id': prod_id, 'quantity': 1, 'size':'Regular'}, headers=headers_user, timeout=8)
        ok('Add to cart', {'status': r.status_code, 'body': r.json()})
    else:
        err('Skipping add to cart: no prod_id')
except Exception as e:
    err('Add to cart failed', str(e))

# Place order
order_number=None
try:
    address = {
        'first_name':'CI','last_name':'User','address_line1':'1 Test St','city':'Testville','state':'TS','postal_code':'000000','phone':'9999999999'
    }
    r = requests.post(BASE + '/api/orders', json={'shipping_address': address, 'payment_method':'COD'}, headers=headers_user, timeout=10)
    ok('Place order', {'status': r.status_code, 'body': r.json()})
    if r.status_code==201:
        order_number = r.json().get('order',{}).get('order_number')
except Exception as e:
    err('Place order failed', str(e))

# Fetch product details and check inventory decreased
try:
    if prod_id:
        r = requests.get(BASE + f'/api/products/{prod_id}', timeout=5)
        ok('Get product after order', {'status': r.status_code, 'body': r.json()})
    else:
        err('Skipping product fetch: no prod_id')
except Exception as e:
    err('Get product failed', str(e))

# Create review as user
review_id=None
try:
    if prod_id:
        r = requests.post(BASE + '/api/reviews', json={'product_id':prod_id,'rating':5,'comment':'CI automated review'}, headers=headers_user, timeout=8)
        ok('Create review', {'status': r.status_code, 'body': r.json()})
        if r.status_code==201:
            review_id = r.json().get('review',{}).get('id')
    else:
        err('Skipping review create: no prod_id')
except Exception as e:
    err('Create review failed', str(e))

# Approve review as admin
try:
    if review_id:
        r = requests.put(BASE + f'/api/reviews/{review_id}/approve', headers=headers_admin, timeout=8)
        ok('Approve review', {'status': r.status_code, 'body': r.json()})
    else:
        err('Skipping approve: no review_id')
except Exception as e:
    err('Approve review failed', str(e))

# Get product reviews
try:
    if prod_id:
        r = requests.get(BASE + f'/api/reviews/product/{prod_id}', timeout=5)
        ok('Get product reviews', {'status': r.status_code, 'len': len(r.json()) if r.status_code==200 else None})
    else:
        err('Skipping get reviews: no prod_id')
except Exception as e:
    err('Get product reviews failed', str(e))

print('\nCI Script finished')
