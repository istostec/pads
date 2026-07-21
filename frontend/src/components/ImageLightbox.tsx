import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type ImageLightboxProps = {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onChangeIndex?: (nextIndex: number) => void;
};

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
}) => {
  const safeIndex = Math.max(0, Math.min(activeIndex, images.length - 1));
  const active = images[safeIndex];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!onChangeIndex) return;
      if (e.key === 'ArrowLeft') onChangeIndex(Math.max(0, safeIndex - 1));
      if (e.key === 'ArrowRight') onChangeIndex(Math.min(images.length - 1, safeIndex + 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, onClose, onChangeIndex, safeIndex]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-[70] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black">
          <img
            src={active}
            alt="Preview"
            className="w-full h-auto max-h-[80vh] object-contain"
            loading="eager"
            decoding="async"
          />

          {images.length > 1 && onChangeIndex && (
            <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-center gap-2">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => onChangeIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === safeIndex ? 'bg-rose-500 scale-125' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Preview ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;

