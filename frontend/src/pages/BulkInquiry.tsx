import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileCheck, PhoneCall, Building } from 'lucide-react';
import api from '../services/api';

export const BulkInquiry: React.FC = () => {
  const [productsList, setProductsList] = useState<any[]>([]);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProductsList(response.data);
        if (response.data.length > 0) {
          setProductName(response.data[0].name);
        }
      } catch (err) {
        console.error('Failed to load products for bulk inquiry', err);
        setProductsList([]);
        setErrorMsg('Failed to load product catalog. Please try again later.');
      }
    };
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !companyName || !mobileNumber || !emailAddress || !address || !city || !state || !pincode || !productName || !quantity) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/inquiries', {
        full_name: fullName,
        company_name: companyName,
        mobile_number: mobileNumber,
        email_address: emailAddress,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        product_name: productName,
        quantity: parseInt(quantity),
        message: message
      });
      setSuccess(true);
      // Reset form
      setFullName('');
      setCompanyName('');
      setMobileNumber('');
      setEmailAddress('');
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-100/60 px-3.5 py-1.5 rounded-full"
          >
            B2B Wholesale Portal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-black text-slate-800 tracking-tight"
          >
            Bulk Wholesale Inquiry
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-light text-sm max-w-xl mx-auto"
          >
            Partner with Jiyoni Sanitary Pads. Fill in the wholesale request details below, and our distribution manager will connect with you within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-slate-800 text-lg">Wholesale Pricing</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                Unlock high-volume discounts, secure custom logistics, and explore dealership margins directly tailored for shops and health clinics.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-500">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-slate-800 text-lg">Direct Response</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                Once submitted, our sales desk registers the inquiry and contacts you via Phone/WhatsApp to finalize catalog options and delivery schedules.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div 
              layout
              className="bg-white p-8 rounded-3xl shadow-premium border border-slate-100"
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">Inquiry Logged Successfully!</h2>
                    <p className="text-slate-500 text-xs font-light max-w-sm mx-auto">
                      Thank you for choosing Jiyoni. Your inquiry has been recorded. Our regional coordinator will get in touch with you shortly.
                    </p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="mt-6 text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      Submit another wholesale inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                    {errorMsg && (
                      <div className="bg-red-55/70 text-red-600 p-3 rounded-2xl border border-red-100 font-medium">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                          placeholder="e.g. Priyanjali Sharma"
                        />
                      </div>
                      
                      {/* Company */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Company / Shop Name *</label>
                        <input 
                          type="text" 
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                          placeholder="e.g. Jiyoni Care Distributors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Mobile Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                          placeholder="e.g. 9876543210"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                          placeholder="e.g. partner@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider">Complete Address *</label>
                      <textarea 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50 resize-none" 
                        placeholder="Street details, Landmark, Area name"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* City */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">City *</label>
                        <input 
                          type="text" 
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                        />
                      </div>

                      {/* State */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">State *</label>
                        <input 
                          type="text" 
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                        />
                      </div>

                      {/* Pincode */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Pincode *</label>
                        <input 
                          type="text" 
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Product */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Product Name *</label>
                        <select 
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50 appearance-none font-semibold text-slate-700"
                        >
                          {productsList.map((p) => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-1.5">
                        <label className="text-slate-600 font-semibold uppercase tracking-wider">Required Quantity (Boxes) *</label>
                        <input 
                          type="number" 
                          min={1}
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50" 
                          placeholder="e.g. 50"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider">Additional Message / Special Request</label>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-400 bg-slate-50/50 resize-none" 
                        placeholder="Detail any delivery directions, custom packaging, or dealership questions"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full p-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-rose-100 disabled:bg-rose-300"
                    >
                      {loading ? (
                        <>Submitting Inquiry...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit B2B Inquiry
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkInquiry;
