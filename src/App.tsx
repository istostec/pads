/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import ProductDetailsView from './components/ProductDetailsView';
import BulkInquiryView from './components/BulkInquiryView';
import AboutView from './components/AboutView';
import ReviewsView from './components/ReviewsView';
import FaqView from './components/FaqView';
import ContactView from './components/ContactView';
import AdminPortal from './components/AdminPortal';
import { NotificationProvider, useNotifications } from './components/NotificationProvider';
import { Product, Category, BulkInquiry, Review, RecentActivity } from './types';

function MainAppContent() {
  const { showToast } = useNotifications();

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  
  // App-wide loading / error states
  const [isLoading, setIsLoading] = useState(true);

  // Admin Session States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  // 1. Initial Data Load on Mount
  useEffect(() => {
    // Check local storage for pre-existing verified admin session token
    const savedToken = localStorage.getItem('clinical-grace-admin-token');
    if (savedToken) {
      setIsAdminLoggedIn(true);
      setAdminToken(savedToken);
    }

    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch public directories
      const [productsRes, categoriesRes, reviewsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/admin/reviews') // admin handles approved + pending
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());

      // If logged in, fetch administrative state lists
      const token = localStorage.getItem('clinical-grace-admin-token');
      if (token) {
        await fetchAdminSpecificLists();
      }
    } catch (err) {
      console.error('Error fetching data from full-stack api endpoints', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminSpecificLists = async () => {
    try {
      const [inquiriesRes, activitiesRes] = await Promise.all([
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/recent-activities')
      ]);
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      if (activitiesRes.ok) setActivities(await activitiesRes.json());
    } catch (err) {
      console.error('Error loading administrative lists', err);
    }
  };

  // Sync data whenever admin login state becomes true
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminSpecificLists();
    }
  }, [isAdminLoggedIn]);

  // Handle navigation
  const handleNavigate = (viewId: string, targetId: string = '') => {
    setCurrentView(viewId);
    if (viewId === 'product-details' && targetId) {
      setSelectedProductId(targetId);
    } else if (targetId) {
      setSelectedProductId(targetId);
    } else {
      setSelectedProductId('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PUBLIC SUBMISSIONS ---

  // Submit Bulk Inquiry (Public)
  const handleSubmitInquiry = async (inqData: any) => {
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inqData)
      });
      if (response.ok) {
        // Refresh local listings if admin is logged in to match
        if (isAdminLoggedIn) {
          fetchAdminSpecificLists();
        }
        showToast('Bulk inquiry successfully saved in operations directory.', 'success');
      } else {
        showToast('Failed to submit bulk order requisition.', 'error');
      }
    } catch (err) {
      showToast('Network error during bulk transmission.', 'error');
    }
  };

  // Submit Review (Public)
  const handleSubmitReview = async (revData: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revData)
      });
      if (response.ok) {
        const resJson = await response.json();
        // Insert new review as Pending in reviews state
        setReviews(prev => [resJson.review, ...prev]);
        showToast('Review submitted under audit escrow. Awaiting validation.', 'info');
      } else {
        showToast('Failed to log review details.', 'error');
      }
    } catch (err) {
      showToast('Error connecting to review endpoint.', 'error');
    }
  };

  // Contact Message submission
  const handleContactSubmission = (contactData: any) => {
    // Send email/phone coordinates activity to logger
    showToast(`Transmission received. Thank you ${contactData.name}!`, 'success');
  };

  // --- ADMIN OPERATIONS COMMANDS ---

  const handleAddProduct = async (prodPayload: Partial<Product>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodPayload)
    });
    if (response.ok) {
      const newProd = await response.json();
      setProducts(prev => [...prev, newProd]);
      fetchAdminSpecificLists(); // refresh logs
      return newProd;
    }
    throw new Error('API failure');
  };

  const handleEditProduct = async (id: string, prodPayload: Partial<Product>) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodPayload)
    });
    if (response.ok) {
      const updatedProd = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? updatedProd : p));
      fetchAdminSpecificLists(); // refresh logs
      return updatedProd;
    }
    throw new Error('API failure');
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
      fetchAdminSpecificLists();
      return true;
    }
    throw new Error('API failure');
  };

  const handleAddCategory = async (catName: string) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName })
    });
    if (response.ok) {
      const newCat = await response.json();
      setCategories(prev => [...prev, newCat]);
      fetchAdminSpecificLists();
      return newCat;
    }
    throw new Error('API failure');
  };

  const handleEditCategory = async (id: string, catName: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: catName })
    });
    if (response.ok) {
      const updatedCat = await response.json();
      setCategories(prev => prev.map(c => c.id === id ? updatedCat : c));
      // Refresh products as their categoryName might have changed
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) setProducts(await prodRes.json());
      fetchAdminSpecificLists();
      return updatedCat;
    }
    throw new Error('API failure');
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setCategories(prev => prev.filter(c => c.id !== id));
      fetchAdminSpecificLists();
      return true;
    }
    throw new Error('API failure');
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      const updatedInq = await response.json();
      setInquiries(prev => prev.map(i => i.id === id ? updatedInq : i));
      fetchAdminSpecificLists();
      return updatedInq;
    }
    throw new Error('API failure');
  };

  const handleDeleteInquiry = async (id: string) => {
    const response = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setInquiries(prev => prev.filter(i => i.id !== id));
      fetchAdminSpecificLists();
      return true;
    }
    throw new Error('API failure');
  };

  const handleApproveReview = async (id: string) => {
    const response = await fetch(`/api/admin/reviews/${id}/approve`, { method: 'PUT' });
    if (response.ok) {
      const updatedRev = await response.json();
      setReviews(prev => prev.map(r => r.id === id ? updatedRev : r));
      fetchAdminSpecificLists();
      return updatedRev;
    }
    throw new Error('API failure');
  };

  const handleRejectReview = async (id: string) => {
    const response = await fetch(`/api/admin/reviews/${id}/reject`, { method: 'PUT' });
    if (response.ok) {
      const updatedRev = await response.json();
      setReviews(prev => prev.map(r => r.id === id ? updatedRev : r));
      fetchAdminSpecificLists();
      return updatedRev;
    }
    throw new Error('API failure');
  };

  const handleDeleteReview = async (id: string) => {
    const response = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setReviews(prev => prev.filter(r => r.id !== id));
      fetchAdminSpecificLists();
      return true;
    }
    throw new Error('API failure');
  };

  const handleAdminLoginSuccess = (token: string, user: any) => {
    localStorage.setItem('clinical-grace-admin-token', token);
    setIsAdminLoggedIn(true);
    setAdminToken(token);
    setCurrentView('admin'); // switch directly to admin panel on login success
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('clinical-grace-admin-token');
    setIsAdminLoggedIn(false);
    setAdminToken('');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-brand-clinical flex flex-col justify-between">
      
      {/* Navbar Integration */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-4">
        {isLoading ? (
          /* Skeleton Loading State representing our healthcare brand */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-brand-lavender p-6 rounded-3xl space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-lg w-5/6" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Route Screens Switch Board */
          <div>
            {currentView === 'home' && (
              <HomeView
                products={products}
                reviews={reviews}
                onNavigate={handleNavigate}
                onSubmitContact={handleContactSubmission}
              />
            )}
            
            {currentView === 'products' && (
              <ProductsView
                products={products}
                categories={categories}
                onSelectProduct={(id) => handleNavigate('product-details', id)}
                onNavigateToBulk={(id) => handleNavigate('bulk-inquiry', id)}
              />
            )}

            {currentView === 'product-details' && (
              <ProductDetailsView
                productId={selectedProductId}
                products={products}
                reviews={reviews}
                onBack={() => handleNavigate('products')}
                onNavigateToBulk={(id) => handleNavigate('bulk-inquiry', id)}
                onSubmitReview={handleSubmitReview}
              />
            )}

            {currentView === 'bulk-inquiry' && (
              <BulkInquiryView
                products={products}
                selectedProductId={selectedProductId}
                onSubmitInquiry={handleSubmitInquiry}
              />
            )}

            {currentView === 'about' && (
              <AboutView />
            )}

            {currentView === 'reviews' && (
              <ReviewsView
                reviews={reviews}
                products={products}
                onSubmitReview={handleSubmitReview}
              />
            )}

            {currentView === 'faq' && (
              <FaqView />
            )}

            {currentView === 'contact' && (
              <ContactView
                onSubmitContact={handleContactSubmission}
              />
            )}

            {currentView === 'admin' && (
              <AdminPortal
                products={products}
                categories={categories}
                inquiries={inquiries}
                reviews={reviews}
                activities={activities}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onUpdateInquiryStatus={handleUpdateInquiryStatus}
                onDeleteInquiry={handleDeleteInquiry}
                onApproveReview={handleApproveReview}
                onRejectReview={handleRejectReview}
                onDeleteReview={handleDeleteReview}
                onLoginSuccess={handleAdminLoginSuccess}
                onLogout={handleAdminLogout}
                isAdminLoggedIn={isAdminLoggedIn}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Integration */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <MainAppContent />
    </NotificationProvider>
  );
}
