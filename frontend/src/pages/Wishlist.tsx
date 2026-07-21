import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { pageTransition, fadeInUp } from '../animations/framer-variants';

export const Wishlist: React.FC = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = async (item: any) => {
    // Add default size
    await addToCart(
      item.product_id,
      item.product_name,
      item.product_price,
      item.product_image,
      'Regular (240mm)',
      1,
      item.product_slug
    );
    // Remove from wishlist
    toggleWishlist({
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      primary_image: item.product_image,
      slug: item.product_slug
    });
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8"
    >
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-slate-800">Your Wishlist</h1>
        <p className="text-slate-400 text-xs font-light">Saved comfortable hygiene items for future cycle wellness.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-premium text-center p-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF8F2] flex items-center justify-center mb-4 text-[#FF7A00]">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-700">Wishlist is empty</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xs leading-relaxed font-light">
            You haven't bookmarked any products yet. Browse our range and click the heart icons.
          </p>
          <Link
            to="/shop"
            className="mt-6 px-8 py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-premium transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                variants={fadeInUp}
                custom={idx}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-square w-full rounded-2xl bg-[#FFF8F2] overflow-hidden flex items-center justify-center mb-4 border border-slate-100">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=300'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist({ id: item.product_id, name: item.product_name, price: item.product_price, primary_image: item.product_image, slug: item.product_slug })}
                    className="absolute top-4 right-4 p-2 bg-white/90 text-slate-400 hover:text-red-500 rounded-full cursor-pointer transition-colors shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Link to={`/shop/${item.product_slug}`} className="font-serif font-bold text-slate-800 text-sm hover:text-[#FF7A00] line-clamp-2">
                      {item.product_name}
                    </Link>
                    <span className="text-[#FF7A00] font-black text-sm block mt-1">₹{item.product_price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddAllToCart(item)}
                    className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-premium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {wishlistItems.length > 0 && (
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#FF7A00] text-xs font-bold uppercase tracking-wider transition-colors pt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      )}

    </motion.div>
  );
};
export default Wishlist;
