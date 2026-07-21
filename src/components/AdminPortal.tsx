/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark, LayoutDashboard, Box, FileSpreadsheet, MessageSquare, Tags, User, Lock, LogOut,
  Plus, Edit, Trash2, CheckCircle, XCircle, Search, Filter, ArrowDownToLine, Download, ShieldCheck,
  Eye, Save, KeyRound, RefreshCw, Layers
} from 'lucide-react';
import { Product, Category, BulkInquiry, Review, DashboardStats, RecentActivity } from '../types';
import { useNotifications } from './NotificationProvider';

interface AdminPortalProps {
  products: Product[];
  categories: Category[];
  inquiries: BulkInquiry[];
  reviews: Review[];
  activities: RecentActivity[];
  
  // Handlers to sync state back up to parent and API
  onAddProduct: (prodData: Partial<Product>) => Promise<any>;
  onEditProduct: (id: string, prodData: Partial<Product>) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<any>;
  
  onAddCategory: (catName: string) => Promise<any>;
  onEditCategory: (id: string, catName: string) => Promise<any>;
  onDeleteCategory: (id: string) => Promise<any>;
  
  onUpdateInquiryStatus: (id: string, status: string) => Promise<any>;
  onDeleteInquiry: (id: string) => Promise<any>;
  
  onApproveReview: (id: string) => Promise<any>;
  onRejectReview: (id: string) => Promise<any>;
  onDeleteReview: (id: string) => Promise<any>;

  onLoginSuccess: (token: string, user: any) => void;
  onLogout: () => void;
  isAdminLoggedIn: boolean;
}

type AdminTab = 'overview' | 'products' | 'inquiries' | 'reviews' | 'categories' | 'profile';

