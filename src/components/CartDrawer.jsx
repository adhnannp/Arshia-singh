'use client';

import { useCart } from './CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return acc + priceNum;
  }, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const itemsPayload = encodeURIComponent(JSON.stringify(cartItems));
    window.location.href = `https://arshia-singh-website.myshopify.com/cart?checkout=true&items=${itemsPayload}`;
  };

  return (
    <>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Your Drawer</h3>
          <button className="cart-drawer-close" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty-msg">Your collection is empty.</div>
          ) : (
            cartItems.map((item, index) => {
              const priceStr = item.price.replace('/-', '').replace('₹', '').trim();
              return (
                <div className="cart-item" key={index}>
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-meta">Size: {item.size}</div>
                    </div>
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₹{priceStr}</span>
                      <button className="cart-item-remove" onClick={() => removeFromCart(index)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-drawer-footer">
          <div className="cart-total">Total: <span className="cart-total-price">₹{total.toLocaleString('en-IN')}</span></div>
          <button className="cart-checkout-btn" onClick={handleCheckout}>Book Entire Order</button>
        </div>
      </div>
      <div className={`cart-overlay-bg ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
    </>
  );
}
