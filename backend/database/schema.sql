-- Lumina Care PostgreSQL Database Schema Setup
-- Database: pads

-- Enable UUID extension if needed, though we use SERIAL keys as requested
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean existing tables if they exist (ordered by dependency)
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS faq CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- 2. Admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'superadmin', 'admin', 'moderator'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_admins_email ON admins(email);

-- 3. Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_categories_slug ON categories(slug);

-- 4. Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    product_type VARCHAR(100), -- 'Organic Pad', 'Eco-panty liner', 'Maternity Pad', etc.
    features JSONB, -- Array of features
    sizes JSONB, -- Array of sizes/dimensions available
stock_status VARCHAR(50) DEFAULT 'In Stock', -- 'In Stock', 'Low Stock', 'Out of Stock'
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Draft', 'Archived'
    amazon_link VARCHAR(1000) DEFAULT '',
    flipkart_link VARCHAR(1000) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);

-- 5. Product Images table
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- 6. Inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Cart table (User's active shopping cart session)
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Cart Items table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    size VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cart_product_size UNIQUE(cart_id, product_id, size)
);

-- 9. Wishlist table
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_wishlist UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- 10. Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    coupon_code VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed', 'Refunded'
    payment_method VARCHAR(50), -- 'Stripe', 'Razorpay', 'COD'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);

-- 11. Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 12. Shipping Addresses table
CREATE TABLE shipping_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL, -- optional: tie direct to order
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_shipping_addresses_user ON shipping_addresses(user_id);

-- 13. Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    gateway VARCHAR(50) NOT NULL, -- 'Stripe', 'Razorpay'
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Success', 'Failed', 'Pending'
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_order ON payments(order_id);

-- 14. Coupons table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'Percentage', 'Fixed'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10, 2),
    expiration_date TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coupons_code ON coupons(code);

-- 15. Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
comment TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    image_url VARCHAR(1000) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- 16. Contact Messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Read', 'Replied'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Blog Posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(1000),
    author VARCHAR(100) DEFAULT 'Lumina Health Editorial',
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Published'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- 18. FAQ table
CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Products', 'Shipping', 'Returns', 'Subscription'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Newsletter Subscribers table
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);


-- ==========================================
-- SEED DATA INSERTION
-- ==========================================

-- Seed default Categories
INSERT INTO categories (name, slug, description) VALUES
('Ultra Thin Liners', 'ultra-thin-liners', 'Ultra-breathable cotton dry-weave liners designed for clean daily comfort.'),
('Organic Cotton Pads', 'organic-cotton-pads', '100% GOTS certified organic cotton top-sheet pads offering leak-free protection without skin irritations.'),
('Overnight Protection', 'overnight-protection', 'Extended length XXL protective guards with wide rear coverage for tranquil and stain-free sleep.'),
('Maternity & Postpartum', 'maternity-postpartum', 'Ultra-absorbent postpartum pads engineered for delicate lochia management.');

-- Seed default Products
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, product_type, features, sizes, stock_status, status) VALUES
(1, 'Lumina Air-Feather Daily Panty Liners', 'lumina-air-feather-daily-panty-liners', 'Experience weightless protection. With a profile of only 1mm, these panty liners offer organic cotton freshness for active daily confidence.', 199.00, 249.00, 'Panty Liners', '["1mm ultra-thin comfort layer", "100% Organic cotton sheets", "Anti-bacterial silver ion chip", "Odour neutralizer system"]', '["Regular (150mm)", "Wide (180mm)"]', 'In Stock', 'Active'),
(2, 'Lumina Organic Silk-Touch Regular Pads', 'lumina-organic-silk-touch-regular-pads', 'Hypoallergenic regular-sized pads crafted with GOTS certified organic cotton to keep you completely dry, rash-free, and comfortable throughout the day.', 299.00, 349.00, 'Organic Pads', '["Zero chemical bleach & chlorine", "Breathable backsheet mesh", "Superabsorbent polymer leak guard", "Ergonomic flexible wings"]', '["Regular (240mm)"]', 'In Stock', 'Active'),
(2, 'Lumina Organic Silk-Touch XL Wings', 'lumina-organic-silk-touch-xl-wings', 'Designed for heavier daytime flow, featuring dynamic side-leak barriers and extra length for superior comfort and peace of mind.', 349.00, 399.00, 'Organic Pads', '["Extra-long wing design", "Dual action channel locks", "Organic breathable top layer", "Dermatologically approved"]', '["XL (280mm)"]', 'In Stock', 'Active'),
(3, 'Lumina Sleep-Secure XXL Overnight Pads', 'lumina-sleep-secure-xxl-overnight-pads', 'Sleep soundly without stains. The Lumina Sleep-Secure pads have a wider back cover and active absorption core to secure complete 12-hour leak locks.', 449.00, 499.00, 'Overnight Pads', '["Double adhesive rear wings", "320mm back coverage shield", "High absorption speed gel", "Hypoallergenic guard border"]', '["XXL Overnight (320mm)"]', 'In Stock', 'Active'),
(4, 'Lumina Postpartum Intensive Care Pads', 'lumina-postpartum-intensive-care-pads', 'Specially developed for maternity lochia. These extra wide pads provide medical-grade fluid locks and ultra-soft cushioning for sensitive areas.', 549.00, 599.00, 'Maternity Pads', '["Intensive lochia absorption core", "Anatomically contoured shape", "Extra-soft cushioning border", "OB/GYN recommended product"]', '["Super XL (380mm)"]', 'In Stock', 'Active');

