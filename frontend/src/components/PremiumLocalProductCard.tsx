import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export type ProductVariantKey = 'XL' | 'XXL' | 'XXXL';

const VARIANTS: Record<ProductVariantKey, { length: string; quantity: number }> = {
  XL: { length: '280 mm', quantity: 34 },
  XXL: { length: '320 mm', quantity: 20 },
  XXXL: { length: '380 mm', quantity: 16 },
};

type PremiumLocalProductCardProps = {
  imageSrc: string;
  productName: string;
  shortDescription: string;
  productTypeBadge?: string;
  imageGallery?: string[];
};

export const PremiumLocalProductCard: React.FC<PremiumLocalProductCardProps> = ({
  imageSrc,
  productName,
  shortDescription,
  productTypeBadge = 'Organic Cotton Sanitary Pads',
  imageGallery,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [variant, setVariant] = useState<ProductVariantKey>('XL');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Synthetic stable id based on image src.
  const localId = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < imageSrc.length; i++) hash = (hash * 31 + imageSrc.charCodeAt(i)) >>> 0;
    return (hash % 1_000_000_000) + 10_000_000;
  }, [imageSrc]);

  const galleryImages = (imageGallery && imageGallery.length > 0 ? imageGallery : [imageSrc]).filter(Boolean);
  const primaryImage = galleryImages[0];


  const productForWishlist = useMemo(
    () => ({
      id: localId,
      name: productName,
      price: 0,
      primary_image: primaryImage,
      slug: `local-${localId}`,
    }),
    [localId, primaryImage, productName]
  );

  const active = isInWishlist(productForWishlist.id);
  const variantMeta = VARIANTS[variant];

  const handleAddToCart = async () => {
    await addToCart(localId, productName, 0, primaryImage, variant, 1, productForWishlist.slug);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        className="bg-white rounded-3xl border border-rose-100/70 p-4 transition-all shadow-md hover:shadow-xl group relative h-full"
      >
        {/* Premium badge */}
        <div className="absolute top-5 left-5 z-10">
          <div className="inline-flex items-center gap-2 bg-[#FF7A00]/10 text-[#FF7A00] px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> 100% Organic
          </div>
        </div>

        {/* Wishlist */}
        <div className="absolute top-5 right-5 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(productForWishlist);
            }}
            className="p-2.5 rounded-full glass cursor-pointer shadow-premium hover:shadow-[#FF7A00]/10 hover:border-[#FF7A00]/30 transition-all"
            title={active ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                active ? 'fill-[#FF7A00] text-[#FF7A00]' : 'text-slate-400 hover:text-[#FF7A00]'
              }`}
            />
          </motion.button>
        </div>

        {/* Image + View Details overlay */}
        <div className="relative w-full aspect-square rounded-2xl bg-[#FFF8F2]/60 overflow-hidden border border-slate-100 shadow-sm">
          <img
            src={primaryImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-white/95 text-[#FF7A00] rounded-full py-2 text-[10px] font-extrabold uppercase tracking-wider shadow-premium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </button>
        </div>

        {/* Body */}
        <div className="pt-4 flex flex-col h-full">
          <div className="space-y-2">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">{productTypeBadge}</span>

            <h3 className="font-serif font-bold text-slate-800 text-sm leading-tight line-clamp-2">{productName}</h3>

            <p className="text-slate-500 text-xs font-light leading-normal line-clamp-2">{shortDescription}</p>

            {/* Variant + Required data */}
            <div className="pt-2 space-y-2">
              <div className="flex flex-wrap gap-2.5">
                {(['XL', 'XXL', 'XXXL'] as ProductVariantKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setVariant(k)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      variant === k
                        ? 'border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00] shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-bold">Size</div>
                  <div className="text-[10px] text-[#FF7A00] font-extrabold">{variant}</div>
                </div>
                <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-bold">Length</div>
                  <div className="text-[10px] text-slate-700 font-extrabold">{variantMeta.length}</div>
                </div>
                <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-2 text-center">
                  <div className="text-[10px] text-slate-500 font-bold">Pads/Box</div>
                  <div className="text-[10px] text-slate-700 font-extrabold">{variantMeta.quantity}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-t border-rose-50/50 pt-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pieces per Box</span>
                <span className="text-slate-800 font-serif font-black text-base">{variantMeta.quantity}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pad Length</span>
                <span className="text-slate-800 font-serif font-black text-base">{variantMeta.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="flex-1 py-3.5 rounded-full bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-premium"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="p-3.5 rounded-full border border-slate-200 hover:border-[#FF7A00]/30 bg-white hover:bg-[#FFF8F2] text-slate-600 cursor-pointer transition-all shadow-premium"
                title="View Details"
              >
                <Eye className="w-5 h-5 text-[#FF7A00]" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Local modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setLightboxOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-premium-lg border border-slate-100/50 overflow-hidden"
              initial={{ y: 18, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 18, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[11px] text-[#FF7A00] font-extrabold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 100% Organic
                  </div>
                  <div className="font-serif font-bold text-slate-800">{productName}</div>
                </div>

                <button
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-50 cursor-pointer transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5">
                <div className="md:col-span-7 space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-[#FFF8F2] border border-slate-100">
                    <img src={primaryImage} alt={productName} className="w-full h-[340px] object-cover" />
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {galleryImages.slice(1).map((src, idx) => (
                        <div key={src + idx} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-[#FFF8F2]">
                          <img src={src} alt={`${productName} thumbnail ${idx + 2}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-2">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Short Description</div>
                    <p className="text-slate-600 text-sm font-light leading-relaxed">{shortDescription}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Selected Variant</div>
                    <div className="flex flex-wrap gap-2.5">
                      {(['XL', 'XXL', 'XXXL'] as ProductVariantKey[]).map((k) => (
                        <button
                          key={k}
                          onClick={() => setVariant(k)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            variant === k
                              ? 'border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00] shadow-sm'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-3">
                        <div className="text-[10px] text-slate-500 font-bold">Size</div>
                        <div className="text-[12px] text-[#FF7A00] font-extrabold">{variant}</div>
                      </div>
                      <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-3">
                        <div className="text-[10px] text-slate-500 font-bold">Pad Length</div>
                        <div className="text-[12px] text-slate-700 font-extrabold">{variantMeta.length}</div>
                      </div>
                      <div className="bg-[#FFF8F2] rounded-2xl border border-slate-100 p-3 sm:col-span-2">
                        <div className="text-[10px] text-slate-500 font-bold">Pieces per Box</div>
                        <div className="text-[12px] text-slate-700 font-extrabold">{variantMeta.quantity} Pads</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart();
                      setLightboxOpen(false);
                    }}
                    className="w-full py-3.5 rounded-full bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-premium"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumLocalProductCard;

