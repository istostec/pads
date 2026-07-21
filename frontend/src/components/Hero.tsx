import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Leaf, HeartPulse, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company } from '../config/company';

export const Hero: React.FC = () => {
  // pick a local product image for the hero
  const heroImg = '/images/products/WhatsApp Image 2026-07-08 at 2.32.13 PM.jpeg';
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-rose-50 via-white to-purple-50 overflow-hidden pt-12 pb-20">
      
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-rose-200/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-purple-200/20 blur-3xl" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ec4899_0.7px,transparent_0.7px)] [background-size:16px_16px] opacity-[0.03]" />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text content: Column 1-7 */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-rose-100/60 text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Leaf className="w-3.5 h-3.5" />
              {company.tagline}
            </motion.div>


            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.12]"
              >
                Luxurious Comfort <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 italic font-normal">
                  For Your Whole Cycle
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
              >
                Experience premium dermatologically approved, super soft 100% pure cotton sanitary pads engineered to guarantee zero skin irritation, anion protection, and advanced leak locks.
              </motion.p>
            </div>

            {/* Buttons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs"
            >
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-wide uppercase shadow-lg shadow-rose-105 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/bulk-inquiry"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold tracking-wide uppercase shadow-md border border-slate-100 transition-all text-center flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-rose-500" /> Bulk Inquiry
              </Link>
            </motion.div>

            {/* Badges/USP Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0 text-left"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>100% Cotton</span>
                </div>
                <span className="text-slate-400 text-xs font-light">Super Soft Feel</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Anion Chip</span>
                </div>
                <span className="text-slate-400 text-xs font-light">Anti-Bacterial Protection</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                  <Leaf className="w-4 h-4 text-rose-500" />
                  <span>Leak Lock</span>
                </div>
                <span className="text-slate-400 text-xs font-light">Advanced Absorption</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Visual Banner: Column 8-12 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center perspective-1000"
          >
            {/* Visual Glass Container Frame */}
            <div className="relative w-[300px] h-[400px] sm:w-[340px] sm:h-[450px] rounded-[40px] overflow-hidden border-8 border-white shadow-premium-lg bg-white bg-cover bg-center">
              <img
                src={heroImg}
                alt="JIYONI sanitary pads"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />

              
              {/* Internal Glass Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-3xl glass text-slate-800 space-y-1">
                <h4 className="font-serif font-bold text-sm">{company.brand}</h4>
                <p className="text-slate-500 text-xs">XL (280mm) | 34 Pieces per Box</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-rose-550 font-black text-sm">₹249.00</span>
                  <Link to="/shop/jiyoni-pure-cotton-xl-pads" className="text-xs text-rose-500 font-bold hover:underline">View Product</Link>
                </div>
              </div>
            </div>

            {/* Back Floating Comfort badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 -left-6 p-4 rounded-2xl glass shadow-premium flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Safety Standard</p>
                <p className="text-xs font-bold text-slate-800">Free Disposable Bags</p>
              </div>
            </motion.div>

            {/* Active Counter Box */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-16 -right-6 p-4 rounded-2xl glass shadow-premium text-center min-w-[120px]"
            >
              <h3 className="text-2xl font-serif font-extrabold text-rose-500">100%</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anti-Bacterial Anion</p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

