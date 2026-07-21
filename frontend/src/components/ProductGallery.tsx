import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';
import { getSafeImageSrc } from '../utils/imageSrc';

import { fadeInUp, pageTransition, staggerContainer } from '../animations/framer-variants';
import ImageLightbox from './ImageLightbox';

type GalleryProduct = {
  id: number;
  name: string;
  primary_image: string | null;
  images?: Array<{ image_url: string }>;
};

export const ProductGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        setItems(res.data || []);
      } catch (e) {
        console.error('Failed to load gallery', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const galleryImages = useMemo(() => {
    const imgs: string[] = [];
    for (const p of items) {
      if (p.primary_image) imgs.push(normalizeImageUrl(p.primary_image));
      if (p.images?.length) {
        for (const im of p.images) {
            if (im?.image_url) imgs.push(normalizeImageUrl(im.image_url));
        }
      }
    }
    // de-dupe while preserving order
    return Array.from(new Set(imgs));
  }, [items]);

  const openAt = (index: number) => {
    setLightboxImages(galleryImages);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <motion.div variants={pageTransition} initial="initial" animate="animate" className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-100/60 text-rose-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <ImageIcon className="w-4 h-4" /> Premium Gallery
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800">Explore Comfort in Every Frame</h2>
        <p className="text-slate-400 text-sm sm:text-base font-light max-w-2xl mx-auto">
          Click any image to preview. Smooth loading and a premium lightbox experience.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {galleryImages.map((src, idx) => (
            <motion.button
              key={src + idx}
              variants={fadeInUp}
              custom={idx}
              onClick={() => openAt(idx)}
              className="relative group overflow-hidden rounded-2xl border border-slate-100 bg-white"
            >
              <img
                src={getSafeImageSrc(src)}
                onError={(e) => {
                  const el = e.currentTarget;
                  el.src = getSafeImageSrc('');
                }}
                alt={`Gallery image ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white/90 text-[10px] font-bold uppercase tracking-wider">Preview</span>
                <span className="text-white/90 text-[10px]">{idx + 1}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </section>
  );
};

export default ProductGallery;

