'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchProductByHandle } from '../lib/shopify/queries/products';

const defaultCart = {
  cartItems: [],
  isCartOpen: false,
  isValidatingCart: false,
  setIsCartOpen: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  revalidateCartItems: async () => {}
};

const CartContext = createContext(defaultCart);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidatingCart, setIsValidatingCart] = useState(false);
  const { user } = useAuth();

  // ─── Load initial cart (guest or customer) & handle guest-to-user cart migration on login ───
  useEffect(() => {
    const guestCartRaw = localStorage.getItem('as_cart_items');
    let guestItems = [];
    if (guestCartRaw) {
      try {
        guestItems = JSON.parse(guestCartRaw) || [];
      } catch (e) {
        console.error('[CartContext] Error parsing guest cart:', e);
      }
    }

    if (user) {
      const userCartKey = `as_user_cart_${user.email || user.id || 'member'}`;
      const userCartRaw = localStorage.getItem(userCartKey);
      let userItems = [];
      if (userCartRaw) {
        try {
          userItems = JSON.parse(userCartRaw) || [];
        } catch (e) {
          console.error('[CartContext] Error parsing user cart:', e);
        }
      }

      // If guest cart has items when user logs in: merge guest items into user cart & clear guest cart
      if (guestItems.length > 0) {
        const merged = [...userItems];
        guestItems.forEach((gItem) => {
          const exists = merged.some((uItem) =>
            (gItem.variantId && uItem.variantId === gItem.variantId) ||
            (uItem.name === gItem.name && uItem.size === gItem.size)
          );
          if (!exists) {
            merged.push(gItem);
          }
        });
        setCartItems(merged);
        localStorage.setItem(userCartKey, JSON.stringify(merged));
        localStorage.removeItem('as_cart_items');
      } else {
        setCartItems(userItems);
      }
    } else {
      setCartItems(guestItems);
    }
  }, [user]);

  const saveCart = useCallback((items) => {
    setCartItems(items);
    if (user) {
      const userCartKey = `as_user_cart_${user.email || user.id || 'member'}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    } else {
      localStorage.setItem('as_cart_items', JSON.stringify(items));
    }
  }, [user]);

  /**
   * Add to cart function - Guests & Logged-in users can add freely!
   * Accepts either an object (itemData) or individual args: (name, size, price, img, extraProps)
   */
  const addToCart = (itemOrName, size, price, img, extra = {}) => {
    let newItem;
    if (typeof itemOrName === 'object' && itemOrName !== null) {
      newItem = {
        id: `${Date.now()}_${Math.random()}`,
        isUnavailable: false,
        ...itemOrName
      };
    } else {
      newItem = {
        id: `${Date.now()}_${Math.random()}`,
        name: itemOrName,
        size,
        price,
        img,
        isUnavailable: false,
        ...extra
      };
    }
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

  /**
   * Revalidate all cart items against Shopify to check for unavailable/unlisted products
   */
  const revalidateCartItems = useCallback(async () => {
    if (cartItems.length === 0) return;
    setIsValidatingCart(true);

    try {
      const validatedItems = await Promise.all(
        cartItems.map(async (item) => {
          if (!item.handle) return item;

          try {
            const product = await fetchProductByHandle(item.handle);
            if (!product) {
              // Product no longer exists or unlisted in Shopify
              return { ...item, isUnavailable: true, unlisted: true };
            }

            if (product.availableForSale === false) {
              return { ...item, isUnavailable: true, outOfStock: true };
            }

            // Check variant availability for the selected size if variants exist
            if (item.size && product.variants?.nodes?.length > 0) {
              const sizeStr = item.size.toUpperCase();
              const sizeVariant = product.variants.nodes.find((v) =>
                v.selectedOptions?.some(
                  (opt) => opt.name?.toLowerCase() === 'size' && opt.value?.toUpperCase() === sizeStr
                )
              );
              if (sizeVariant && sizeVariant.availableForSale === false) {
                return { ...item, isUnavailable: true, outOfStock: true };
              } else if (sizeVariant) {
                return { ...item, variantId: sizeVariant.id, isUnavailable: false };
              }
            }

            return { ...item, isUnavailable: false };
          } catch (e) {
            console.warn(`[Cart revalidation] Error checking item ${item.name}:`, e);
            return item;
          }
        })
      );

      // Check if any status changed before updating to avoid unnecessary renders
      const statusChanged = validatedItems.some(
        (valItem, idx) => valItem.isUnavailable !== cartItems[idx]?.isUnavailable
      );

      if (statusChanged) {
        saveCart(validatedItems);
      }
    } catch (err) {
      console.error('[CartContext] Error revalidating cart items:', err);
    } finally {
      setIsValidatingCart(false);
    }
  }, [cartItems, saveCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        isValidatingCart,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        revalidateCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  return context || defaultCart;
}
