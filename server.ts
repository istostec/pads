/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Product, Category, BulkInquiry, Review, DashboardStats, RecentActivity } from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial Seed Data
const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Ultra Thin Pads', slug: 'ultra-thin-pads', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'XL Pads', slug: 'xl-pads', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Overnight Pads', slug: 'overnight-pads', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Panty Liners', slug: 'panty-liners', createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Maternity Pads', slug: 'maternity-pads', createdAt: new Date().toISOString() }
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Clinical Grace Ultra-Secure Thin (Regular)',
    slug: 'clinical-grace-ultra-secure-thin-regular',
    description: 'High-precision regular ultra thin sanitary pads with soft protective barriers and dermatologically tested rash-free material.',
    images: [
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-1',
    categoryName: 'Ultra Thin Pads',
    productType: 'Ultra Thin',
    amazonLink: 'https://www.amazon.com',
    flipkartLink: 'https://www.flipkart.com',
    features: [
      'High-speed absorption gel core',
      'Premium cotton-soft dry-weave',
      'Breathable back-sheet to prevent dampness',
      'Dermatologically tested rash-free'
    ],
    sizes: ['Regular (240mm)'],
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Clinical Grace Comfort-Max XL',
    slug: 'clinical-grace-comfort-max-xl',
    description: 'Premium extra-large pads engineered for supreme daytime protection with wide wings and 12-hour odour control block.',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-2',
    categoryName: 'XL Pads',
    productType: 'XL Pads',
    amazonLink: 'https://www.amazon.com',
    flipkartLink: 'https://www.flipkart.com',
    features: [
      'Anatomical anti-leak channels',
      'Odour-control medical-grade carbon filter layers',
      'Extended side-walls for zero staining',
      'Hypoallergenic pure organic cotton feel'
    ],
    sizes: ['XL (280mm)'],
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Clinical Grace Sleep-Safe XXL Overnight',
    slug: 'clinical-grace-sleep-safe-xxl-overnight',
    description: 'High-capacity double-wing overnight sanitary pads designed with advanced fluid lock technology and 320mm back coverage.',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-3',
    categoryName: 'Overnight Pads',
    productType: 'Overnight Pads',
    amazonLink: 'https://www.amazon.com',
    flipkartLink: 'https://www.flipkart.com',
    features: [
      'Double rear wings for maximum coverage',
      'Rapid fluid lock system',
      'Zero-leak double barriers',
      'Silky soft protective borders'
    ],
    sizes: ['XXL Overnight (320mm)'],
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Clinical Grace Cotton-Soft Panty Liners',
    slug: 'clinical-grace-cotton-soft-panty-liners',
    description: 'Ultra-breathable everyday panty liners for continuous fresh feel and gentle moisture management.',
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-4',
    categoryName: 'Panty Liners',
    productType: 'Panty Liners',
    amazonLink: 'https://www.amazon.com',
    flipkartLink: 'https://www.flipkart.com',
    features: [
      'Ultra-thin 1mm profile for zero feel',
      '100% organic cotton top-sheet',
      'Breathable skin-friendly barrier',
      'Daily discharge secure lock'
    ],
    sizes: ['Regular (150mm)'],
    stockStatus: 'Low Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Clinical Grace Postpartum Maternity Pads',
    slug: 'clinical-grace-postpartum-maternity-pads',
    description: 'Heavy-duty clinical maternity sanitary pads crafted for intensive lochia absorption and postpartum skin recovery.',
    images: [
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600'
    ],
    categoryId: 'cat-5',
    categoryName: 'Maternity Pads',
    productType: 'Maternity Pads',
    amazonLink: 'https://www.amazon.com',
    flipkartLink: 'https://www.flipkart.com',
    features: [
      'Maximum medical-grade holding capacity',
      'Extra-wide back wing guard',
      'Highly recommended by obstetricians'
    ],
    sizes: ['Super XL (380mm)'],
    stockStatus: 'In Stock',
    status: 'Active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultInquiries: BulkInquiry[] = [
  {
    id: 'inq-1',
    customerName: 'Dr. Sarah Jenkins',
    companyName: 'St. Jude Women Health Clinic',
    email: 'sarah.jenkins@stjude.org',
    phone: '9876543210',
    address: '450 Healthcare Boulevard',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    productId: 'prod-3',
    productName: 'Clinical Grace Sleep-Safe XXL Overnight',
    quantity: 500,
    message: 'We want to acquire 500 boxes of overnight pads for our inpatient post-op care.',
    status: 'New Inquiry',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inq-2',
    customerName: 'Rajesh Mehta',
    companyName: 'Apex FMCG Distributors',
    email: 'rajesh@apexdist.com',
    phone: '8765432109',
    address: 'G-12, Industrial Area Phase II',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110020',
    productId: 'prod-2',
    productName: 'Clinical Grace Comfort-Max XL',
    quantity: 2000,
    message: 'Interested in distribution rights in Northern India. Please share price slabs.',
    status: 'In Discussion',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inq-3',
    customerName: 'Anjali Sharma',
    companyName: 'We Care NGO',
    email: 'contact@wecarengo.org',
    phone: '7654321098',
    address: '10 Metro Plaza',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    productId: 'prod-1',
    productName: 'Clinical Grace Ultra-Secure Thin (Regular)',
    quantity: 1000,
    message: 'We are organizing a hygiene camp and would love to buy regular pads at NGO discounted rates.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Meera Nair',
    productId: 'prod-1',
    productName: 'Clinical Grace Ultra-Secure Thin (Regular)',
    rating: 5,
    reviewMessage: 'Genuinely rash-free! I have extremely sensitive skin and struggled with almost every major brand. This soft cotton weave is an absolute game-changer.',
    status: 'Approved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    customerName: 'Priya Patel',
    productId: 'prod-2',
    productName: 'Clinical Grace Comfort-Max XL',
    rating: 5,
    reviewMessage: 'The absorption capacity is fantastic. I work 10-hour hospital shifts, and I felt dry, secure, and confident all day.',
    status: 'Approved',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-3',
    customerName: 'Jessica Alva',
    productId: 'prod-3',
    productName: 'Clinical Grace Sleep-Safe XXL Overnight',
    rating: 5,
    reviewMessage: 'Finally! An overnight pad that covers well. Perfect back guard. Genuinely leak-proof and breathable.',
    status: 'Approved',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rev-4',
    customerName: 'Sneha Rao',
    productId: 'prod-1',
    productName: 'Clinical Grace Ultra-Secure Thin (Regular)',
    rating: 4,
    reviewMessage: 'Very lightweight and feels like nothing. Genuinely pure white and feels highly hygienic. Highly recommend.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultActivities: RecentActivity[] = [
  { id: 'act-1', type: 'inquiry_created', message: 'New Bulk Inquiry received from Dr. Sarah Jenkins (St. Jude Women Health Clinic)', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-2', type: 'review_submitted', message: 'New Review submitted by Sneha Rao for "Clinical Grace Ultra-Secure Thin (Regular)"', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-3', type: 'product_created', message: 'Product "Clinical Grace Postpartum Maternity Pads" created by Admin', time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
];

// Read/Write database file functions
function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    const data = {
      categories: defaultCategories,
      products: defaultProducts,
      inquiries: defaultInquiries,
      reviews: defaultReviews,
      activities: defaultActivities,
      admin: {
        name: 'Clinical Admin',
        email: 'admin@clinicalgrace.com',
        password: 'admin123' // default password for easy demo
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, returning defaults', err);
    return {
      categories: defaultCategories,
      products: defaultProducts,
      inquiries: defaultInquiries,
      reviews: defaultReviews,
      activities: defaultActivities,
      admin: {
        name: 'Clinical Admin',
        email: 'admin@clinicalgrace.com',
        password: 'admin123'
      }
    };
  }
}

function saveData(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to database file', err);
  }
}

// Log an activity helper
function addActivity(type: RecentActivity['type'], message: string) {
  const db = loadData();
  const newActivity: RecentActivity = {
    id: generateId(),
    type,
    message,
    time: new Date().toISOString()
  };
  db.activities = [newActivity, ...(db.activities || [])].slice(0, 50); // Keep last 50 activities
  saveData(db);
}

// --- AUTHENTICATION APIs ---

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = loadData();
  
  if (email === db.admin.email && password === db.admin.password) {
    res.json({
      success: true,
      token: 'clinical-grace-jwt-token-xyz',
      user: {
        id: 'admin-id',
        name: db.admin.name,
        email: db.admin.email,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative email or password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  // Overwrite admin details (for demo/quick settings changes)
  const { name, email, password } = req.body;
  const db = loadData();
  db.admin.name = name || db.admin.name;
  db.admin.email = email || db.admin.email;
  db.admin.password = password || db.admin.password;
  saveData(db);
  
  res.json({
    success: true,
    user: {
      id: 'admin-id',
      name: db.admin.name,
      email: db.admin.email,
      role: 'admin'
    }
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = loadData();
  if (email === db.admin.email) {
    res.json({ success: true, message: `Password reset link sent to registered email ${email}. For demonstration purposes, the current password is: ${db.admin.password}` });
  } else {
    res.status(404).json({ success: false, message: 'Email address not found in system record.' });
  }
});

app.post('/api/auth/reset-password', (req, res) => {
  const { password } = req.body;
  const db = loadData();
  db.admin.password = password;
  saveData(db);
  res.json({ success: true, message: 'Password has been updated successfully.' });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Successfully logged out.' });
});


// --- CATEGORIES APIs ---

app.get('/api/categories', (req, res) => {
  const db = loadData();
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  
  const db = loadData();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat: Category = {
    id: 'cat-' + generateId(),
    name,
    slug,
    createdAt: new Date().toISOString()
  };
  
  db.categories.push(newCat);
  saveData(db);
  
  addActivity('product_updated', `Category "${name}" was created`);
  res.json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const db = loadData();
  
  const catIndex = db.categories.findIndex((c: any) => c.id === id);
  if (catIndex === -1) return res.status(404).json({ error: 'Category not found' });
  
  const originalName = db.categories[catIndex].name;
  db.categories[catIndex].name = name || db.categories[catIndex].name;
  db.categories[catIndex].slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : db.categories[catIndex].slug;
  
  // Also update categoryName in existing products
  db.products = db.products.map((p: Product) => {
    if (p.categoryId === id) {
      return { ...p, categoryName: name };
    }
    return p;
  });

  saveData(db);
  
  addActivity('product_updated', `Category updated from "${originalName}" to "${name}"`);
  res.json(db.categories[catIndex]);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  const cat = db.categories.find((c: any) => c.id === id);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  
  db.categories = db.categories.filter((c: any) => c.id !== id);
  saveData(db);
  
  addActivity('product_updated', `Category "${cat.name}" was deleted`);
  res.json({ success: true, message: 'Category deleted' });
});


// --- PRODUCTS APIs ---

app.get('/api/products', (req, res) => {
  const db = loadData();
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const prod = db.products.find((p: any) => p.id === id || p.slug === id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
});

app.post('/api/products', (req, res) => {
  const { name, description, images, categoryId, productType, amazonLink, flipkartLink, features, sizes, stockStatus, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Product name is required' });
  
  const db = loadData();
  const category = db.categories.find((c: any) => c.id === categoryId);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newProduct: Product = {
    id: 'prod-' + generateId(),
    name,
    slug,
    description: description || '',
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600'],
    categoryId: categoryId || 'cat-1',
    categoryName: category ? category.name : 'General',
    productType: productType || 'Ultra Thin',
    amazonLink: amazonLink || '',
    flipkartLink: flipkartLink || '',
    features: features || [],
    sizes: sizes || ['Regular (240mm)'],
    stockStatus: stockStatus || 'In Stock',
    status: status || 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.products.push(newProduct);
  saveData(db);
  
  addActivity('product_created', `New Product "${name}" created successfully`);
  res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  const prodIndex = db.products.findIndex((p: any) => p.id === id);
  if (prodIndex === -1) return res.status(404).json({ error: 'Product not found' });
  
  const category = db.categories.find((c: any) => c.id === req.body.categoryId);
  
  const updatedProduct = {
    ...db.products[prodIndex],
    ...req.body,
    categoryName: category ? category.name : (db.products[prodIndex].categoryName || 'General'),
    updatedAt: new Date().toISOString()
  };
  
  db.products[prodIndex] = updatedProduct;
  saveData(db);
  
  addActivity('product_updated', `Product "${updatedProduct.name}" details updated`);
  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  const prod = db.products.find((p: any) => p.id === id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  
  db.products = db.products.filter((p: any) => p.id !== id);
  saveData(db);
  
  addActivity('product_updated', `Product "${prod.name}" deleted`);
  res.json({ success: true });
});


// --- BULK INQUIRIES APIs ---

app.post('/api/inquiries', (req, res) => {
  const { customerName, companyName, email, phone, address, city, state, pincode, productId, quantity, message } = req.body;
  if (!customerName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required.' });
  }
  
  const db = loadData();
  const product = db.products.find((p: any) => p.id === productId);
  
  const newInq: BulkInquiry = {
    id: 'inq-' + generateId(),
    customerName,
    companyName: companyName || '',
    email,
    phone,
    address: address || '',
    city: city || '',
    state: state || '',
    pincode: pincode || '',
    productId: productId || '',
    productName: product ? product.name : 'General Inquiries',
    quantity: Number(quantity) || 100,
    message: message || '',
    status: 'New Inquiry',
    createdAt: new Date().toISOString()
  };
  
  db.inquiries = [newInq, ...db.inquiries];
  saveData(db);
  
  addActivity('inquiry_created', `New Bulk Inquiry submitted by ${customerName} (${companyName || 'Individual'})`);
  res.json({ success: true, inquiry: newInq });
});

app.get('/api/admin/inquiries', (req, res) => {
  const db = loadData();
  res.json(db.inquiries);
});

app.get('/api/admin/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const inq = db.inquiries.find((i: any) => i.id === id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found' });
  res.json(inq);
});

app.put('/api/admin/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadData();
  
  const inqIndex = db.inquiries.findIndex((i: any) => i.id === id);
  if (inqIndex === -1) return res.status(404).json({ error: 'Inquiry not found' });
  
  db.inquiries[inqIndex].status = status;
  saveData(db);
  
  addActivity('product_updated', `Bulk inquiry status for "${db.inquiries[inqIndex].customerName}" updated to ${status}`);
  res.json(db.inquiries[inqIndex]);
});

app.delete('/api/admin/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  db.inquiries = db.inquiries.filter((i: any) => i.id !== id);
  saveData(db);
  res.json({ success: true });
});


// --- REVIEWS APIs ---

app.post('/api/reviews', (req, res) => {
  const { customerName, productId, rating, reviewMessage } = req.body;
  if (!customerName || !productId || !rating || !reviewMessage) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }
  
  const db = loadData();
  const product = db.products.find((p: any) => p.id === productId);
  
  const newReview: Review = {
    id: 'rev-' + generateId(),
    customerName,
    productId,
    productName: product ? product.name : 'Unknown Product',
    rating: Number(rating),
    reviewMessage,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  db.reviews = [newReview, ...db.reviews];
  saveData(db);
  
  addActivity('review_submitted', `New review submitted by ${customerName} for "${product ? product.name : 'Unknown'}"`);
  res.json({ success: true, review: newReview });
});

app.get('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const approvedReviews = db.reviews.filter((r: any) => r.productId === id && r.status === 'Approved');
  res.json(approvedReviews);
});

app.get('/api/admin/reviews', (req, res) => {
  const db = loadData();
  res.json(db.reviews);
});

app.put('/api/admin/reviews/:id/approve', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  const revIndex = db.reviews.findIndex((r: any) => r.id === id);
  if (revIndex === -1) return res.status(404).json({ error: 'Review not found' });
  
  db.reviews[revIndex].status = 'Approved';
  saveData(db);
  
  addActivity('review_approved', `Review by "${db.reviews[revIndex].customerName}" was approved`);
  res.json(db.reviews[revIndex]);
});

app.put('/api/admin/reviews/:id/reject', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  const revIndex = db.reviews.findIndex((r: any) => r.id === id);
  if (revIndex === -1) return res.status(404).json({ error: 'Review not found' });
  
  db.reviews[revIndex].status = 'Rejected';
  saveData(db);
  
  addActivity('review_rejected', `Review by "${db.reviews[revIndex].customerName}" was rejected`);
  res.json(db.reviews[revIndex]);
});

app.delete('/api/admin/reviews/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  
  db.reviews = db.reviews.filter((r: any) => r.id !== id);
  saveData(db);
  res.json({ success: true });
});


