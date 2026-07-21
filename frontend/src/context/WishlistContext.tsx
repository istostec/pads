import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_image: string | null;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: { id: number; name: string; price: number; primary_image: string | null; slug: string }) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);


  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const response = await api.get('/wishlist');
          setWishlistItems(response.data || []);
        } catch (error) {
          console.error('API wishlist load failed', error);
          setWishlistItems([]);
        }

      } else {
        loadFromLocal();
      }
    };

    const loadFromLocal = () => {
      const local = localStorage.getItem('lumina_wishlist');
      if (local) {
        setWishlistItems(JSON.parse(local));
      } else {
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('lumina_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const toggleWishlist = async (product: { id: number; name: string; price: number; primary_image: string | null; slug: string }) => {
    const isFav = isInWishlist(product.id);
    
    if (user) {
      try {
        if (isFav) {
          await api.delete(`/wishlist/${product.id}`);
          setWishlistItems(prev => prev.filter(i => i.product_id !== product.id));
        } else {
          const response = await api.post('/wishlist', { product_id: product.id });
          setWishlistItems(prev => [...prev, response.data.wishlist]);
        }
      } catch (error) {
        console.error('Wishlist API update failed', error);
      }

    } else {
      toggleLocal(product, isFav);
    }
  };

  const toggleLocal = (
    product: { id: number; name: string; price: number; primary_image: string | null; slug: string },
    isFav: boolean
  ) => {
    if (isFav) {
      setWishlistItems(prev => prev.filter(i => i.product_id !== product.id));
    } else {
      setWishlistItems(prev => [
        ...prev,
        {
          id: Date.now(),
          product_id: product.id,
          product_name: product.name,
          product_slug: product.slug,
          product_price: product.price,
          product_image: product.primary_image
        }
      ]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
