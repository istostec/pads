import React, { useMemo } from 'react';

import { Star, Eye, Send, ExternalLink } from 'lucide-react';
import { normalizeImageUrl } from '../utils/imageUrl';
import { getSafeImageSrc } from '../utils/imageSrc';

import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistButton } from './WishlistButton';


interface ProductCardProps {

  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number | null;
    product_type?: string;
    primary_image: string | null;
    sizes?: string[];
    description?: string;
    amazon_link?: string;
    flipkart_link?: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = normalizeImageUrl(product.primary_image);

  const navigate = useNavigate();

  const images = useMemo(() => {

    const imgs: string[] = [];
    if (product.primary_image) imgs.push(product.primary_image);
    // product.cards may include additional images under product.images in some payloads
    const anyProd = product as any;
    if (Array.isArray(anyProd.images)) {
      for (const im of anyProd.images) {
        if (im?.image_url) imgs.push(im.image_url);
      }
    }
    return Array.from(new Set(imgs));
  }, [product]);


  const handleBulkRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/bulk-inquiry');
  };

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl border border-rose-100/50 p-4 transition-all shadow-md hover:shadow-xl group flex flex-col h-full relative"
    >
      {/* Wishlist floating toggle */}
      <div className="absolute top-6 right-6 z-10">
        <WishlistButton product={product} />
      </div>

      {/* Image box */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative w-full aspect-square rounded-2xl bg-rose-50/30 overflow-hidden flex items-center justify-center mb-5 border border-slate-100"
      >


        <img
          src={getSafeImageSrc(primaryImage || images[0])}
          onError={(e) => {
            // Prevent broken image icons by falling back to a placeholder.
            const el = e.currentTarget;
            el.src = getSafeImageSrc('');
          }}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hover:scale-110"
          loading="lazy"
          decoding="async"
        />


        
        {/* Quick view visual cue */}
        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

          <div className="bg-white/95 p-3 rounded-full text-rose-500 shadow-md">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Product Details info */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category/Type tag */}
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            {product.product_type || 'Premium Pad'}
          </span>

          {/* Heading */}
          <Link to={`/shop/${product.slug}`} className="font-serif font-bold text-slate-800 text-sm hover:text-rose-500 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </Link>

          {/* Short description */}
          {product.description && (
            <p className="text-slate-500 text-xs font-light leading-normal line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Available Sizes Display */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-[9px] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full font-bold w-fit">
              Size: {product.sizes.join(', ')}
            </div>
          )}

          {/* Review Star Rating */}
          <div className="flex items-center gap-1 pt-1">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-slate-400 text-[9px] font-semibold">(5.0)</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="space-y-3 pt-3 border-t border-rose-50/50">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-800 font-serif font-black text-base">₹{product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-slate-400 line-through text-xs">
                ₹{product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Amazon and Flipkart Buy Buttons */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={(e) => handleExternalLink(e, product.amazon_link || 'https://www.amazon.in')}
              className="py-2.5 rounded-xl border border-slate-200 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/40 text-amber-800 flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              Amazon <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleExternalLink(e, product.flipkart_link || 'https://www.flipkart.com')}
              className="py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-100/40 text-blue-800 flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              Flipkart <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Bulk Order Button */}
          <button
            onClick={handleBulkRedirect}
            className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md shadow-rose-100"
          >
            <Send className="w-3.5 h-3.5" /> Bulk Wholesale Order
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
