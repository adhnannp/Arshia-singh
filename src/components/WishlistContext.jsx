'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const defaultWishlist = {
  wishlistItems: [],
  isInWishlist: () => false,
  toggleWishlist: () => {},
  moveToCart: () => {}
};

const WishlistContext = createContext(defaultWishlist);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem('as_wishlist_items');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlistItems(items);
    localStorage.setItem('as_wishlist_items', JSON.stringify(items));
  };

  const isInWishlist = (name) => {
    return wishlistItems.some((item) => item.name === name);
  };

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product.name);
    let newItems;
    if (exists) {
      newItems = wishlistItems.filter((item) => item.name !== product.name);
    } else {
      newItems = [...wishlistItems, { name: product.name, price: product.price, img: product.img }];
    }
    saveWishlist(newItems);
  };

  const moveToCart = (product) => {
    // Add to cart with default size (e.g., 'M')
    addToCart(product.name, 'M', product.price, product.img);
    // Remove from wishlist
    const newItems = wishlistItems.filter((item) => item.name !== product.name);
    saveWishlist(newItems);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  return context || defaultWishlist;
}
