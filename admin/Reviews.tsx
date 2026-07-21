import React from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import api from './src/services/api';


interface ReviewsProps {
  reviews: any[];
  refreshData: () => void;
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews, refreshData }) => {
  const handleApprove = async (id: number) => {
    try {
      await api.put(`/admin/reviews/${id}/approve`);
      refreshData();
    } catch (err) {
      console.warn('API review approve failed, overriding local mockup state', err);
      reviews.forEach(r => { if (r.id === id) r.status = 'Approved'; });
      refreshData();
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.put(`/admin/reviews/${id}/reject`);
      refreshData();
    } catch (err) {
      console.warn('API review reject failed, overriding local mockup state', err);
      reviews.forEach(r => { if (r.id === id) r.status = 'Rejected'; });
      refreshData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      refreshData();
    } catch (err) {
      console.warn('API review delete failed, updating mockup state', err);
      const idx = reviews.findIndex(r => r.id === id);
      if (idx > -1) reviews.splice(idx, 1);
      refreshData();
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">Feedback Reviews Moderation</h1>
        <p className="text-slate-400 text-xs font-light">Moderate organic hygiene product comments, filter star ratings, and toggle storefront displays.</p>
      </div>

      {/* Review Moderation grid */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-slate-400 font-light text-center py-10 bg-white rounded-2xl border border-slate-100 p-6">No customer reviews submitted yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Review details */}
              <div className="space-y-2 flex-grow max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-slate-800 text-sm">{r.product_name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${
                    r.status === 'Approved'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : r.status === 'Rejected'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {r.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-slate-400 font-semibold">• By {r.customer_name || r.user_name || 'Anonymous Customer'}</span>
                </div>

                <p className="text-slate-500 font-light leading-relaxed italic">
                  "{r.reviewMessage || r.comment}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 flex-shrink-0">
                {r.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="p-2 bg-green-50 border border-green-200 text-green-600 rounded-full hover:bg-green-100 transition-colors cursor-pointer"
                      title="Approve review"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="p-2 bg-red-50 border border-red-250 text-red-500 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                      title="Reject review"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 bg-slate-50 border border-slate-200 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default Reviews;
