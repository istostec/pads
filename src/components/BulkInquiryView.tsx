/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, ShieldCheck, Mail, Phone, MapPin, Building, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface BulkInquiryViewProps {
  products: Product[];
  selectedProductId?: string;
  onSubmitInquiry: (data: {
    customerName: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    productId: string;
    quantity: number;
    message: string;
  }) => void;
}

export default function BulkInquiryView({ products, selectedProductId = '', onSubmitInquiry }: BulkInquiryViewProps) {
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [productId, setProductId] = useState(selectedProductId || (products[0]?.id || ''));
  const [quantity, setQuantity] = useState(1000);
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const statesOfIndia = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone || !productId || !quantity) return;

    onSubmitInquiry({
      customerName,
      companyName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      productId,
      quantity: Number(quantity),
      message
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setCustomerName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setProductId(products[0]?.id || '');
    setQuantity(1000);
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <span className="text-xs font-bold font-mono text-brand-dark uppercase tracking-widest bg-brand-pink/50 px-3 py-1 rounded-full border border-brand-purple/20">
          Distribution &amp; Hospital procurement
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
          Request Bulk Supply Specifications
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Are you looking to supply Clinical Grace products to your pharmacy, clinic, NGO, or municipal healthcare facility? Submit your target order parameters below. Our supply team handles bespoke logistic allocations.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* Animated Success Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 text-center space-y-6 max-w-lg mx-auto relative overflow-hidden"
          >
            {/* Top decorative clinical green line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 mx-auto flex items-center justify-center border border-emerald-200 text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-heading font-extrabold text-gray-900">
                Bulk Inquiry Transmitted Successfully!
              </h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Thank you for selecting Clinical Grace. Your wholesale requisition coordinates have been logged into our master enterprise database. A corporate hygiene counselor will reach out to you via email or phone within 24 working hours.
              </p>
            </div>

            {/* Quick summary check */}
            <div className="bg-brand-clinical p-4 rounded-xl text-left text-xs border border-brand-lavender max-w-xs mx-auto space-y-1">
              <div className="text-gray-400 font-mono uppercase text-[9px]">Receipt Coordinates</div>
              <div className="text-gray-800"><strong>Customer:</strong> {customerName}</div>
              <div className="text-gray-800"><strong>Institution:</strong> {companyName || 'Private Acquisition'}</div>
              <div className="text-gray-800"><strong>Target Quantity:</strong> {quantity} units</div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-brand-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </motion.div>
        ) : (
          /* Premium Form Layout */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl border border-brand-lavender shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-dark" />
            
            <form onSubmit={handleInquirySubmit} className="p-8 space-y-6">
              
              {/* Part 1: Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-dark border-b border-brand-lavender pb-2">
                  1. Corporate &amp; Individual Contact Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Company / Institution Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. St. Jude Healthcare Clinic"
                        className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@healthcare.org"
                        className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Mobile Contact Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 9988776655"
                        className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Shipping Coordinates */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-dark border-b border-brand-lavender pb-2">
                  2. Shipping &amp; Logistics Coordinates
                </h3>
                
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter complete facility or warehouse shipping coordinates..."
                      className="w-full pl-9 pr-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {statesOfIndia.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Pincode / Postal PIN</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6 Digits"
                      maxLength={6}
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>
              </div>

              {/* Part 3: Requisition Spec */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-dark border-b border-brand-lavender pb-2">
                  3. Requisition &amp; Product Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Target Product Range *</label>
                    <select
                      required
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark bg-white cursor-pointer"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.productType})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Required Quantity (Units) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      placeholder="Minimum 100 units"
                      className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Additional Requisition Comments</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specific custom configurations, tax details (GST), or regulatory packaging standards..."
                    className="w-full px-4 py-2 text-xs border border-brand-lavender rounded-xl focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-gray-400 font-mono">
                <span>* Mandatory field entries</span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-darker transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Transmit Bulk Requisition
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
