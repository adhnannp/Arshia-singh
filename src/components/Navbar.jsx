'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useWishlist } from './WishlistContext';
import gsap from 'gsap';

const WOMEN_LINKS = [
  { label: 'Matching Moods', href: '/collections/matching-moods', img: '/assets/new_coll_2.png' },
  { label: 'Flow State', href: '/collections/flow-state', img: '/assets/new_coll_5.JPG' },
  { label: 'Power Layers', href: '/collections/power-layers', img: '/assets/new_coll_3.png' },
  { label: 'Six Yards of Good', href: '/collections/six-yards-of-good', img: '/assets/new_coll_1.jpg' },
];

const MEN_LINKS = [
  { label: 'Natural Luxury', href: '/collections/natural-luxury', img: '/assets/new_coll_6.jpg' },
  { label: 'Printed Stories', href: '/collections/printed-stories', img: '/assets/new_coll_7.jpg' },
  { label: 'Modern Classics', href: '/collections/modern-classics', img: '/assets/new_coll_3.png' },
];

const CONNECT_LINKS = [
  { label: 'Our Story', href: '/story', external: false },
  { label: 'Get in touch', href: '/inquiries', external: false },
  { label: 'Instagram', href: 'https://www.instagram.com/arshia.singh.official?igsh=bWN5cXd1M2txNmsx', external: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { cartItems, setIsCartOpen } = useCart();
  const { user, logout, requireAuth } = useAuth();
  const { wishlistItems, moveToCart, toggleWishlist } = useWishlist();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const overlayRef = useRef(null);

  // Live clock
  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (!overlayRef.current) return;
    if (menuOpen) {
      gsap.set('.nav-section-title, .nav-section-links li a, .connect-links li a', { opacity: 0, y: 30 });
      gsap.to('.nav-section-title', { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay: 0.25 });
      gsap.to('.nav-section-links li a, .connect-links li a', { y: 0, opacity: 1, duration: 1.0, stagger: 0.02, ease: 'power4.out', delay: 0.35 });
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="logo">
            <img src="/assets/logo2.png" alt="Arshia Singh Logo" className="brand-logo" />
          </Link>
        </div>
        <div className="nav-links">
          <Link href="/story" className="nav-link-item">Our Story</Link>
          <Link href="/blog" className="nav-link-item">Blog</Link>
        </div>
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* PROFILE BUTTON & POPUP */}
          <div className="profile-container">
            <button
              className="profile-toggle"
              onClick={() => {
                if (user) {
                  setProfileDropdownOpen(!profileDropdownOpen);
                } else {
                  requireAuth(() => {});
                }
              }}
              aria-label="Profile"
            >
              {user ? (
                <img src={user.avatar} alt={user.name} className="nav-profile-avatar" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="profile-icon-svg" style={{ display: 'block' }}>
                  <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            
            {user && profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{user.name}</span>
                    <span className="dropdown-user-email">{user.email}</span>
                  </div>
                </div>
                
                <div className="profile-dropdown-wishlist">
                  <span className="wishlist-header">Wishlist ({wishlistItems.length})</span>
                  {wishlistItems.length === 0 ? (
                    <p className="wishlist-empty-text">Your wishlist is empty</p>
                  ) : (
                    <ul className="dropdown-wishlist-list">
                      {wishlistItems.map((item) => (
                        <li key={item.name} className="dropdown-wishlist-item">
                          <img src={item.img} alt={item.name} className="wishlist-item-img" />
                          <div className="wishlist-item-details">
                            <span className="wishlist-item-name">{item.name}</span>
                            <span className="wishlist-item-price">₹{item.price}</span>
                          </div>
                          <div className="wishlist-item-actions">
                            <button className="wishlist-item-add" onClick={() => moveToCart(item)} title="Add to Cart">
                              +
                            </button>
                            <button className="wishlist-item-remove" onClick={() => toggleWishlist(item)} title="Remove">
                              &times;
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="cart-toggle"
            onClick={() => setIsCartOpen(true)}
          >
            CART{cartItems.length > 0 && (
              <span className="cart-count-badge">{cartItems.length}</span>
            )}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open Menu">
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="menu-icon-svg">
              <path d="M1.5 2H20.5M1.5 7H20.5M1.5 12H20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* FULLSCREEN MENU OVERLAY */}
      <div ref={overlayRef} className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="menu-close-btn" onClick={closeMenu}>&times;</div>
        <div className="menu-container">
          <div className="menu-visual-showcase">
            <div className="showcase-img-wrapper">
              <img src="/assets/new_coll_3.png" alt="Editorial Showcase" id="menu-showcase-img" className="showcase-img" />
            </div>
          </div>

          <div className="menu-navigation-grid">
            {/* Women */}
            <div className="nav-section">
              <span className="nav-section-num">01</span>
              <span className="nav-section-title">Women</span>
              <ul className="nav-section-links">
                {WOMEN_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} data-img={link.img} onClick={closeMenu}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Men */}
            <div className="nav-section">
              <span className="nav-section-num">02</span>
              <span className="nav-section-title">Men</span>
              <ul className="nav-section-links">
                {MEN_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} data-img={link.img} onClick={closeMenu}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="nav-section connect-section">
              <span className="nav-section-num">03</span>
              <span className="nav-section-title">Connect</span>
              <ul className="nav-section-links connect-links">
                {CONNECT_LINKS.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} onClick={closeMenu}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ornate Buttons */}
            <div className="nav-section karigar-section karigar-section-custom">
              <span className="nav-section-title karigar-title karigar-title-custom">
                <Link href="/karigar-of-as" onClick={closeMenu}>Karigar of AS</Link>
              </span>
              <span className="nav-section-title karigar-title karigar-title-custom">
                <Link href="/collections/custom-made-for-moments" onClick={closeMenu}>Made for Moments</Link>
              </span>
              <style>{`
                .karigar-section-custom {
                  display: flex !important;
                  flex-direction: row !important;
                  justify-content: center !important;
                  align-items: center !important;
                  gap: 30px 40px !important;
                  flex-wrap: wrap !important;
                  width: 100% !important;
                  margin-top: 60px !important;
                }
                @media (min-width: 1025px) {
                  .karigar-section-custom {
                    grid-column: 1 / span 3 !important;
                  }
                }
                @media (max-width: 1024px) {
                  .karigar-section-custom {
                    grid-column: span 1 !important;
                    margin-top: 25px !important;
                  }
                }
                .karigar-title-custom {
                  display: inline-block !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                }
              `}</style>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="menu-footer-info">
            <div className="m-footer-left">ARSHIA SINGH © 2026 / CONSCIOUS LUXURY</div>
            <div className="m-footer-links">
              <Link href="/shipping-policy" onClick={closeMenu}>Shipping Policy</Link>
              <Link href="/privacy-policy" onClick={closeMenu}>Privacy Policy</Link>
              <Link href="/exchange-policy" onClick={closeMenu}>Exchange Policy</Link>
              <Link href="/returns-and-refunds" onClick={closeMenu}>Returns and Refunds</Link>
              <Link href="/terms-and-conditions" onClick={closeMenu}>Terms & Conditions</Link>
            </div>
            <div className="m-footer-right">LOCAL TIME <span className="menu-local-time">{currentTime}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
