'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { createShopifyCheckout } from '../lib/shopify/mutations/cart';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, revalidateCartItems, isValidatingCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutNotice, setCheckoutNotice] = useState(null);

  // Trigger inventory re-validation whenever cart drawer is opened
  useEffect(() => {
    if (isCartOpen) {
      setCheckoutError(null);
      setCheckoutNotice(null);
      revalidateCartItems();
    }
  }, [isCartOpen, revalidateCartItems]);

  const hasUnavailableItems = cartItems.some((item) => item.isUnavailable || item.availableForSale === false);

  const total = cartItems.reduce((acc, item) => {
    // Only sum price for available items or all items in display
    if (item.isUnavailable || item.availableForSale === false) return acc;
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return acc + priceNum;
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || checkoutLoading) return;

    setCheckoutError(null);
    setCheckoutNotice(null);

    // Filter available vs unavailable products
    const availableItems = cartItems.filter((item) => !item.isUnavailable && item.availableForSale !== false);
    const unavailableItems = cartItems.filter((item) => item.isUnavailable || item.availableForSale === false);

    if (availableItems.length === 0) {
      setCheckoutError('⚠️ All products in your cart are currently unavailable or out of stock.');
      return;
    }

    if (unavailableItems.length > 0) {
      setCheckoutNotice(
        `⚠️ ${unavailableItems.length} item(s) in your cart are unavailable and were excluded from checkout.`
      );
    }

    setCheckoutLoading(true);

    try {
      const { checkoutUrl, error } = await createShopifyCheckout(availableItems);

      if (error) {
        setCheckoutError(`Checkout error: ${error}`);
        setCheckoutLoading(false);
        return;
      }

      if (checkoutUrl) {
        // Redirect customer directly to Shopify Web Checkout
        window.location.href = checkoutUrl;
      } else {
        setCheckoutError('Could not generate Shopify checkout URL. Please try again.');
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error('[CartDrawer Checkout] Exception during checkout:', err);
      setCheckoutError('An unexpected error occurred. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Your Collection</h3>
          <button className="cart-drawer-close" onClick={() => setIsCartOpen(false)}>
            &times;
          </button>
        </div>

        {/* Global Unavailable Warning Notice */}
        {hasUnavailableItems && (
          <div className="cart-drawer-notice warning">
            <span>⚠️ Note: Some items in your collection are currently unavailable or out of stock. Unavailable items will be excluded at checkout.</span>
          </div>
        )}

        {checkoutNotice && (
          <div className="cart-drawer-notice info">
            <span>{checkoutNotice}</span>
          </div>
        )}

        {checkoutError && (
          <div className="cart-drawer-notice error">
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty-msg">Your collection is empty.</div>
          ) : (
            cartItems.map((item, index) => {
              const isItemUnavailable = item.isUnavailable || item.availableForSale === false;
              const priceStr = item.price.replace('/-', '').replace('₹', '').trim();

              return (
                <div className={`cart-item ${isItemUnavailable ? 'unavailable' : ''}`} key={item.id || index}>
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="cart-item-name">{item.name}</h4>
                        {isItemUnavailable && (
                          <span className="cart-item-badge unavailable">
                            {item.unlisted ? 'UNLISTED' : 'OUT OF STOCK'}
                          </span>
                        )}
                      </div>
                      <div className="cart-item-meta">Size: {item.size}</div>
                    </div>
                    <div className="cart-item-price-row">
                      <span className={`cart-item-price ${isItemUnavailable ? 'line-through opacity-50' : ''}`}>
                        ₹{priceStr}
                      </span>
                      <button className="cart-item-remove" onClick={() => removeFromCart(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-total">
            Total: <span className="cart-total-price">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button
            className={`cart-checkout-btn ${checkoutLoading ? 'loading' : ''}`}
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || checkoutLoading}
          >
            {checkoutLoading ? 'Redirecting to Shopify...' : 'Book Entire Order'}
          </button>
        </div>
      </div>
      <div className={`cart-overlay-bg ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
    </>
  );
}
