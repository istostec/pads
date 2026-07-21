import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, PackageOpen, 
  Tag, BarChart3, MessageSquare, BookOpen, HelpCircle, Mail, Settings as SettingsIcon,
  LogOut, KeyRound, AlertCircle, RefreshCw, Pencil
} from 'lucide-react';
import api from '../frontend/src/services/api';

// Pages
import Dashboard from './Dashboard';
import Products from './Products';
import Orders from './Orders';
import Customers from './Customers';
import Inventory from './Inventory';
import Coupons from './Coupons';
import Analytics from './Analytics';
import Reviews from './Reviews';
import BlogManagement from './BlogManagement';
import FAQManagement from './FAQManagement';
import ContactManagement from './ContactManagement';
import Settings from './Settings';
import BulkInquiries from './BulkInquiries';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Platform Data state
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    pending_reviews: 0,
    recent_orders: [],
    monthly_stats: [],
    category_distribution: []
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Authenticate Admin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await api.post('/auth/admin/login', { email, password });
      const { access_token } = res.data;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
    } catch (err) {
      console.error('API Admin login failed', err);
      setLoginError('Invalid administrative email address or security key.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  // Fetch all DB details for admin console
  const fetchAllData = async () => {
    if (!token) return;
    setLoadingData(true);

    try {
      // 1. Fetch dashboard metrics
      const statsRes = await api.get('/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns flat object: { total_revenue, total_orders, ... }
      setStats(statsRes?.data ?? {
        total_revenue: 0,
        total_orders: 0,
        total_customers: 0,
        pending_reviews: 0,
        recent_orders: [],
        monthly_stats: [],
        category_distribution: []
      });

      // 2. Fetch logs feed
      const actRes = await api.get('/admin/recent-activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(actRes.data);

      // 3. Fetch products CRUD list
      const prodRes = await api.get('/products?status=all');
      setProducts(prodRes.data);

      // 4. Fetch category dropdown list
      const catRes = await api.get('/categories');
      setCategories(catRes.data);

      // 5. Fetch orders list
      const ordRes = await api.get('/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordRes.data);

      // 6. Fetch users customer list
      const custRes = await api.get('/admin/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(custRes.data);

      // 7. Fetch reviews moderation list
      const revRes = await api.get('/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(revRes.data);

      // 8. Fetch blog posts
      const blogRes = await api.get('/blogs?status=all');
      setBlogs(blogRes.data);

      // 9. Fetch FAQ entries
      const faqRes = await api.get('/faq');
      setFaqs(faqRes.data);

      // 10. Fetch support tickets & subscribers
      const msgRes = await api.get('/contact/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(msgRes.data);

      const subRes = await api.get('/contact/newsletter/subscribers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribers(subRes.data);

    } catch (err) {
      console.error('Failed to fetch admin data', err);
      setCategories([]);
      setProducts([]);
      setBlogs([]);
      setFaqs([]);
      setCustomers([]);
      setReviews([]);
      setOrders([]);
      setMessages([]);
      setSubscribers([]);
      setStats({
        total_revenue: 0,
        total_orders: 0,
        total_customers: 0,
        pending_reviews: 0,
        recent_orders: [],
        monthly_stats: [],
        category_distribution: []
      });
      setActivities([]);
      setFetchError('Failed to load admin data from server.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Sidebar Menu mapping
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products CRUD', icon: ShoppingBag },
    { id: 'orders', label: 'Orders List', icon: ShoppingCart },
    { id: 'customers', label: 'User Accounts', icon: Users },
    { id: 'inventory', label: 'Warehouse Stock', icon: PackageOpen },
    { id: 'coupons', label: 'Promo Coupons', icon: Tag },
    { id: 'analytics', label: 'Revenue Trends', icon: BarChart3 },
    { id: 'reviews', label: 'Moderate Reviews', icon: MessageSquare },
    { id: 'blogs', label: 'Wellness Blogs', icon: BookOpen },
    { id: 'faqs', label: 'FAQ listings', icon: HelpCircle },
    { id: 'contact', label: 'Support Tickets', icon: Mail },
    { id: 'bulk_inquiries', label: 'Bulk Inquiries', icon: Pencil },
    { id: 'settings', label: 'Admin Settings', icon: SettingsIcon },
  ];

  // Render Login screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(#FF7A00_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />
        
        <div className="bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-700/80 space-y-6 relative z-10 text-xs">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-amber-500 flex items-center justify-center shadow-lg shadow-[#FF7A00]/25 mx-auto">
              <span className="text-white font-serif font-black text-xl">L</span>
            </div>
            <h1 className="font-serif text-white font-bold text-2xl">Executive Administration</h1>
            <p className="text-slate-400 font-light">JIYONI Platform Control Console</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-900/30 text-red-400 rounded-xl border border-red-800 flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase tracking-wider block">Admin Email</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jiyoni.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#FF7A00]"
                />
                <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold uppercase tracking-wider block">Security Access Key</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/40 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#FF7A00]"
                />
                <KeyRound className="absolute left-3 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#FF7A00] hover:bg-[#E06B00] text-white font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              {loginLoading ? 'Securing Access Connection...' : 'Verify Credentials'}
            </button>

          </form>

        </div>
      </div>
    );
  }

  // Render Admin Console Dashboard on login
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-xs text-slate-700 font-sans">
      
      {/* Sidebar Control Layout Panel */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-400 flex flex-col flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-[radial-gradient(#FF7A00_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
        
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-2 relative z-10 bg-slate-950/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF7A00] to-amber-500 flex items-center justify-center">
            <span className="text-white font-serif font-black text-sm">L</span>
          </div>
          <div>
            <h2 className="font-serif font-bold text-white text-base leading-tight">JIYONI Control</h2>
            <span className="text-[9px] text-[#FF7A00] uppercase font-bold tracking-widest">Executive console</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-semibold ${
                  active 
                    ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/25' 
                    : 'hover:bg-slate-850 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 relative z-10 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold uppercase transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </aside>

      {/* Main Administrative content viewports */}
      <main className="flex-grow p-6 sm:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-6">
        {fetchError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded">
            {fetchError}
          </div>
        )}
        
        {/* Loading header loader */}
        {loadingData && (
          <div className="bg-[#FF7A00]/10 text-[#FF7A00] p-2 px-4 rounded-xl font-bold uppercase flex items-center gap-2 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing data collections...
          </div>
        )}

        {/* Dynamic page viewport renders */}
        {activeTab === 'dashboard' && <Dashboard stats={stats} activities={activities} onNavigate={setActiveTab} />}
        {activeTab === 'products' && <Products products={products} categories={categories} refreshData={fetchAllData} />}
        {activeTab === 'orders' && <Orders orders={orders} refreshData={fetchAllData} />}
        {activeTab === 'customers' && <Customers customers={customers} />}
        {activeTab === 'inventory' && <Inventory products={products} refreshData={fetchAllData} />}
        {activeTab === 'coupons' && <Coupons coupons={orders} refreshData={fetchAllData} />} {/* uses orders mapping or a state list, we will reuse orders or coupons fetched */}
        {activeTab === 'analytics' && <Analytics stats={stats} />}
        {activeTab === 'reviews' && <Reviews reviews={reviews} refreshData={fetchAllData} />}
        {activeTab === 'blogs' && <BlogManagement blogs={blogs} refreshData={fetchAllData} />}
        {activeTab === 'faqs' && <FAQManagement faqs={faqs} refreshData={fetchAllData} />}
        {activeTab === 'contact' && <ContactManagement messages={messages} subscribers={subscribers} refreshData={fetchAllData} />}
        {activeTab === 'bulk_inquiries' && <BulkInquiries />}
        {activeTab === 'settings' && <Settings />}


      </main>

    </div>
  );
};
export default App;
