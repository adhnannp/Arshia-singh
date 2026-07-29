'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const defaultCart = {
  cartItems: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {}
};

const CartContext = createContext(defaultCart);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load initial cart (guest or customer) and handle guest-to-user cart migration on login
  useEffect(() => {
    const guestCartRaw = localStorage.getItem('as_cart_items');
    let guestItems = [];
    if (guestCartRaw) {
      try {
        guestItems = JSON.parse(guestCartRaw) || [];
      } catch (e) {
        console.error(e);
      }
    }

    if (user) {
      const userCartKey = `as_user_cart_${user.email || user.id || 'member'}`;
      const userCartRaw = localStorage.getItem(userCartKey);
      let userItems = [];
      if (userCartRaw) {
        try {
          userItems = JSON.parse(userCartRaw) || [];
        } catch (e) {}
      }

      // If guest cart has items when user logs in, merge guest items into user cart & clear guest cart
      if (guestItems.length > 0) {
        const mergedItems = [...userItems, ...guestItems];
        setCartItems(mergedItems);
        localStorage.setItem(userCartKey, JSON.stringify(mergedItems));
        localStorage.removeItem('as_cart_items');
      } else {
        setCartItems(userItems);
      }
    } else {
      setCartItems(guestItems);
    }
  }, [user]);

  const saveCart = (items) => {
    setCartItems(items);
    if (user) {
      const userCartKey = `as_user_cart_${user.email || user.id || 'member'}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    } else {
      localStorage.setItem('as_cart_items', JSON.stringify(items));
    }
  };

  /**
   * Add to cart function - Guests can add freely!
   */
  const addToCart = (name, size, price, img) => {
    const newItem = { id: `${Date.now()}_${Math.random()}`, name, size, price, img };
    const newItems = [...cartItems, newItem];
    saveCart(newItems);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  return context || defaultCart;
}
