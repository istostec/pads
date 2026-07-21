import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { company } from '../config/company';

export const AvailableSizesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-100/60 text-rose-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Available Sizes
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800">Choose Your Comfort Fit</h2>
        <p className="text-slate-400 text-sm sm:text-base font-light max-w-2xl mx-auto">
          Premium protection with size-specific dimensions designed for confident, comfortable days.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {company.availableSizes.map((s, idx) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.5 }}
            className="bg-white border border-slate-100/60 rounded-[28px] shadow-premium p-6 relative overflow-hidden group hover:shadow-premium-lg transition-all"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl" />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-rose-500 font-black text-2xl font-serif">{s.label}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  {s.dimensions}
                </div>
              </div>

              <div className="text-slate-800 font-bold text-sm">{s.piecesPerBox} Pieces per Box</div>
              <p className="text-slate-500 text-xs font-light leading-relaxed">
                Tailored comfort for your daily routine—secure fit, gentle feel, and confidence built-in.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-400 text-xs">Click a product size on the product details page to add to bag.</span>
              </div>
            </div>

            <div className="mt-6 h-px bg-gradient-to-r from-rose-500/0 via-rose-500/30 to-rose-500/0" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AvailableSizesSection;

