import React from 'react';
import { motion } from 'framer-motion';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-[#FF7A00]/20 border-t-[#FF7A00]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="mt-4 text-[#FF7A00] font-medium tracking-wide uppercase text-xs"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Lumina Care
      </motion.p>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div 
      className={`bg-slate-200 animate-pulse rounded ${className || 'h-4 w-full'}`}
    />
  );
};
