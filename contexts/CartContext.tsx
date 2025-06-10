import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const cartData = await SecureStore.getItemAsync('cart');
      const wishlistData = await SecureStore.getItemAsync('wishlist');
      
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
      if (wishlistData) {
        setWishlist(JSON.parse(wishlistData));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const storeCart = async (cartItems: CartItem[]) => {
    try {
      await SecureStore.setItemAsync('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    } catch (error) {
      console.error('Error storing cart:', error);
    }
  };

  const storeWishlist = async (wishlistItems: Product[]) => {
    try {
      await SecureStore.setItemAsync('wishlist', JSON.stringify(wishlistItems));
      setWishlist(wishlistItems);
    } catch (error) {
      console.error('Error storing wishlist:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      storeCart(newCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    storeCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    storeCart(newCart);
  };

  const clearCart = () => {
    storeCart([]);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      const newWishlist = [...wishlist, product];
      storeWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    storeWishlist(newWishlist);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getTotalPrice,
      getTotalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}