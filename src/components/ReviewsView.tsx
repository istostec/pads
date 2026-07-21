/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Send, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Review, Product } from '../types';

interface ReviewsViewProps {
  reviews: Review[];
  products: Product[];
  onSubmitReview: (data: { customerName: string; productId: string; rating: number; reviewMessage: string }) => void;
}

export default function ReviewsView({ reviews, products, onSubmitReview }: ReviewsViewProps) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const [activePage, setActivePage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const approvedReviews = useMemo(() => {
    return safeReviews.filter(r => r.status === 'Approved');
  }, [safeReviews]);

  // Pagination Parameters
  const pageSize = 6;
  const paginatedReviews = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return approvedReviews.slice(startIndex, startIndex + pageSize);
  }, [approvedReviews, activePage]);

  const totalPages = Math.ceil(approvedReviews.length / pageSize) || 1;

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    if (approvedReviews.length === 0) return { avg: 5, total: 0, breakDown: [0, 0, 0, 0, 0] };
    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / approvedReviews.length).toFixed(1));
    const countStars = [0, 0, 0, 0, 0]; // for 5, 4, 3, 2, 1 stars
    approvedReviews.forEach(r => {
      const starIndex = Math.min(Math.max(1, r.rating), 5);
      countStars[5 - starIndex]++;
    });
    return {
      avg,
      total: approvedReviews.length,
      breakDown: countStars.map(c => Math.round((c / approvedReviews.length) * 100))
    };
  }, [approvedReviews]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedProductId || !message) return;

    onSubmitReview({
      customerName: name,
      productId: selectedProductId,
      rating,
      reviewMessage: message
    });

    setName('');
    setSelectedProductId('');
    setRating(5);
    setMessage('');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full border border-brand-purple/20">
          Hypoallergenic Proof
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
          What Women Say About Us
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Every review on our website undergoes verified audit compliance. Read real accounts of women transitioning to 100% chemical-free, rash-free period hygiene.
        </p>
      </div>

      {/* Stats and Form Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Rating Stats Summary (Left) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-500 tracking-wider">
            Clinical Comfort Stats
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="text-5xl font-heading font-extrabold text-brand-dark">{aggregateStats.avg}</div>
            <div>
              <div className="flex gap-1 text-amber-400 text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {aggregateStats.total} approved reviews</p>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="space-y-2 pt-4 border-t border-brand-clinical">
            {aggregateStats.breakDown.map((percentage, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-gray-600">
                <span className="w-12 font-medium shrink-0">{5 - idx} Stars</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div style={{ width: `${percentage}%` }} className="h-full bg-brand-purple" />
                </div>
                <span className="w-8 text-right text-gray-400">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Public Submit Review Form (Middle-Right) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-brand-lavender shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-dark" />
          <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
            Submit a Menstrual Comfort Testimonial
          </h3>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-xs space-y-2 text-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-bold text-sm">Review Submitted Under Regulatory Escrow</h4>
                <p className="text-emerald-600 leading-relaxed font-sans max-w-sm mx-auto">
                  To prevent fraudulent bot placement, your review is logged as <strong>Pending</strong>. It will be vetted by the administrative panel for hygiene verification, then published!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-brand-dark text-white rounded-lg font-semibold uppercase tracking-wider text-[10px]"
                >
                  Write Another Review
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera Sharma"
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Product Formulation *</label>
                  <select
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                  >
                    <option value="">Choose formulation...</option>
                                    {safeProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Star Rating (1 to 5) *</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                  >
                    <option value={5}>★ ★ ★ ★ ★ (5 - Outstanding Dryness &amp; Comfort)</option>
                    <option value={4}>★ ★ ★ ★ (4 - Great Absorption &amp; Softness)</option>
                    <option value={3}>★ ★ ★ (3 - Standard Efficacy)</option>
                    <option value={2}>★ ★ (2 - Needs Improvement)</option>
                    <option value={1}>★ (1 - Dissatisfied with Wings / Glue)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Review Message *</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how the pad felt during active days, absorption, adhesive wings quality..."
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div className="sm:col-span-2 pt-2 text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center justify-center gap-2 cursor-pointer ml-auto"
                  >
                    <Send className="w-4 h-4" />
                    Transmit for Vetting
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Paginated Reviews List */}
      <section className="space-y-8 pt-8 border-t border-brand-lavender">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">
          Verified Reviews Index ({approvedReviews.length})
        </h3>

        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-brand-lavender/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">
                    "{rev.reviewMessage}"
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-clinical mt-4 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-heading font-bold text-xs text-gray-900">{rev.customerName}</h4>
                    <span className="text-[9px] text-brand-dark font-mono bg-brand-blue px-2 py-0.5 rounded uppercase font-semibold">
                      {rev.productName}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-3xl border border-brand-lavender max-w-sm mx-auto">
            <ShieldAlert className="w-12 h-12 text-brand-purple mx-auto mb-3" />
            <h4 className="font-heading font-semibold text-sm">No Published Reviews</h4>
            <p className="text-xs text-gray-400 mt-1">Be the first to leave high-absorption feedback above.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              disabled={activePage === 1}
              onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-brand-clinical border border-brand-lavender rounded text-xs text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 font-mono">
              Page {activePage} of {totalPages}
            </span>
            <button
              disabled={activePage === totalPages}
              onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-brand-clinical border border-brand-lavender rounded text-xs text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
