import React from 'react';
import { DollarSign, ShoppingCart, Users, MessageSquare, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    pending_reviews: number;
    recent_orders: any[];
    monthly_stats: any[];
    category_distribution: any[];
  };
  activities: any[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, activities, onNavigate }) => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Operational Overview</h1>
<p className="text-slate-400 text-xs font-light">Real-time stats from JIYONI e-commerce platforms.</p>
      </div>

      {/* Cards list grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Revenue</span>
            <span className="text-2xl font-bold text-slate-800">₹{(stats?.total_revenue ?? 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#FF7A00]/30" onClick={() => onNavigate('orders')}>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-bold text-slate-800">{stats?.total_orders ?? 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#FF7A00]/30" onClick={() => onNavigate('customers')}>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Customers</span>
            <span className="text-2xl font-bold text-slate-800">{stats?.total_customers ?? 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#FF7A00]/30" onClick={() => onNavigate('reviews')}>
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Pending Reviews</span>
            <span className="text-2xl font-bold text-[#FF7A00]">{stats?.pending_reviews ?? 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders log panel - 8 columns */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-serif font-bold text-slate-800 text-base">Recent Sales Orders</h3>
            <button onClick={() => onNavigate('orders')} className="text-xs text-[#FF7A00] font-bold hover:underline flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-2.5">Order No</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Gateway</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {(stats?.recent_orders?.length ?? 0) === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400 font-light">No orders logged.</td>
                  </tr>
                ) : (
                  (stats?.recent_orders ?? []).map((ord) => (
                    <tr key={ord.id}>
                      <td className="py-3 font-bold text-slate-800">{ord.order_number}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          ord.status === 'Delivered' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 font-black text-[#FF7A00]">₹{ord.final_amount.toFixed(2)}</td>
                      <td className="py-3 font-semibold">{ord.payment_method}</td>
                      <td className="py-3">{new Date(ord.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity logs feed - 4 columns */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="font-serif font-bold text-slate-800 text-base">Platform Activity Logs</h3>
          </div>
          
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 text-xs">
            {(activities?.length ?? 0) === 0 ? (
              <p className="text-slate-400 font-light text-center py-10">No recent activity logs.</p>
              ) : (
              (activities ?? []).map((act) => (
                <div key={act.id} className="flex gap-2.5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-slate-700 font-medium leading-relaxed">{act.message}</p>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {new Date(act.time).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;
