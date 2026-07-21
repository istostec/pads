import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  couponCode: string;
  shippingFee: number;
  total: number;
  addToCart: (productId: number, productName: string, price: number, image: string | null, size: string, quantity?: number, slug?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); // mock coupon: percentage
  const [discountFixed, setDiscountFixed] = useState(0); // mock coupon: fixed discount


  // Load cart from server or localstorage
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const response = await api.get('/cart');
          setCartItems(response.data.items || []);
        } catch (error) {
          console.error('API cart load failed', error);
          setCartItems([]);
        }

      } else {
        loadFromLocal();
      }
    };

    const loadFromLocal = () => {
      const local = localStorage.getItem('lumina_cart');
      if (local) {
        setCartItems(JSON.parse(local));
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [user]);

  // Persist local cart if not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('lumina_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (
    productId: number,
    productName: string,
    price: number,
    image: string | null,
    size: string,
    quantity: number = 1,
    slug: string = ''
  ) => {
    if (user) {
      try {
        const response = await api.post('/cart/items', { product_id: productId, quantity, size });
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('API error adding to cart', error);
      }

    } else {
      addToLocal(productId, productName, price, image, size, quantity, slug);
    }
  };

  const addToLocal = (
    productId: number,
    productName: string,
    price: number,
    image: string | null,
    size: string,
    quantity: number = 1,
    slug: string = ''
  ) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.product_id === productId && item.size === size
      );
      if (existingIdx > -1) {
        const copy = [...prevItems];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prevItems,
        {
          id: Date.now() + Math.floor(Math.random() * 1000), // temp id
          product_id: productId,
          product_name: productName,
          product_slug: slug || productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          product_price: price,
          product_image: image,
          quantity,
          size,
        },
      ];
    });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (user) {
      try {
        const response = await api.put(`/cart/items/${itemId}`, { quantity });
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('API error modifying cart', error);
      }

    } else {
      updateLocalQty(itemId, quantity);
    }
  };

  const updateLocalQty = (itemId: number, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((i) => i.id !== itemId);
      }
      return prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    });
  };

  const removeFromCart = async (itemId: number) => {
    if (user) {
      try {
        const response = await api.delete(`/cart/items/${itemId}`);
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error('API error removing from cart', error);
      }

    } else {
      removeLocal(itemId);
    }
  };

  const removeLocal = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    
    // In real app, we query coupons table via API.
    // We implement both API verify and high fidelity client-side fallback check:
    try {
      // For mock checkout ease, we check client codes:
      if (cleanCode === 'WELCOME10') {
        setCouponCode(cleanCode);
        setDiscountPercent(10);
        setDiscountFixed(0);
        return true;
      } else if (cleanCode === 'LUMINA50') {
        setCouponCode(cleanCode);
        setDiscountPercent(0);
        setDiscountFixed(50);
        return true;
      }
      
      const response = await api.post('/orders/coupons/validate', { code: cleanCode }); // or similar endpoint
      if (response.data?.valid) {
        setCouponCode(cleanCode);
        if (response.data.discount_type === 'Percentage') {
          setDiscountPercent(response.data.discount_value);
        } else {
          setDiscountFixed(response.data.discount_value);
        }
        return true;
      }
    } catch (e) {
      // Offline fallback:
      if (cleanCode === 'WELCOME10' || cleanCode === 'LUMINA10') {
        setCouponCode(cleanCode);
        setDiscountPercent(10);
        setDiscountFixed(0);
        return true;
      }
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountFixed(0);
  };

  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
    localStorage.removeItem('lumina_cart');
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.product_price * curr.quantity, 0);
  
  const discount = discountPercent > 0 
    ? Math.round(subtotal * (discountPercent / 100) * 100) / 100 
    : discountFixed;
    
  const shippingFee = subtotal > 0 && subtotal < 499 ? 49 : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        discount,
        couponCode,
        shippingFee,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