-- Seed product images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600', TRUE),
(1, 'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&q=80&w=600', FALSE),
(2, 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600', TRUE),
(2, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600', FALSE),
(3, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600', TRUE),
(4, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600', TRUE),
(5, 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600', TRUE);

-- Seed Inventory levels
INSERT INTO inventory (product_id, quantity, low_stock_threshold) VALUES
(1, 150, 15),
(2, 200, 20),
(3, 180, 20),
(4, 90, 10),
(5, 50, 10);

-- Seed Admin credentials (hashed password for 'admin123')
INSERT INTO admins (name, email, password_hash, role) VALUES
('Lumina Executive Admin', 'admin@luminacare.com', '$2b$12$R.Sj/hA7Rfe8qGZlq6jGz.B.Lsh1p3xH7u7H9K37b/l8q3Kk9gG4q', 'superadmin');

-- Seed Users (hashed password for 'customer123')
INSERT INTO users (name, email, password_hash, phone) VALUES
('Aishwarya Sharma', 'customer@luminacare.com', '$2b$12$R.Sj/hA7Rfe8qGZlq6jGz.B.Lsh1p3xH7u7H9K37b/l8q3Kk9gG4q', '9876543210');

-- Seed coupons
INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount, max_discount_amount, active) VALUES
('WELCOME10', 'Percentage', 10.00, 200.00, 100.00, TRUE),
('LUMINA50', 'Fixed', 50.00, 500.00, NULL, TRUE);

-- Seed FAQ
INSERT INTO faq (question, answer, category, order_index) VALUES
('Are Lumina Care pads made from 100% organic cotton?', 'Yes, the top-sheet layer of Lumina Care Organic Cotton Pads is certified 100% organic cotton, keeping it completely hypoallergenic and chemical-free.', 'Products', 1),
('How long can I safely wear a Lumina Care pad?', 'While our pads offer 12-hour leak shields, for hygiene and skin safety, obstetricians recommend changing your sanitary pads every 4 to 6 hours depending on flow.', 'Products', 2),
('Do you offer free shipping on subscription boxes?', 'Yes! All recurring subscription boxes and general retail orders above 499.00 receive free shipping nationwide.', 'Shipping', 3),
('Can I cancel my monthly wellness box subscription?', 'Absolutely. You can pause, skip, or cancel your subscription directly from your customer profile page at any time without extra charges.', 'Subscription', 4);

-- Seed blog posts
INSERT INTO blog_posts (title, slug, content, image_url, author, status, published_at) VALUES
('Decoding Rashes: How Synthetic Sanitary Pads Affect Sensitive Skin', 'decoding-rashes-synthetic-vs-organic', 'For years, women have suffered from monthly skin chafing and painful rashes, often chalking it up to a normal side effect of menstruation. Today, dermatological research points to synthetic plastics, fragrances, and chlorine-bleach chemical residues in conventional pads as key triggers. Switching to unbleached organic cotton pads acts as a natural barrier, eliminating synthetic dampness and promoting skin breathability...', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600', 'Dr. Sarah Jenkins (OB/GYN)', 'Published', CURRENT_TIMESTAMP),
('Hydration, Sleep, and Hygiene: The Triad of Perfect Period Comfort', 'triad-of-perfect-period-comfort', 'Our bodies undergo significant hormonal changes during the menstrual cycle. Maintaining balanced hydration, obtaining deep sleep, and practicing proper hygiene are essential to mitigating cramping, fatigue, and skin sensitivity. Learn how Lumina XXL overnight protection pairs with evening wellness routines to guarantee restorative rest.', 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600', 'Lumina Health Team', 'Published', CURRENT_TIMESTAMP);
