import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Tag, Percent, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { pageTransition } from '../animations/framer-variants';

export const Cart: React.FC = () => {
  const { 
    cartItems, subtotal, discount, couponCode, shippingFee, total, 
    updateQuantity, removeFromCart, applyCoupon, removeCoupon 
  } = useCart();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);
    
    if (!couponInput) return;
    
    const success = await applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or LUMINA50');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess(false);
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
        <h1 className="font-serif text-3xl font-bold text-slate-800">Your Shopping bag</h1>
        <p className="text-slate-400 text-xs font-light">Check items comfort sizes and quantities before checkout.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-premium text-center p-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF8F2] flex items-center justify-center mb-4 text-[#FF7A00]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-700">Your bag is empty</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xs leading-relaxed font-light">
            You haven't added any products to your cart session yet. Switch to the shop catalog.
          </p>
          <Link
            to="/shop"
            className="mt-6 px-8 py-3 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-premium transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items Checklist grid: Column 1-8 */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-[#FFF8F2] rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 flex-shrink-0">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=200'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info details */}
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <Link to={`/shop/${item.product_slug}`} className="font-serif font-bold text-slate-800 text-sm sm:text-base hover:text-[#FF7A00]">
                    {item.product_name}
                  </Link>
                  <p className="text-slate-400 text-xs font-light">Size option: {item.size}</p>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                  {/* Quantity counters */}
                  <div className="flex items-center border border-slate-200 rounded-full bg-[#FFF8F2]/30 px-1 py-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-500 hover:bg-white rounded-full cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-500 hover:bg-white rounded-full cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Summed price */}
                  <span className="text-[#FF7A00] font-black text-sm sm:text-base w-20 text-right">
                    ₹{(item.product_price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove bin */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#FF7A00] text-xs font-bold uppercase tracking-wider transition-colors pt-2">
              <ArrowLeft className="w-4 h-4" /> Add more items
            </Link>
          </div>

          {/* Pricing summary cards: Column 9-12 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Application Panel */}
            <div className="bg-white p-6 rounded-[24px] shadow-premium border border-slate-100/50 space-y-4">
              <h3 className="font-serif font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Tag className="w-4 h-4 text-[#FF7A00]" /> Promo Coupons
              </h3>

              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 text-green-700 p-3 rounded-2xl border border-green-200 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-4 h-4" />
                    <span>Coupon: {couponCode} Applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-red-500 hover:underline text-[10px] cursor-pointer font-bold uppercase">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. WELCOME10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-grow px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-none focus:border-[#FF7A00] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-red-500 text-[10px] font-bold">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-[10px] font-bold">✓ Promo coupon applied successfully!</p>}
              
              <div className="p-2 bg-amber-50 rounded-xl text-amber-700 text-[10px] leading-relaxed">
                <span className="font-bold">Available Codes:</span> WELCOME10 (10% Off above 200), LUMINA50 (₹50 Off above 500)
              </div>
            </div>

            {/* Calculations Card panel */}
            <div className="bg-white p-6 rounded-[24px] shadow-premium border border-slate-100/50 space-y-4">
              <h3 className="font-serif font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-xs text-slate-500 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  {shippingFee > 0 ? (
                    <span className="text-slate-800 font-bold">₹{shippingFee.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600 font-bold">FREE</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center font-serif font-bold text-slate-800 py-1">
                <span>Total Amount</span>
                <span className="text-[#FF7A00] text-xl">₹{total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3.5 rounded-full bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-premium mt-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      )}

    </motion.div>
  );
};
export default Cart;
