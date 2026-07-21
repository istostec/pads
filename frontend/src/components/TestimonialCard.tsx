import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    role?: string;
    rating: number;
    message: string;
  };
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Rating stars */}
        <div className="flex items-center text-amber-400">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${
                idx < testimonial.rating ? 'fill-current' : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Message body */}
        <p className="text-slate-600 text-sm italic leading-relaxed font-light">
          "{testimonial.message}"
        </p>
      </div>

      {/* Author profile */}
      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center font-serif text-[#FF7A00] font-black text-sm">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-serif font-bold text-slate-800 text-sm flex items-center gap-1.5">
            {testimonial.name}
            <span title="Verified User">
              <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
            </span>
          </h4>
          {testimonial.role && (
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {testimonial.role}
            </p>
          )}
        </div>
      </div>

    </motion.div>
  );
};
export default TestimonialCard;
