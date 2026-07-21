import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    primary_image: string | null;
    slug: string;
  };
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ product, className = '' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleToggle}
      className={`p-2.5 rounded-full glass cursor-pointer shadow-premium hover:shadow-[#FF7A00]/10 hover:border-[#FF7A00]/30 transition-all ${className}`}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-5 h-5 transition-colors duration-300 ${
          active ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-slate-400 hover:text-[#FF7A00]'
        }`}
      />
    </motion.button>
  );
};
export default WishlistButton;
