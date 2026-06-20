'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import gsap from 'gsap';

const WOMEN_LINKS = [
  { label: 'Matching Moods', href: '/collections/matching-moods', img: '/assets/new_coll_2.png' },
  { label: 'Flow State', href: '/collections/flow-state', img: '/assets/new_coll_5.JPG' },
  { label: 'Power Layers', href: '/collections/power-layers', img: '/assets/new_coll_3.png' },
  { label: 'Six Yards of Good', href: '/collections/six-yards-of-good', img: '/assets/new_coll_1.jpg' },
  { label: 'Custom Made for Moments', href: '/collections/custom-made-for-moments', img: '/assets/new_coll_6.jpg' },
];

const MEN_LINKS = [
  { label: 'Natural Luxury', href: '/collections/natural-luxury', img: '/assets/new_coll_6.jpg' },
  { label: 'Printed Stories', href: '/collections/printed-stories', img: '/assets/new_coll_7.jpg' },
  { label: 'Modern Classics', href: '/collections/modern-classics', img: '/assets/new_coll_3.png' },
];

const CONNECT_LINKS = [
  { label: 'Our Story', href: '/story', external: false },
  { label: 'Inquiries', href: '/inquiries', external: false },
  { label: 'Instagram', href: 'https://www.instagram.com/arshia.singh.official?igsh=bWN5cXd1M2txNmsx', external: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { cartItems, setIsCartOpen } = useCart();
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
        <div className="nav-right">
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

            {/* Karigar of AS */}
            <div className="nav-section karigar-section">
              <span className="nav-section-title karigar-title">
                <Link href="/karigar-of-as" onClick={closeMenu}>Karigar of AS</Link>
              </span>
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
