import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSafeImageSrc } from '../utils/imageSrc';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string | null;
  };
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const hasImage = Boolean(category.image_url);

  return (
    <Link to={`/shop?category=${category.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-[#FF7A00]/30 shadow-premium transition-all text-center flex flex-col items-center h-full"
      >
        {hasImage ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border border-slate-100 group-hover:scale-105 transition-transform">
            <img
              src={getSafeImageSrc(category.image_url)}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const fallback = el.nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = 'flex';
              }}
            />
            <div
              className="w-full h-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] hidden"
            >
              <ImageOff className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mb-4 group-hover:scale-110 transition-transform">
            <Leaf className="w-8 h-8" />
          </div>
        )}
        <h3 className="font-serif font-bold text-slate-800 text-lg group-hover:text-[#FF7A00] transition-colors leading-tight">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-slate-400 text-xs font-light mt-2 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </motion.div>
    </Link>
  );
};
export default CategoryCard;