// --- DASHBOARD STATS APIs ---

app.get('/api/admin/dashboard/stats', (req, res) => {
  const db = loadData();
  
  const totalProducts = db.products.length;
  const totalInquiries = db.inquiries.length;
  const totalReviews = db.reviews.length;
  const pendingReviews = db.reviews.filter((r: any) => r.status === 'Pending').length;
  
  // Calculate category distribution
  const categoryMap: Record<string, number> = {};
  db.products.forEach((p: Product) => {
    categoryMap[p.categoryName || 'Other'] = (categoryMap[p.categoryName || 'Other'] || 0) + 1;
  });
  const categoryDistribution = Object.keys(categoryMap).map(name => ({
    name,
    value: categoryMap[name]
  }));
  
  // Create mock monthly inquiry statistics for the past 6 months
  const monthlyInquiryStats = [
    { month: 'Jan', inquiries: 15 },
    { month: 'Feb', inquiries: 22 },
    { month: 'Mar', inquiries: 18 },
    { month: 'Apr', inquiries: 30 },
    { month: 'May', inquiries: 25 },
    { month: 'Jun', inquiries: db.inquiries.length + 5 } // Dynamically tie to actual data size
  ];
  
  res.json({
    totalProducts,
    totalInquiries,
    totalReviews,
    pendingReviews,
    recentInquiries: db.inquiries.slice(0, 5),
    monthlyInquiryStats,
    categoryDistribution
  });
});

app.get('/api/admin/recent-activities', (req, res) => {
  const db = loadData();
  res.json(db.activities || []);
});


// --- INTEGRATE VITE ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
