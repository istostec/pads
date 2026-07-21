import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

interface AnalyticsProps {
  stats: {
    total_revenue: number;
    total_orders: number;
    monthly_stats: any[];
    category_distribution: any[];
  };
}

export const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  const monthlyStats = Array.isArray(stats.monthly_stats) ? stats.monthly_stats : [];
  const categoryDistribution = Array.isArray(stats.category_distribution) ? stats.category_distribution : [];

  const maxSales = Math.max(
    ...monthlyStats.map(s => Number(s?.sales ?? 0)),
    1000
  );


  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Business Revenue Analytics</h1>
        <p className="text-slate-400 text-xs font-light">Interactive tracking of gross sales, growth parameters, and top-selling comfort pad styles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Performance Chart - 8 Columns */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-[#FF7A00]" /> Monthly Gross Earnings
            </h3>
            <span className="text-slate-400 font-bold uppercase">Last 6 Months</span>
          </div>

          {/* SVG Chart Render */}
          <div className="h-60 flex items-end justify-between pt-6 border-b border-slate-100 relative">
            
            {/* Grid helper guidelines */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-20 text-[10px]">
              <div className="border-t border-slate-300 w-full pt-1">₹{(maxSales).toFixed(0)}</div>
              <div className="border-t border-slate-300 w-full pt-1">₹{(maxSales / 2).toFixed(0)}</div>
              <div className="w-full pt-1" />
            </div>

            {monthlyStats.map((month) => {
              const pct = (Number(month?.sales ?? 0) / maxSales) * 100;
              return (

                <div key={month.month} className="flex flex-col items-center gap-2 flex-grow group relative z-10">
                  {/* Tooltip */}
                  <div className="absolute top-[-30px] bg-slate-850 text-white font-bold px-2 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{month.sales.toFixed(2)}
                  </div>
                  {/* Bar */}
                    <div 
                      className="w-10 bg-gradient-to-t from-[#FF7A00] to-amber-400 rounded-t-lg transition-all duration-700 shadow-premium" 
                      style={{ height: `${pct}%`, minHeight: '8px' }}
                    />
                    <span className="font-bold text-slate-500">{month.month ?? ''}</span>

                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown pie list - 4 Columns */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="font-serif font-bold text-slate-800 text-base flex items-center gap-1.5">
              <Award className="w-5 h-5 text-[#FF7A00]" /> Catalog Distribution
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {categoryDistribution.map((cat, idx) => {
              const colors = ['bg-[#FF7A00]', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                      {cat.name}
                    </span>
                    <span>{cat.value} Products</span>
                  </div>
                  {/* Horizontal bar */}
                  <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colors[idx % colors.length]} transition-all duration-700`}
                      style={{ width: `${(cat.value / (productsCount(stats.category_distribution) || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

const productsCount = (items: any[]) => {
  return items.reduce((acc, curr) => acc + curr.value, 0);
};

export default Analytics;
