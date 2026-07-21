/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, ArrowRight, Sparkles, Droplets, Award, FileSpreadsheet, ChevronDown, MessageSquare, Send } from 'lucide-react';
import { Product, Review } from '../types';

interface HomeViewProps {
  products: Product[];
  reviews: Review[];
  onNavigate: (view: string, targetId?: string) => void;
  onSubmitContact: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export default function HomeView({ products, reviews, onNavigate, onSubmitContact }: HomeViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  const features = [
    { title: 'High Absorption Core', desc: 'Engineered with quick-lock clinical SAP gel technology that absorbs up to 150ml in seconds.', icon: Droplets, color: 'bg-brand-blue border-brand-purple/20' },
    { title: '100% Rash-Free Certified', desc: 'Dermatologically tested organic soft weave that stays absolutely frictionless against sensitive skin.', icon: ShieldCheck, color: 'bg-brand-pink border-brand-purple/20' },
    { title: 'Organic Cotton Softness', desc: 'Top layer made of 100% natural, ethically sourced cotton fibers for a cushiony light feel.', icon: Heart, color: 'bg-brand-lavender border-brand-purple/20' },
    { title: 'Odour Control Carbon Layer', desc: 'Deep medical-grade carbon absorbency layers to completely neutralize odour without artificial perfume.', icon: Sparkles, color: 'bg-brand-blue border-brand-purple/20' },
    { title: 'Zero-Leak Double Barrier', desc: 'High guard protective barriers on both sides ensure maximum safety during intense physical movement.', icon: Award, color: 'bg-brand-pink border-brand-purple/20' },
    { title: 'Medical-Grade Breathability', desc: 'Micro-pores backsheet structure channels air seamlessly while fully blocking fluid molecules.', icon: ShieldCheck, color: 'bg-brand-lavender border-brand-purple/20' }
  ];

  const categories = [
    { id: 'cat-1', name: 'Ultra Thin Pads', desc: 'Almost invisible feel for active days.', tag: 'Regular Daywear', padSize: '240mm' },
    { id: 'cat-2', name: 'XL Pads', desc: 'Extra length with double wings for high flow.', tag: 'All Day Security', padSize: '280mm' },
    { id: 'cat-3', name: 'Overnight Pads', desc: 'Extended 320mm back guard for restful sleep.', tag: 'Heavy Flow Nightwear', padSize: '320mm' },
    { id: 'cat-4', name: 'Panty Liners', desc: 'Daily organic protection for continuous fresh feel.', tag: 'Daily Discharge Wear', padSize: '150mm' },
    { id: 'cat-5', name: 'Maternity Pads', desc: 'Ultra-cushion medical pads for post-natal care.', tag: 'Obstetric Certified', padSize: '380mm' }
  ];

  const faqs = [
    { q: 'What makes Clinical Grace sanitary pads different from standard brands?', a: 'Clinical Grace pads are designed with medical-grade organic cotton top sheets, entirely free of synthetic chlorine, bleaching chemicals, and synthetic perfumes. They feature a high-capacity SAP core that prevents rewetting and maintains pH balance, significantly reducing the risk of rashes or bacterial growth.' },
    { q: 'Are these pads recommended for sensitive or rash-prone skin?', a: 'Yes! Our pads are dermatologically tested and certified 100% rash-free. The absence of artificial fragrances and plastic top sheets makes them exceptionally gentle for women with highly sensitive skin, eczema, or contact dermatitis.' },
    { q: 'What absorption capacity do the Sleep-Safe Overnight pads offer?', a: 'Our Sleep-Safe XXL Overnight pads feature a 320mm extended length with wide double rear wings. They possess a clinical fluid-lock retention capacity of over 180ml, which easily ensures 10 to 12 hours of dry and secure sleep during heavy flow periods.' },
    { q: 'How can I place bulk custom or wholesale distribution inquiries?', a: 'We support bulk acquisition for clinics, pharmacies, NGOs, and regional FMCG distributors. You can easily navigate to our "Bulk Inquiry" page, fill out the requisition form with your target quantity, and our medical-hygiene logistics team will contact you within 24 hours with custom pricing grids.' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) return;
    onSubmitContact({
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      message: contactMessage
    });
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div className="space-y-24 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-20 bg-gradient-to-b from-brand-blue/30 via-white to-brand-clinical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/60 border border-brand-purple/40 text-brand-dark rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Dermatologically Certified Rash-Free
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 tracking-tight leading-none">
                Pure Medical-Grade <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-[#8b6b8f]">
                  Hygiene &amp; Comfort
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
                Empowering women with high-absorption organic cotton pads designed under strict healthcare standards. 100% organic cotton top layers, chlorine-free cores, and leak-proof secure channels for your absolute reassurance.
              </p>
              
              {/* CTA Row */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3.5 bg-brand-dark text-white font-medium text-sm rounded-xl hover:bg-brand-darker transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  Explore Medical Range
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('bulk-inquiry')}
                  className="px-6 py-3.5 bg-brand-pink text-brand-dark font-semibold text-sm rounded-xl hover:bg-brand-purple/50 border border-brand-purple/60 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Wholesale Bulk Order
                </button>
              </div>

              {/* Trust badges stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-lavender max-w-lg">
                <div>
                  <div className="text-2xl font-bold font-heading text-brand-dark">0%</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Chlorine &amp; Bleach</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-brand-dark">12h</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Odour Lock Defense</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-brand-dark">150ml</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Max Gel-Core Absorb</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Column: Interactive Pad Package Render */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                
                {/* Floating graphic decorative background shapes */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-pink/40 rounded-full blur-2xl -z-10" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-blue/60 rounded-full blur-2xl -z-10" />

                {/* Simulated Beautiful Premium Packaging box in pure CSS */}
                <div className="w-full aspect-[4/5] bg-white rounded-3xl border border-brand-purple/50 shadow-2xl overflow-hidden relative p-8 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300">
                  
                  {/* Package Top Header */}
                  <div className="flex justify-between items-start border-b border-brand-lavender pb-4">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-brand-dark font-bold bg-brand-pink/40 px-2 py-0.5 rounded-full">
                        Organic Premium
                      </span>
                      <h2 className="text-lg font-heading font-extrabold text-gray-900 mt-1">CLINICAL GRACE</h2>
                      <p className="text-[9px] text-gray-400 font-medium">DERMATOLOGICALLY CLINICALLY TESTED</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center border border-brand-purple/20">
                      <Heart className="w-4.5 h-4.5 text-brand-dark" fill="currentColor" />
                    </div>
                  </div>

                  {/* Package Mid Visual: Pad Illustration & Water Drop indicator */}
                  <div className="my-6 relative flex-1 flex flex-col justify-center items-center">
                    <div className="w-16 h-40 bg-brand-blue/30 rounded-full border border-brand-purple/40 rotate-12 flex flex-col justify-between p-3 relative shadow-inner">
                      <div className="w-full h-1/5 bg-white/60 rounded-full border border-brand-purple/20" />
                      <div className="flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-brand-dark animate-pulse" />
                      </div>
                      <div className="w-full h-1/5 bg-white/60 rounded-full border border-brand-purple/20" />
                    </div>

                    {/* Features printed on packaging */}
                    <div className="absolute bottom-2 left-0 space-y-1">
                      <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                        Rash-Free Soft Cotton
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                        Odour-Lock Filter Layer
                      </div>
                    </div>

                    {/* Pack size bubble */}
                    <div className="absolute right-0 top-1/4 bg-brand-dark text-white rounded-2xl px-3 py-2 text-center shadow-lg border border-brand-purple/40">
                      <div className="text-xs font-mono font-bold">30</div>
                      <div className="text-[8px] font-semibold uppercase tracking-wider text-brand-pink">XL Pads</div>
                    </div>
                  </div>

                  {/* Package Footer */}
                  <div className="border-t border-brand-lavender pt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <div>
                      <div>SIZE: XL (280mm)</div>
                      <div className="text-brand-dark font-semibold">WITH WIDE WINGS</div>
                    </div>
                    <div className="text-right">
                      <div>SECURE GEL LOCK</div>
                      <div className="text-xs text-gray-800 font-bold">★★★ QUALITY</div>
                    </div>
                  </div>
                </div>

                {/* Small overlay Buy badges */}
                <div className="absolute -bottom-4 right-4 bg-white/95 border border-brand-lavender shadow-md rounded-xl p-3 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono font-medium">Buy on</span>
                  <div className="flex gap-2">
                    <a href="https://www.amazon.com" target="_blank" rel="noreferrer" className="text-xs text-brand-dark font-bold hover:underline">Amazon</a>
                    <span className="text-gray-300">|</span>
                    <a href="https://www.flipkart.com" target="_blank" rel="noreferrer" className="text-xs text-brand-dark font-bold hover:underline">Flipkart</a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full">
            Technical Excellence
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Why Obstetricians Recommend Clinical Grace
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            A standard sanitary pad uses plastic top sheets and chemical deodorants. Clinical Grace is designed entirely for anatomical safety, skin preservation, and maximal fluid containment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.01] ${feat.color}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-brand-purple/30 text-brand-dark mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-md font-heading font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Product Categories Section */}
      <section className="bg-brand-blue/30 py-16 border-y border-brand-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-brand-purple/20">
              Complete Range
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Anatomically Tuned Sizes For Every Phase
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Every body and flow is unique. Explore our highly specialized configurations, designed with perfect density, protective barriers, and tailored dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('products')}
                className="bg-white p-6 rounded-2xl border border-brand-lavender/70 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-brand-pink/50 text-[9px] font-bold text-brand-dark uppercase tracking-wider font-mono">
                    {cat.tag}
                  </span>
                  <h3 className="text-sm font-heading font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-4 border-t border-brand-lavender mt-4 flex justify-between items-center text-[10px] text-brand-dark font-mono font-bold">
                  <span>LENGTH:</span>
                  <span className="bg-brand-blue px-2 py-0.5 rounded border border-brand-purple/20">{cat.padSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full">
              Our Bestsellers
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
              Clinical Sanitary Solutions
            </h2>
            <p className="text-xs text-gray-500">
              Selected premium pads optimized for continuous everyday wear and active protection.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 bg-brand-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider shadow hover:bg-opacity-90 flex items-center gap-2 cursor-pointer"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-brand-lavender hover:border-brand-purple/60 shadow-md hover:shadow-xl overflow-hidden transition-all flex flex-col justify-between group"
            >
              {/* Product Visual Top */}
              <div className="relative aspect-[4/3] bg-brand-blue/20 overflow-hidden flex items-center justify-center p-6">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white text-[9px] font-bold text-brand-dark uppercase tracking-wider font-mono border border-brand-purple/30">
                  {prod.productType}
                </span>
                
                {/* Stock Tag */}
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase border ${
                  prod.stockStatus === 'In Stock'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {prod.stockStatus}
                </span>
              </div>

              {/* Product Info Middle */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <h3 className="text-md font-heading font-bold text-gray-900 group-hover:text-brand-dark transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                  
                  {/* Small bullet point previews of features */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prod.features.slice(0, 2).map((feat, idx) => (
                      <span key={idx} className="bg-brand-clinical border border-brand-purple/20 text-[9px] text-gray-600 px-2 py-0.5 rounded">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buy / Inquiry Button row */}
                <div className="space-y-2 pt-4 border-t border-brand-lavender">
                  <div className="flex gap-2">
                    <a
                      href={prod.amazonLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2 border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Amazon
                    </a>
                    <a
                      href={prod.flipkartLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2 border border-brand-purple text-brand-dark hover:bg-brand-lavender/30 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Flipkart
                    </a>
                  </div>
                  <button
                    onClick={() => onNavigate('products', prod.id)}
                    className="w-full py-2 bg-brand-dark text-white text-xs font-semibold rounded-lg hover:bg-brand-darker transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Details &amp; Spec Sheet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Approved Customer Reviews Slider */}
      {approvedReviews.length > 0 && (
        <section className="bg-brand-pink/20 py-16 border-y border-brand-lavender">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
              <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-brand-purple/20">
                User Feedback
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
                Empathetic Care, Real Reviews
              </h2>
              <p className="text-xs text-gray-500">
                Read clinical approval testimonials directly shared by gynecologists, healthcare workers, and active everyday customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approvedReviews.slice(0, 3).map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-brand-lavender/60 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-md ${i < rev.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      "{rev.reviewMessage}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-brand-lavender mt-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-gray-900">{rev.customerName}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">Verified Advocate</p>
                    </div>
                    <span className="text-[9px] text-brand-dark font-semibold bg-brand-blue px-2 py-0.5 rounded">
                      {rev.productName.split(' ')[2] || 'Organic Pad'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate('reviews')}
                className="text-xs font-bold text-brand-dark underline hover:text-brand-darker cursor-pointer"
              >
                View all approved customer reviews &amp; write your own
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQ Section Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full">
            Technical Support
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500">
            Learn more about organic materials, packaging, certifications, and hygiene cycles.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-brand-lavender overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-brand-clinical transition-colors cursor-pointer"
                >
                  <span className="font-heading font-bold text-sm text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-brand-clinical">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Quick Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-3xl border border-brand-purple/20 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Info Side */}
          <div className="p-8 lg:p-12 lg:col-span-5 bg-brand-darker flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold font-mono text-brand-pink uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                Corporate Helpline &amp; Assistance
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Have direct inquiries regarding ingredients, certifications, bulk shipping timelines, or custom pharmacy distribution? Submit your coordinates, and our clinical compliance officer will address your concern.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs">
                <MessageSquare className="w-5 h-5 text-brand-pink" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-gray-400">WhatsApp Assistance</div>
                  <div className="font-bold">+91 98110 98110</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-brand-pink" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-gray-400">Direct Office Email</div>
                  <div className="font-bold">info@clinicalgrace.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 lg:p-12 lg:col-span-7 bg-white text-gray-900 flex flex-col justify-center">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <h4 className="font-heading font-bold text-md text-gray-900 mb-2">Send an Instant Message</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Mobile Contact No.</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 9988776655"
                  className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Message Detail</label>
                <textarea
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Explain how we can assist your brand journey..."
                  className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-lg focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-brand-darker transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                Transmit Inquiry Coordinates
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