export default function AdminPortal({
  products,
  categories,
  inquiries,
  reviews,
  activities,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onApproveReview,
  onRejectReview,
  onDeleteReview,
  onLoginSuccess,
  onLogout,
  isAdminLoggedIn
}: AdminPortalProps) {
  const { showToast, confirm } = useNotifications();

  // Navigation states
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Login credentials states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Search & Filter state variables
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

  // Modals / Editors states
  const [productModalMode, setProductModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [tempFeatures, setTempFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const [categoryModalMode, setCategoryModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [catNameInput, setCatNameInput] = useState('');

  // Profile credentials change state
  const [adminName, setAdminName] = useState('Clinical Admin');
  const [adminEmail, setAdminEmail] = useState('admin@clinicalgrace.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Selected Inquiry for details viewer modal
  const [viewingInquiry, setViewingInquiry] = useState<BulkInquiry | null>(null);

  // Simulated Analytics Calculations
  const analyticsStats = React.useMemo(() => {
    const totalP = products.length;
    const totalI = inquiries.length;
    const totalR = reviews.length;
    const pendingR = reviews.filter(r => r.status === 'Pending').length;
    
    // Categoric distributions
    const distribution: Record<string, number> = {};
    products.forEach(p => {
      distribution[p.categoryName || 'Other'] = (distribution[p.categoryName || 'Other'] || 0) + 1;
    });

    return {
      totalProducts: totalP,
      totalInquiries: totalI,
      totalReviews: totalR,
      pendingReviews: pendingR,
      distribution
    };
  }, [products, inquiries, reviews]);

  // --- HANDLERS ---

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmittingLogin(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        showToast('Administrative credentials validated. Entering dashboard.', 'success');
        onLoginSuccess(data.token, data.user);
        setAdminName(data.user.name);
        setAdminEmail(data.user.email);
      } else {
        showToast(data.message || 'Invalid administrative credentials.', 'error');
      }
    } catch (err) {
      showToast('Error connecting to authentication endpoint.', 'error');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Log Out admin
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      onLogout();
      showToast('Log out successful.', 'info');
    } catch (err) {
      onLogout();
    }
  };

  // Edit / Add product handlers
  const openAddProductModal = () => {
    setEditingProduct({
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      productType: 'Ultra Thin',
      amazonLink: '',
      flipkartLink: '',
      sizes: ['Regular (240mm)'],
      stockStatus: 'In Stock',
      status: 'Active'
    });
    setTempImages([
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600'
    ]);
    setTempFeatures([
      'High-speed absorption gel core',
      'Organic cotton comfort soft top sheet'
    ]);
    setProductModalMode('add');
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setTempImages([...prod.images]);
    setTempFeatures([...prod.features]);
    setProductModalMode('edit');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct.categoryId) {
      showToast('Product name and category are required.', 'warning');
      return;
    }

    const payload = {
      ...editingProduct,
      images: tempImages,
      features: tempFeatures
    };

    try {
      if (productModalMode === 'add') {
        await onAddProduct(payload);
        showToast(`Product "${payload.name}" created successfully.`, 'success');
      } else if (productModalMode === 'edit' && editingProduct.id) {
        await onEditProduct(editingProduct.id, payload);
        showToast(`Product "${payload.name}" details updated.`, 'success');
      }
      setProductModalMode(null);
      setEditingProduct(null);
    } catch (err) {
      showToast('Failed to save product details.', 'error');
    }
  };

  const handleDeleteProductClick = (prodId: string, name: string) => {
    confirm({
      title: 'Delete Product Formulation',
      message: `Are you absolutely certain you want to delete "${name}" from the active database? This will permanently remove it.`,
      confirmText: 'Delete Formulation',
      onConfirm: async () => {
        try {
          await onDeleteProduct(prodId);
          showToast(`Product "${name}" deleted.`, 'success');
        } catch (err) {
          showToast('Failed to delete formulation.', 'error');
        }
      }
    });
  };

  // Category handlers
  const openAddCategoryModal = () => {
    setCatNameInput('');
    setCategoryModalMode('add');
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatNameInput(cat.name);
    setCategoryModalMode('edit');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;

    try {
      if (categoryModalMode === 'add') {
        await onAddCategory(catNameInput.trim());
        showToast(`Category "${catNameInput}" created.`, 'success');
      } else if (categoryModalMode === 'edit' && editingCategory?.id) {
        await onEditCategory(editingCategory.id, catNameInput.trim());
        showToast(`Category updated to "${catNameInput}".`, 'success');
      }
      setCategoryModalMode(null);
      setEditingCategory(null);
      setCatNameInput('');
    } catch (err) {
      showToast('Failed to save category.', 'error');
    }
  };

  const handleDeleteCategoryClick = (catId: string, name: string) => {
    confirm({
      title: 'Delete Category',
      message: `Delete category "${name}"? Existing products under this category will display category: General.`,
      confirmText: 'Delete Category',
      onConfirm: async () => {
        try {
          await onDeleteCategory(catId);
          showToast(`Category "${name}" deleted successfully.`, 'success');
        } catch (err) {
          showToast('Error deleting category.', 'error');
        }
      }
    });
  };

  // Inquiry update status
  const handleInquiryStatusChange = async (inqId: string, status: string) => {
    try {
      await onUpdateInquiryStatus(inqId, status);
      showToast(`Inquiry status updated to: ${status}`, 'success');
      if (viewingInquiry && viewingInquiry.id === inqId) {
        setViewingInquiry(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteInquiryClick = (inqId: string, name: string) => {
    confirm({
      title: 'Delete Bulk Inquiry',
      message: `Remove the logistics bulk inquiry submitted by "${name}" from the record list?`,
      confirmText: 'Delete Inquiry',
      onConfirm: async () => {
        try {
          await onDeleteInquiry(inqId);
          showToast('Inquiry deleted successfully.', 'success');
          if (viewingInquiry?.id === inqId) setViewingInquiry(null);
        } catch (err) {
          showToast('Error deleting inquiry.', 'error');
        }
      }
    });
  };

  // Moderation Review handlers
  const handleApproveReview = async (revId: string, author: string) => {
    try {
      await onApproveReview(revId);
      showToast(`Approved review by "${author}". It is now published on the public site!`, 'success');
    } catch (err) {
      showToast('Failed to approve review.', 'error');
    }
  };

  const handleRejectReview = async (revId: string, author: string) => {
    try {
      await onRejectReview(revId);
      showToast(`Rejected review by "${author}".`, 'info');
    } catch (err) {
      showToast('Failed to reject review.', 'error');
    }
  };

  const handleDeleteReviewClick = (revId: string, author: string) => {
    confirm({
      title: 'Delete Customer Review',
      message: `Permanently delete comfort review submitted by "${author}"?`,
      confirmText: 'Delete Review',
      onConfirm: async () => {
        try {
          await onDeleteReview(revId);
          showToast('Review deleted.', 'success');
        } catch (err) {
          showToast('Failed to delete review.', 'error');
        }
      }
    });
  };

  // Exporter to CSV / Excel
  const handleExportInquiriesToExcel = () => {
    if (inquiries.length === 0) {
      showToast('No inquiry data records found to export.', 'warning');
      return;
    }

    // Build standard CSV string
    const headers = ['ID', 'Customer Name', 'Company Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Product Name', 'Quantity', 'Date', 'Status'];
    const rows = inquiries.map(i => [
      i.id,
      i.customerName,
      i.companyName,
      i.email,
      i.phone,
      `"${i.address.replace(/"/g, '""')}"`,
      i.city,
      i.state,
      i.pincode,
      i.productName,
      i.quantity,
      i.createdAt,
      i.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clinical_grace_bulk_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Requisition registry exported to Excel-ready CSV format.', 'success');
  };

  // Change Credentials settings
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName, email: adminEmail })
      });
      if (response.ok) {
        showToast('Administrative profile properties updated successfully.', 'success');
      } else {
        showToast('Failed to update profile values.', 'error');
      }
    } catch (err) {
      showToast('Error updating credentials on server.', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (response.ok) {
        showToast('Administrative password updated successfully.', 'success');
        setOldPassword('');
        setNewPassword('');
      } else {
        showToast('Failed to reset security password.', 'error');
      }
    } catch (err) {
      showToast('Server connection error during reset.', 'error');
    }
  };

  // --- FILTERS & SEARCH EXECUTION ---

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.productType.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === 'all' || p.categoryId === productCatFilter;
    return matchesSearch && matchesCat;
  });

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = i.customerName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                          i.companyName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                          i.productName.toLowerCase().includes(inquirySearch.toLowerCase());
    const matchesStatus = inquiryStatusFilter === 'all' || i.status === inquiryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
                          r.reviewMessage.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesStatus = reviewStatusFilter === 'all' || r.status === reviewStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- RENDERING VIEWS ---

  if (!isAdminLoggedIn) {
    /* ADMIN LOGIN PAGE */
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-brand-lavender shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-dark" />
          
          <div className="text-center space-y-2 mb-8 mt-2">
            <div className="w-12 h-12 rounded-full bg-brand-pink/50 mx-auto flex items-center justify-center border border-brand-purple/30 text-brand-dark">
              <Landmark className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-gray-900 tracking-tight">Clinical Grace Command Hub</h2>
            <p className="text-xs text-gray-400">Enter secure administrative credentials below</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Administrative Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clinicalgrace.com"
                className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-brand-clinical"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Administrative Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-brand-clinical"
                />
              </div>
            </div>

            {/* Hint for demonstration purposes */}
            <div className="bg-brand-blue/30 p-3 rounded-lg text-[10px] text-gray-500 border border-brand-purple/20">
              💡 Demonstration Admin credentials:<br />
              <strong>Email:</strong> admin@clinicalgrace.com <br />
              <strong>Password:</strong> admin123
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-brand-darker transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSubmittingLogin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Decrypting Vault Credentials...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Authenticate &amp; Initialize
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* FULL ADMIN DASHBOARD CONTROL PANEL */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Brand Banner bar */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow">
            <ShieldCheck className="w-6 h-6 text-brand-pink" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Clinical Grace Administration Panel
              <span className="text-[9px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded uppercase font-bold">
                Live Server Synced
              </span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Enterprise logistics command and reviews moderation console</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono">Session: admin@clinicalgrace.com</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Secure Log Out
          </button>
        </div>
      </div>

      {/* Main Admin Navigation and Workspaces Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'overview'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Dashboard Overview
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'products'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <Box className="w-4.5 h-4.5" />
            Product Management
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'inquiries'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <FileSpreadsheet className="w-4.5 h-4.5" />
            Bulk Inquiries
            {inquiries.length > 0 && (
              <span className="ml-auto bg-brand-pink text-brand-dark text-[10px] px-2 py-0.5 rounded-full font-bold">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'reviews'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            Review Moderation
            {reviews.filter(r => r.status === 'Pending').length > 0 && (
              <span className="ml-auto bg-amber-400 text-brand-darker text-[10px] px-2 py-0.5 rounded-full font-bold">
                {reviews.filter(r => r.status === 'Pending').length} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'categories'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
            Category Setup
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 whitespace-nowrap lg:whitespace-normal ${
              activeTab === 'profile'
                ? 'bg-brand-dark text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-brand-lavender/30 border border-brand-lavender/60'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            Admin Profile Settings
          </button>
        </div>

        {/* Right Tab Content Screen */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-brand-lavender/70 shadow-lg p-6 min-h-[50vh]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Analytics grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-clinical p-5 rounded-2xl border border-brand-lavender/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Total Products</span>
                  <div className="text-2xl font-heading font-extrabold text-gray-900">{analyticsStats.totalProducts}</div>
                  <span className="text-[9px] text-gray-400">Published formulations</span>
                </div>
                <div className="bg-brand-clinical p-5 rounded-2xl border border-brand-lavender/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Bulk Inquiries</span>
                  <div className="text-2xl font-heading font-extrabold text-gray-900">{analyticsStats.totalInquiries}</div>
                  <span className="text-[9px] text-emerald-600 font-semibold">Active enterprise leads</span>
                </div>
                <div className="bg-brand-clinical p-5 rounded-2xl border border-brand-lavender/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Approved Reviews</span>
                  <div className="text-2xl font-heading font-extrabold text-gray-900">
                    {reviews.filter(r => r.status === 'Approved').length}
                  </div>
                  <span className="text-[9px] text-gray-400">Live testimonials</span>
                </div>
                <div className="bg-brand-clinical p-5 rounded-2xl border border-brand-lavender/60 relative overflow-hidden">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Pending Reviews</span>
                  <div className="text-2xl font-heading font-extrabold text-amber-600">{analyticsStats.pendingReviews}</div>
                  <span className="text-[9px] text-amber-500 font-semibold">Awaiting medical approval</span>
                  {analyticsStats.pendingReviews > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Analytics Charts & Statistics Visualization Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Monthly Inquiry Statistics (Using Pure SVG/HTML visualizer) */}
                <div className="bg-brand-clinical p-6 rounded-2xl border border-brand-lavender/60 space-y-4">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-700">
                    Monthly Inquiry Statistics
                  </h3>
                  
                  <div className="aspect-[16/9] flex items-end justify-between gap-2 pt-6 pb-2 px-4 border-b border-brand-lavender">
                    {/* Simulated bars */}
                    {[
                      { m: 'Jan', val: 15, h: '30%' },
                      { m: 'Feb', val: 22, h: '45%' },
                      { m: 'Mar', val: 18, h: '38%' },
                      { m: 'Apr', val: 30, h: '62%' },
                      { m: 'May', val: 25, h: '51%' },
                      { m: 'Jun', val: inquiries.length + 5, h: `${Math.min(100, (inquiries.length + 5) * 2.5)}%` }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="text-[10px] text-brand-dark font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.val}
                        </div>
                        <div
                          style={{ height: bar.h }}
                          className="w-full bg-brand-dark hover:bg-brand-pink transition-all rounded-t-md shadow-inner"
                        />
                        <div className="text-[10px] font-mono text-gray-500 mt-1">{bar.m}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories share visualizer */}
                <div className="bg-brand-clinical p-6 rounded-2xl border border-brand-lavender/60 space-y-4">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-700">
                    Inventory Distribution Share
                  </h3>
                  
                  <div className="space-y-3 pt-2">
                    {Object.entries(analyticsStats.distribution).map(([catName, count], idx) => {
                      const percentage = Math.round(((count as number) / Math.max(1, products.length)) * 100);
                      return (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-medium text-gray-700">
                            <span>{catName}</span>
                            <span>{count as number} products ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-brand-lavender/30">
                            <div style={{ width: `${percentage}%` }} className="h-full bg-brand-purple" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Master Activities Log */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-400">
                  Recent Enterprise Activities Log
                </h3>
                <div className="bg-brand-clinical rounded-2xl border border-brand-lavender/60 p-4 space-y-3 max-h-[300px] overflow-y-auto font-sans">
                  {activities.length > 0 ? (
                    activities.map((act) => (
                      <div key={act.id} className="text-xs flex gap-3 pb-2 border-b border-brand-lavender last:border-b-0 last:pb-0">
                        <span className="text-brand-dark font-mono shrink-0">
                          [{new Date(act.time).toLocaleTimeString()}]
                        </span>
                        <p className="text-gray-600 flex-1">{act.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-400">No activities recorded yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 w-full sm:max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search active inventory..."
                      className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark bg-brand-clinical"
                    />
                  </div>
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="border border-brand-lavender rounded-lg px-3 py-2 text-xs text-gray-600 bg-brand-clinical cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Add Formulation
                </button>
              </div>

              {/* Table listing */}
              <div className="overflow-x-auto border border-brand-lavender rounded-2xl shadow-inner">
                <table className="min-w-full divide-y divide-brand-lavender text-left text-xs text-gray-600">
                  <thead className="bg-brand-clinical font-mono uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Product Image</th>
                      <th className="px-6 py-3">Product Name</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Product Type</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lavender bg-white">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-brand-clinical/50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-lg border border-brand-lavender" />
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                        <td className="px-6 py-4">{p.categoryName || 'General'}</td>
                        <td className="px-6 py-4">{p.productType}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                            p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProductClick(p.id, p.name)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                          No product formulations match your search parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BULK INQUIRY MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 w-full sm:max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search hospital or clinic name..."
                      className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark bg-brand-clinical"
                    />
                  </div>
                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="border border-brand-lavender rounded-lg px-3 py-2 text-xs text-gray-600 bg-brand-clinical cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New Inquiry">New Inquiry</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <button
                  onClick={handleExportInquiriesToExcel}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel CSV
                </button>
              </div>

              {/* Inquiry Table */}
              <div className="overflow-x-auto border border-brand-lavender rounded-2xl">
                <table className="min-w-full divide-y divide-brand-lavender text-left text-xs text-gray-600">
                  <thead className="bg-brand-clinical font-mono uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Customer &amp; Institution</th>
                      <th className="px-6 py-3">Contact</th>
                      <th className="px-6 py-3">Product Name</th>
                      <th className="px-6 py-3">Quantity</th>
                      <th className="px-6 py-3">Inquiry Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lavender bg-white">
                    {filteredInquiries.map((i) => (
                      <tr key={i.id} className="hover:bg-brand-clinical/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{i.customerName}</div>
                          <div className="text-[10px] text-gray-500">{i.companyName || 'Private Acquisition'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{i.email}</div>
                          <div className="font-mono text-[10px]">{i.phone}</div>
                        </td>
                        <td className="px-6 py-4 max-w-[150px] truncate">{i.productName}</td>
                        <td className="px-6 py-4 font-mono font-bold text-brand-dark">{i.quantity}</td>
                        <td className="px-6 py-4 font-mono text-[10px]">
                          {new Date(i.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={i.status}
                            onChange={(e) => handleInquiryStatusChange(i.id, e.target.value)}
                            className="border border-brand-lavender rounded px-2 py-1 text-xs text-gray-700 bg-brand-clinical cursor-pointer font-medium"
                          >
                            <option value="New Inquiry">New Inquiry</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => setViewingInquiry(i)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="View message notes"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInquiryClick(i.id, i.customerName)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredInquiries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-xs text-gray-400">
                          No bulk inquiries found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEW MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search reviewer or message content..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark bg-brand-clinical"
                  />
                </div>
                <select
                  value={reviewStatusFilter}
                  onChange={(e) => setReviewStatusFilter(e.target.value)}
                  className="border border-brand-lavender rounded-lg px-3 py-2 text-xs text-gray-600 bg-brand-clinical cursor-pointer"
                >
                  <option value="all">All Moderations</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Reviews Moderation Table */}
              <div className="overflow-x-auto border border-brand-lavender rounded-2xl">
                <table className="min-w-full divide-y divide-brand-lavender text-left text-xs text-gray-600">
                  <thead className="bg-brand-clinical font-mono uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Reviewer Name</th>
                      <th className="px-6 py-3">Product Name</th>
                      <th className="px-6 py-3">Rating</th>
                      <th className="px-6 py-3">Review Message</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lavender bg-white">
                    {filteredReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-brand-clinical/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{r.customerName}</td>
                        <td className="px-6 py-4 font-medium max-w-[140px] truncate">{r.productName}</td>
                        <td className="px-6 py-4 font-mono font-bold text-amber-500">{r.rating} ★</td>
                        <td className="px-6 py-4 max-w-[240px] truncate italic">"{r.reviewMessage}"</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                            r.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : r.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-1 sm:space-y-0 sm:space-x-1.5 flex flex-col sm:flex-row items-center">
                          {r.status !== 'Approved' && (
                            <button
                              onClick={() => handleApproveReview(r.id, r.customerName)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve Review"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {r.status !== 'Rejected' && (
                            <button
                              onClick={() => handleRejectReview(r.id, r.customerName)}
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                              title="Reject Review"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReviewClick(r.id, r.customerName)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredReviews.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                          No customer reviews logged under matching search parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORY SETUP */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold uppercase text-gray-400">Categories setup index</h3>
                <button
                  onClick={openAddCategoryModal}
                  className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="overflow-x-auto border border-brand-lavender rounded-2xl">
                <table className="min-w-full divide-y divide-brand-lavender text-left text-xs text-gray-600">
                  <thead className="bg-brand-clinical font-mono uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Category Name</th>
                      <th className="px-6 py-3">Slug Route</th>
                      <th className="px-6 py-3">Creation Date</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lavender bg-white">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-brand-clinical/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{c.slug}</td>
                        <td className="px-6 py-4 font-mono text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => openEditCategoryModal(c)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            disabled={categories.length <= 1}
                            onClick={() => handleDeleteCategoryClick(c.id, c.name)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                            title={categories.length <= 1 ? "Cannot delete the sole category" : "Delete category"}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              
              {/* Profile details */}
              <form onSubmit={handleProfileUpdate} className="bg-brand-clinical p-6 rounded-2xl border border-brand-lavender/60 space-y-4">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  Update Administrative Profile
                </h3>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Administrative Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Administrative Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Profile Attributes
                </button>
              </form>

              {/* Password update */}
              <form onSubmit={handleChangePassword} className="bg-brand-clinical p-6 rounded-2xl border border-brand-lavender/60 space-y-4">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  Change Administrative Password
                </h3>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">New Secure Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" /> Update Vault Password
                </button>
              </form>

            </div>
          )}

        </div>

      </div>

      {/* MODALS OVERLAYS INDEX */}

      {/* 1. PRODUCT MODAL (ADD / EDIT) */}
      <AnimatePresence>
        {productModalMode && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setProductModalMode(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-brand-purple/40 shadow-2xl max-w-2xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-heading font-extrabold text-gray-900 mb-4 uppercase tracking-wide">
                {productModalMode === 'add' ? 'Add New Product Formulation' : 'Edit Formulation Details'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Clinical Grace Overnight Premium"
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Category Assignment *</label>
                    <select
                      required
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Product Type *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.productType || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value })}
                      placeholder="e.g. Ultra Thin, XL Pads, Overnight"
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Stock Status</label>
                    <select
                      value={editingProduct.stockStatus || 'In Stock'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Provide anatomical purpose, certifications, chemical properties..."
                    className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>

                {/* Sizes Array Manager */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes?.join(', ') || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="e.g. XL (280mm), XXL (320mm)"
                    className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none"
                  />
                </div>

                {/* External Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Amazon Link</label>
                    <input
                      type="url"
                      value={editingProduct.amazonLink || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, amazonLink: e.target.value })}
                      placeholder="https://amazon.com/..."
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Flipkart Link</label>
                    <input
                      type="url"
                      value={editingProduct.flipkartLink || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, flipkartLink: e.target.value })}
                      placeholder="https://flipkart.com/..."
                      className="w-full px-3.5 py-2 border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                {/* Features Tags block */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Key Formulation Features</label>
                  <div className="flex flex-wrap gap-1.5 p-3 border border-brand-lavender rounded-xl bg-brand-clinical min-h-[50px] mb-2">
                    {tempFeatures.map((feat, idx) => (
                      <span key={idx} className="bg-white border border-brand-purple/20 text-[10px] text-gray-700 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                        {feat}
                        <button type="button" onClick={() => setTempFeatures(tempFeatures.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 font-bold">×</button>
                      </span>
                    ))}
                    {tempFeatures.length === 0 && <span className="text-[10px] text-gray-400">No features assigned yet</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Add a new custom feature badge..."
                      className="flex-1 px-3 py-1.5 border border-brand-lavender rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFeatureText.trim()) {
                          setTempFeatures([...tempFeatures, newFeatureText.trim()]);
                          setNewFeatureText('');
                        }
                      }}
                      className="px-3 py-1.5 bg-brand-dark text-white rounded-lg font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Images Manager */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Product Images (Paste URLs)</label>
                  <div className="space-y-1">
                    {tempImages.map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="url"
                          required
                          value={img}
                          onChange={(e) => {
                            const updated = [...tempImages];
                            updated[idx] = e.target.value;
                            setTempImages(updated);
                          }}
                          className="flex-1 px-3 py-1.5 border border-brand-lavender rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          disabled={tempImages.length <= 1}
                          onClick={() => setTempImages(tempImages.filter((_, i) => i !== idx))}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTempImages([...tempImages, 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600'])}
                      className="px-3 py-1 bg-brand-clinical border border-brand-lavender text-gray-600 rounded-lg mt-2 text-[10px] font-mono"
                    >
                      + Add Image Slot
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-brand-clinical">
                  <div className="flex items-center gap-2">
                    <label className="font-mono text-[10px] uppercase text-gray-500">Publish Status:</label>
                    <select
                      value={editingProduct.status || 'Active'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                      className="border border-brand-lavender rounded px-2 py-1 bg-brand-clinical cursor-pointer font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setProductModalMode(null)}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-brand-dark text-white rounded-lg hover:bg-brand-darker font-semibold"
                    >
                      Save Formulation
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CATEGORY MODAL (ADD / EDIT) */}
      <AnimatePresence>
        {categoryModalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setCategoryModalMode(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-brand-purple/40 shadow-2xl max-w-sm w-full p-6 relative z-10"
            >
              <h3 className="text-lg font-heading font-extrabold text-gray-900 mb-4 uppercase tracking-wide">
                {categoryModalMode === 'add' ? 'Add New Category' : 'Rename Category'}
              </h3>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    placeholder="e.g. Eco Bio Pads"
                    className="w-full px-4 py-2 border border-brand-lavender rounded-xl focus:outline-none bg-brand-clinical"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCategoryModalMode(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-dark text-white rounded-lg font-semibold hover:bg-brand-darker"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. INQUIRY DETAIL MODAL VIEWER */}
      <AnimatePresence>
        {viewingInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setViewingInquiry(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-brand-purple/40 shadow-2xl max-w-md w-full p-6 relative z-10 space-y-4 text-xs text-gray-700"
            >
              <h3 className="text-lg font-heading font-extrabold text-gray-900 uppercase tracking-wide border-b border-brand-lavender pb-3 flex justify-between items-center">
                Inquiry Dispatch Details
                <span className="text-[9px] font-mono bg-brand-pink text-brand-dark px-2 py-0.5 rounded font-bold">
                  {viewingInquiry.id.toUpperCase()}
                </span>
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Author Coordinate</div>
                  <div className="font-bold text-gray-900 text-sm">{viewingInquiry.customerName}</div>
                  <div className="text-gray-500 font-sans">{viewingInquiry.companyName || 'Private Procurement'}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-brand-clinical pt-2">
                  <div>
                    <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Email</div>
                    <div className="font-medium">{viewingInquiry.email}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Mobile Phone</div>
                    <div className="font-mono">{viewingInquiry.phone}</div>
                  </div>
                </div>

                <div className="border-t border-brand-clinical pt-2">
                  <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Shipping Location</div>
                  <div className="font-medium leading-relaxed">
                    {viewingInquiry.address}, {viewingInquiry.city}, {viewingInquiry.state} - {viewingInquiry.pincode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-brand-clinical pt-2">
                  <div>
                    <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Product formulation</div>
                    <div className="font-bold text-brand-dark">{viewingInquiry.productName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Target Quantity</div>
                    <div className="font-mono font-bold">{viewingInquiry.quantity} Units</div>
                  </div>
                </div>

                <div className="border-t border-brand-clinical pt-2">
                  <div className="text-gray-400 font-mono uppercase text-[9px] mb-0.5">Additional Requisition Comments</div>
                  <p className="bg-brand-clinical p-3 rounded-lg text-gray-600 leading-relaxed max-h-[120px] overflow-y-auto italic">
                    "{viewingInquiry.message || 'No additional comments.'}"
                  </p>
                </div>

                {/* Inline status update */}
                <div className="pt-4 border-t border-brand-lavender flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase text-[9px] text-gray-400">Moderation Status:</span>
                    <select
                      value={viewingInquiry.status}
                      onChange={(e) => handleInquiryStatusChange(viewingInquiry.id, e.target.value)}
                      className="border border-brand-lavender rounded px-2 py-0.5 bg-brand-clinical cursor-pointer font-medium"
                    >
                      <option value="New Inquiry">New Inquiry</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setViewingInquiry(null)}
                    className="px-4 py-1.5 bg-brand-dark text-white rounded-lg hover:bg-brand-darker font-semibold font-sans"
                  >
                    Dismiss View
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
