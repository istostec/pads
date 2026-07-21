/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShoppingBag, Send, ShieldCheck, Heart, Sparkles, MessageSquareDot } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailsViewProps {
  productId: string;
  products: Product[];
  reviews: Review[];
  onBack: () => void;
  onNavigateToBulk: (productId: string) => void;
  onSubmitReview: (data: { customerName: string; rating: number; reviewMessage: string }) => void;
}

export default function ProductDetailsView({
  productId,
  products,
  reviews,
  onBack,
  onNavigateToBulk,
  onSubmitReview
}: ProductDetailsViewProps) {
  const product = products.find(p => p.id === productId);
  
  // States for interactive gallery
  const [activeImg, setActiveImg] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Write Review states
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revMessage, setRevMessage] = useState('');
  const [revSubmitted, setRevSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImg(product.images[0]);
      setRevSubmitted(false);
    }
  }, [product, productId]);

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="font-heading font-extrabold text-lg">Product Formulation Not Found</h3>
        <button onClick={onBack} className="text-brand-dark underline font-semibold">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Get related products (same category, excluding self)
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.status === 'Active')
    .slice(0, 3);

  // Get approved reviews for this product
  const approvedReviews = reviews.filter(r => r.productId === product.id && r.status === 'Approved');

  // Interactive Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revMessage) return;
    onSubmitReview({
      customerName: revName,
      rating: revRating,
      reviewMessage: revMessage
    });
    setRevName('');
    setRevRating(5);
    setRevMessage('');
    setRevSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Back to Products */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-brand-dark bg-white border border-brand-lavender rounded-xl hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Formulation Index
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Image Gallery Slider with Zoom on Hover */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Display Image */}
          <div
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-square bg-brand-blue/25 rounded-3xl border border-brand-lavender overflow-hidden cursor-zoom-in flex items-center justify-center p-6"
          >
            <img
              src={activeImg}
              alt={product.name}
              referrerPolicy="no-referrer"
              style={
                isZoomed
                  ? {
                      transform: 'scale(1.8)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    }
                  : undefined
              }
              className="w-full h-full object-cover rounded-2xl transition-transform duration-100 ease-out"
            />

            {/* Hint overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] uppercase font-mono px-3 py-1 rounded-full pointer-events-none tracking-wider">
              Hover to Magnify Material
            </div>
          </div>

          {/* Miniature Gallery Slides */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-brand-blue/10 transition-all p-1 ${
                    activeImg === img ? 'border-brand-dark shadow-md' : 'border-brand-lavender opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniature slide" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Spec Sheets & Information */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/50 text-xs font-bold font-mono text-brand-dark uppercase tracking-wider border border-brand-purple/25">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-[11px] font-mono tracking-wider uppercase text-brand-dark font-bold">
              Formulation Code: CG-SEC-{product.id.toUpperCase()}
            </p>
          </div>

          <div className="border-t border-brand-lavender pt-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">Anatomical Purpose</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Core Benefits checklist */}
          <div className="space-y-3 bg-brand-blue/30 p-5 rounded-2xl border border-brand-purple/20">
            <h3 className="text-xs font-heading font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-dark" />
              Certified Safety Matrix
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
              {product.features.map((feat, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-dark shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-dark shrink-0 mt-0.5" />
                <span>Sizes: {product.sizes.join(', ')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-dark shrink-0 mt-0.5" />
                <span>Status: {product.stockStatus}</span>
              </li>
            </ul>
          </div>

          {/* Purchase External CTAs */}
          <div className="space-y-3 pt-4 border-t border-brand-lavender">
            <div className="flex gap-3">
              <a
                href={product.amazonLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-white border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy on Amazon
              </a>
              <a
                href={product.flipkartLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-white border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy on Flipkart
              </a>
            </div>

            <button
              onClick={() => onNavigateToBulk(product.id)}
              className="w-full py-3.5 bg-brand-dark text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-darker transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              Request Custom Bulk Quote
            </button>
          </div>

        </div>

      </div>

      {/* Specifications Details Grid */}
      <section className="bg-white p-8 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-6">
        <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider border-b border-brand-lavender pb-3">
          Manufacturing Spec Sheet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">Thickness &amp; Core</div>
            <div className="font-bold text-gray-900">1.2mm ultra-thin with micro SAP retention lock</div>
          </div>
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">Top-Sheet Material</div>
            <div className="font-bold text-gray-900">100% Organic, non-GMO pure cotton weave</div>
          </div>
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">Glue &amp; Wings</div>
            <div className="font-bold text-gray-900">Dermatologically safe biological food-grade adhesive</div>
          </div>
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">Chlorine &amp; Bleaching</div>
            <div className="font-bold text-gray-900">0% Chlorine gas (Pure oxygenation treatment)</div>
          </div>
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">pH Neutral Protection</div>
            <div className="font-bold text-gray-900">Yes (Formulated at safe skin pH 5.5)</div>
          </div>
          <div>
            <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">Packaging Standard</div>
            <div className="font-bold text-gray-900">Biocompatible, individually wrapped bio-degradable bags</div>
          </div>
        </div>
      </section>

      {/* Reviews & Submission Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        
        {/* Approved Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquareDot className="w-5 h-5 text-brand-dark" />
            Approved Customer Reviews ({approvedReviews.length})
          </h3>

          {approvedReviews.length > 0 ? (
            <div className="space-y-4">
              {approvedReviews.map(rev => (
                <div key={rev.id} className="bg-brand-clinical p-5 rounded-2xl border border-brand-lavender/60 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-gray-900">{rev.customerName}</h4>
                      <div className="flex gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{rev.reviewMessage}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-brand-clinical p-8 rounded-2xl border border-brand-lavender/40 text-center text-xs text-gray-500">
              No approved reviews published for this formulation yet. Submit your experience using the adjoining form.
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-lavender/60 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
            Share Your Experience
          </h3>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Your health and reviews matter to us. To maintain hospital standards, reviews remain pending approval from the admin board before they are featured on the website.
          </p>

          {revSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center space-y-1">
              <div>✓ Testimonial Successfully Filed!</div>
              <div className="text-[10px] text-emerald-600 font-medium font-sans">
                Pending medical verification. Thank you for your feedback!
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="e.g. Meera Sharma"
                  className="w-full px-3.5 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Rating</label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark cursor-pointer bg-brand-clinical"
                >
                  <option value={5}>5 Stars - Absolute Comfort</option>
                  <option value={4}>4 Stars - High Absorption</option>
                  <option value={3}>3 Stars - Good Fit</option>
                  <option value={2}>2 Stars - Minor Issues</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  value={revMessage}
                  onChange={(e) => setRevMessage(e.target.value)}
                  placeholder="Share details about absorption, comfort, wings, etc..."
                  className="w-full px-3.5 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-4.5 h-4.5" />
                Submit and Log Review
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-brand-lavender pt-12 space-y-6">
          <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
            Related Product Formulations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(prod => (
              <div
                key={prod.id}
                className="bg-white p-4 rounded-2xl border border-brand-lavender/50 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                onClick={() => {
                  productId = prod.id;
                  setActiveImg(prod.images[0]);
                  setRevSubmitted(false);
                }}
              >
                <div className="space-y-3">
                  <div className="aspect-[4/3] bg-brand-blue/10 rounded-xl overflow-hidden">
                    <img src={prod.images[0]} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-heading font-bold text-xs text-gray-900 line-clamp-1">{prod.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{prod.description}</p>
                </div>
                <div className="text-[10px] text-brand-dark font-mono font-bold mt-3 text-right">
                  VIEW SHEET →
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
