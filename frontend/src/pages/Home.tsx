import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Activity, Leaf } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import Newsletter from '../components/Newsletter';
import api from '../services/api';
import { fadeInUp, staggerContainer, pageTransition } from '../animations/framer-variants';
import AvailableSizesSection from '../components/AvailableSizesSection';
import ProductGallery from '../components/ProductGallery';


export const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);
        
        const prodRes = await api.get('/products');
        setFeaturedProducts(prodRes.data.slice(0, 3));
      } catch (err) {
        console.error('API error on home load', err);
        setCategories([]);
        setFeaturedProducts([]);
      }
    };
    fetchData();
  }, []);

  const testimonials = [
    { id: 1, name: 'Meera Nair', role: 'Verified Customer', rating: 5, message: 'Genuinely rash-free! I have extremely sensitive skin and struggled with almost every major brand. This soft cotton weave is an absolute game-changer.' },
    { id: 2, name: 'Priya Patel', role: 'Verified Customer', rating: 5, message: 'The absorption capacity is fantastic. I work 10-hour hospital shifts, and I felt dry, secure, and confident all day.' },
    { id: 3, name: 'Dr. Sarah Jenkins', role: 'OB/GYN Clinic director', rating: 5, message: 'I highly recommend JIYONI organic pads to patients suffering from monthly recurring dermatitis. The lack of bleach make all the difference.' }
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-20 pb-20"
    >
      {/* Visual Hero Block */}
      <Hero />

      {/* Available Sizes */}
      <div className="pt-4">
        <AvailableSizesSection />
      </div>

      {/* Premium Product Gallery */}
      <div className="pt-4">
        <ProductGallery />
      </div>

      {/* Categories Grid — Live from API, no hardcoded data */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-slate-800">Shop by Comfort Level</h2>
          <p className="text-slate-400 text-sm font-light max-w-md mx-auto">
            Choose GOTS certified organic materials custom-tailored to different stages of your flow.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-premium">
            <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-light text-sm">No comfort categories available yet.</p>
            <p className="text-slate-300 text-xs font-light mt-1">Check back soon as we add new organic options.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat, idx) => (
              <motion.div key={cat.id} variants={fadeInUp} custom={idx}>
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-serif text-3xl font-bold text-slate-800">Featured Comforts</h2>
            <p className="text-slate-400 text-sm font-light">Explore our highly-recommended organic options.</p>
          </div>
          <motion.div whileHover={{ x: 5 }}>
            <a href="/shop" className="text-[#FF7A00] font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              View Entire Collection →
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Brand Science Story (USP) */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left illustration */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600"
              alt="Organic Cotton Field"
              className="rounded-3xl shadow-premium border-4 border-slate-50 w-full object-cover max-h-[450px]"
            />
            {/* Float elements */}
            <div className="absolute -bottom-6 -right-6 p-5 rounded-2xl glass shadow-premium text-center">
              <span className="text-[#FF7A00] text-3xl font-extrabold block">100%</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Biodegradable</span>
            </div>
          </div>

          {/* Right USP descriptions */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider block">The Organic Science</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
                Designed to Heal, Crafted to Protect
              </h2>
              <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
                Conventional sanitary pads are loaded with bleached wood pulp, synthetic plastic covers, and fragrance additives that lock in moisture, causing recurring skin chafing, itching, and bacterial odors. JIYONI switches the paradigm with unbleached organic sheets.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">Hypoallergenic Dry-Mesh Layer</h4>
                  <p className="text-slate-400 text-xs font-light mt-1">Allows natural skin breathability, preventing micro-humidity levels that cause dermatitis.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">Anatomical Anti-Leak Guard</h4>
                  <p className="text-slate-400 text-xs font-light mt-1">Side protection channels adjust to body shapes, ensuring stain protection during movements.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">No Dioxins or Bleach Checks</h4>
                  <p className="text-slate-400 text-xs font-light mt-1">Free from chemicals, plastics, artificial perfumes, and chlorine processing treatments.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Customer Testimonials reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-slate-800">Comfort Stories</h2>
          <p className="text-slate-400 text-sm font-light">Join thousands of women who switched to rash-free cycles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Newsletter />
      </div>

    </motion.div>
  );
};
export default Home;
