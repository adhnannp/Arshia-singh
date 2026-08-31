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
  updateQuantity: () => {},
  clearCart: () => {},
  revalidateCartItems: async () => {}
};

const CartContext = createContext(defaultCart);

// Helper to accurately compare whether two cart items represent the exact same product variant & options
const isSameCartItem = (itemA, itemB) => {
  if (!itemA || !itemB) return false;

  // 1. If both items have a Shopify variantId, match strictly by variantId
  if (itemA.variantId && itemB.variantId) {
    return String(itemA.variantId).trim() === String(itemB.variantId).trim();
  }

  // 2. Compare size (e.g. 'XS', 'S', 'M')
  const sizeA = String(itemA.size || '').trim().toUpperCase();
  const sizeB = String(itemB.size || '').trim().toUpperCase();
  if (sizeA !== sizeB) return false;

  // 3. Compare name (includes formatted option label, e.g. "Blazer Only" vs "Complete 3-Piece")
  const nameA = String(itemA.name || '').trim().toLowerCase();
  const nameB = String(itemB.name || '').trim().toLowerCase();
  if (nameA !== nameB) return false;

  // 4. Compare handle if present
  const handleA = String(itemA.handle || '').trim().toLowerCase();
  const handleB = String(itemB.handle || '').trim().toLowerCase();
  if (handleA && handleB && handleA !== handleB) return false;

  // 5. Compare dynamic selected options if present
  if (itemA.selectedOptions && itemB.selectedOptions) {
    const entriesA = Object.entries(itemA.selectedOptions);
    for (const [k, v] of entriesA) {
      if (k.toLowerCase() === 'size') continue;
      if (String(itemB.selectedOptions[k] || '').trim().toLowerCase() !== String(v || '').trim().toLowerCase()) {
        return false;
      }
    }
  }

  return true;
};

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

      // If guest cart has items when user logs in: merge guest items into user cart
      if (guestItems.length > 0) {
        const merged = [...userItems];
        guestItems.forEach((gItem) => {
          const existingIndex = merged.findIndex((uItem) => isSameCartItem(uItem, gItem));

          if (existingIndex > -1) {
            const uQty = typeof merged[existingIndex].quantity === 'number' ? merged[existingIndex].quantity : 1;
            const gQty = typeof gItem.quantity === 'number' ? gItem.quantity : 1;
            merged[existingIndex] = {
              ...merged[existingIndex],
              quantity: uQty + gQty
            };
          } else {
            merged.push({
              ...gItem,
              quantity: typeof gItem.quantity === 'number' ? gItem.quantity : 1
            });
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
   * If exact same product option variant and size already exists, increments quantity.
   * If different option or different size, adds as a separate cart item.
   * Validates available inventory count for that specific option/variant.
   */
  const addToCart = (itemOrName, size, price, img, extra = {}) => {
    let itemData;
    if (typeof itemOrName === 'object' && itemOrName !== null) {
      itemData = { ...itemOrName };
    } else {
      itemData = {
        name: itemOrName,
        size,
        price,
        img,
        ...extra
      };
    }

    const quantityToAdd = typeof itemData.quantity === 'number' && itemData.quantity > 0
      ? itemData.quantity
      : 1;

    // Check if exact same product variant/options with same size already exists in cart
    const existingIndex = cartItems.findIndex((cItem) => isSameCartItem(cItem, itemData));

    const currentQty = existingIndex > -1
      ? (typeof cartItems[existingIndex].quantity === 'number' ? cartItems[existingIndex].quantity : 1)
      : 0;

    const newTargetQty = currentQty + quantityToAdd;
    const maxAvailable = typeof itemData.quantityAvailable === 'number'
      ? itemData.quantityAvailable
      : (existingIndex > -1 && typeof cartItems[existingIndex].quantityAvailable === 'number'
          ? cartItems[existingIndex].quantityAvailable
          : null);

    // If maxAvailable inventory is tracked and requested quantity exceeds it
    if (maxAvailable !== null && maxAvailable >= 0 && newTargetQty > maxAvailable) {
      return {
        success: false,
        error: `Only ${maxAvailable} item(s) available in stock for size ${itemData.size || 'selected'}. You already have ${currentQty} in your collection.`,
        currentQty,
        maxAvailable
      };
    }

    let newItems;
    if (existingIndex > -1) {
      newItems = cartItems.map((cItem, idx) => {
        if (idx === existingIndex) {
          return {
            ...cItem,
            ...itemData,
            quantity: newTargetQty,
            quantityAvailable: maxAvailable,
            stockNotice: null,
            isUnavailable: false
          };
        }
        return cItem;
      });
    } else {
      const newItem = {
        id: `${Date.now()}_${Math.random()}`,
        isUnavailable: false,
        ...itemData,
        quantity: quantityToAdd,
        quantityAvailable: maxAvailable,
        stockNotice: null
      };
      newItems = [...cartItems, newItem];
    }

    saveCart(newItems);
    setIsCartOpen(true);
    return { success: true, quantity: newTargetQty, maxAvailable };
  };

  const updateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    const newItems = cartItems.map((item, idx) => {
      if (idx === index) {
        const maxAvail = typeof item.quantityAvailable === 'number' ? item.quantityAvailable : null;
        const boundedQty = maxAvail !== null ? Math.min(newQty, maxAvail) : newQty;
        return { ...item, quantity: boundedQty };
      }
      return item;
    });
    saveCart(newItems);
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
   * and automatically adjust quantities if live inventory has changed (e.g. 5 down to 4).
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

            // Find exact variant by variantId or match by selected options + size
            if (product.variants?.nodes?.length > 0) {
              let sizeVariant = null;

              if (item.variantId) {
                sizeVariant = product.variants.nodes.find((v) => v.id === item.variantId);
              }

              if (!sizeVariant && item.size) {
                const sizeStr = item.size.toUpperCase();
                sizeVariant = product.variants.nodes.find((v) =>
                  v.selectedOptions?.some(
                    (opt) => opt.name?.toLowerCase() === 'size' && opt.value?.toUpperCase() === sizeStr
                  )
                );
              }

              if (sizeVariant) {
                const isOutOfStock = sizeVariant.availableForSale === false || sizeVariant.quantityAvailable === 0;
                if (isOutOfStock) {
                  return {
                    ...item,
                    variantId: sizeVariant.id,
                    isUnavailable: true,
                    outOfStock: true,
                    quantityAvailable: 0
                  };
                }

                let currentQty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
                let stockNotice = item.stockNotice || null;

                // If live Shopify inventory is less than what user had in cart, adjust quantity
                if (typeof sizeVariant.quantityAvailable === 'number' && sizeVariant.quantityAvailable > 0) {
                  if (currentQty > sizeVariant.quantityAvailable) {
                    stockNotice = `Only ${sizeVariant.quantityAvailable} left in stock. Quantity was adjusted from ${currentQty} to ${sizeVariant.quantityAvailable}.`;
                    currentQty = sizeVariant.quantityAvailable;
                  } else if (currentQty === sizeVariant.quantityAvailable && item.stockNotice) {
                    // Retain stock notice so user remains informed
                    stockNotice = item.stockNotice;
                  } else if (currentQty < sizeVariant.quantityAvailable) {
                    stockNotice = null;
                  }
                }

                return {
                  ...item,
                  variantId: sizeVariant.id,
                  quantity: currentQty,
                  quantityAvailable: sizeVariant.quantityAvailable ?? null,
                  stockNotice: stockNotice,
                  isUnavailable: false
                };
              }
            }

            return { ...item, isUnavailable: false };
          } catch (e) {
            console.warn(`[Cart revalidation] Error checking item ${item.name}:`, e);
            return item;
          }
        })
      );

      // Check if any status, quantity, or stock notice changed
      const statusChanged = validatedItems.some((valItem, idx) => {
        const orig = cartItems[idx];
        return (
          valItem.isUnavailable !== orig?.isUnavailable ||
          valItem.quantity !== orig?.quantity ||
          valItem.stockNotice !== orig?.stockNotice
        );
      });

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
        updateQuantity,
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
