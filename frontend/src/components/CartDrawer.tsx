import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-[#FFF8F2] shadow-premium-lg z-50 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF7A00]" />
                <span className="font-serif text-lg font-bold text-slate-800">Your Shopping Bag</span>
                <span className="bg-[#FF7A00]/10 text-[#FF7A00] text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.reduce((acc, c) => acc + c.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-premium">
                    <ShoppingBag className="w-7 h-7 text-slate-300" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-slate-700">Your bag is empty</h3>
                  <p className="text-slate-400 text-sm max-w-xs mt-1.5">
                    Explore our premium organic range and add comfort to your cycle.
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-semibold tracking-wide uppercase transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3 bg-white rounded-2xl shadow-premium border border-slate-100/50"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl bg-[#FFF8F2] overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <Link 
                          to={`/shop/${item.product_slug}`} 
                          onClick={onClose}
                          className="font-serif font-bold text-slate-800 text-sm hover:text-[#FF7A00] line-clamp-1"
                        >
                          {item.product_name}
                        </Link>
                        <p className="text-slate-400 text-xs mt-0.5">Size: {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-100 rounded-full bg-[#FFF8F2] px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full text-slate-500 hover:bg-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full text-slate-500 hover:bg-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-[#FF7A00] font-bold text-sm">
                            ₹{(item.product_price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky) */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-4">
                <div className="flex justify-between items-center text-slate-800 font-serif font-bold">
                  <span>Bag Subtotal</span>
                  <span className="text-lg text-[#FF7A00]">₹{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Tax and shipping fees calculated at checkout. Free shipping above ₹499.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full py-3 rounded-full text-center border border-slate-200 text-slate-700 hover:border-[#FF7A00] hover:text-[#FF7A00] text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    View Bag
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full py-3 rounded-full text-center bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
