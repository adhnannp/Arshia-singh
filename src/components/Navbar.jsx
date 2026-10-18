'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useWishlist } from './WishlistContext';
import gsap from 'gsap';
import { fetchShopifyCollections } from '../lib/shopify/queries/collections';
import { fetchShopifyProducts } from '../lib/shopify/queries/products';
import '../styles/style-searchBar.css';

const CONNECT_LINKS = [
  { label: 'Discover', href: '/discover', external: false },
  { label: 'Blog', href: '/blogs', external: false },
  { label: 'Our Story', href: '/story', external: false },
  { label: 'Get in touch', href: '/inquiries', external: false },
  { label: 'Instagram', href: 'https://www.instagram.com/arshia.singh.official?igsh=bWN5cXd1M2txNmsx', external: true },
];

// Helper: Normalize Shopify product node for Navbar search
const normalizeNavProduct = (node) => {
  const rawPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const formattedPrice = rawPrice > 0
    ? `₹${Math.round(rawPrice).toLocaleString('en-IN')}`
    : 'Price on Request';

  const cleanDescription = (node.description || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: node.id,
    name: node.title,
    handle: node.handle,
    price: formattedPrice,
    img: node.featuredImage?.url || '/assets/placeholder.jpg',
    altText: node.featuredImage?.altText || node.title,
    description: cleanDescription,
  };
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { cartItems, setIsCartOpen } = useCart();
  const { user, logout, setLoginModalOpen, setModalView } = useAuth();
  const { wishlistItems, moveToCart, toggleWishlist } = useWishlist();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const overlayRef = useRef(null);

  // Dynamic collections API integration based purely on Shopify Metafield Tags (Male/Men, Female/Women, Bespoke)
  const [womenLinks, setWomenLinks] = useState([]);
  const [menLinks, setMenLinks] = useState([]);
  const [bespokeLink, setBespokeLink] = useState({
    label: 'Made for Moments',
    href: '/collections/custom-made-for-moments',
    img: '/assets/new_coll_5.JPG',
  });
  const [showcaseImg, setShowcaseImg] = useState('/assets/new_coll_3.png');

  useEffect(() => {
    async function loadCollections() {
      try {
        const collections = await fetchShopifyCollections();
        if (collections && collections.length > 0) {
          const fetchedWomen = [];
          const fetchedMen = [];
          let foundBespoke = null;

          collections.forEach((col) => {
            const item = {
              label: col.title,
              href: `/collections/${col.handle}`,
              img: col.img || '/assets/new_coll_3.png',
              category: col.category,
            };

            if (col.category === 'Women') {
              fetchedWomen.push(item);
            } else if (col.category === 'Men') {
              fetchedMen.push(item);
            } else if (col.category === 'Bespoke') {
              foundBespoke = item;
            }
          });

          setWomenLinks(fetchedWomen);
          setMenLinks(fetchedMen);
          if (foundBespoke) {
            setBespokeLink(foundBespoke);
          }
          if (collections[0]?.img) {
            setShowcaseImg(collections[0].img);
          }
        }
      } catch (err) {
        console.error('Error loading collections from Shopify API:', err);
      }
    }
    loadCollections();
  }, []);

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
      gsap.set('.nav-section-title, .nav-view-all-tag, .nav-section-links li a, .connect-links li a, .karigar-title a', { opacity: 0, y: 30 });
      gsap.to('.nav-section-title, .nav-view-all-tag', { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay: 0.25 });
      gsap.to('.nav-section-links li a, .connect-links li a, .karigar-title a', { y: 0, opacity: 1, duration: 1.0, stagger: 0.02, ease: 'power4.out', delay: 0.35 });
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  // Search State & Element Refs
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const navRef = useRef(null);
  const defaultRowRef = useRef(null);
  const searchRowRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const inputRef = useRef(null);

  // Open search mode with GSAP smooth flow transition
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    setProfileDropdownOpen(false);

    requestAnimationFrame(() => {
      if (!defaultRowRef.current || !searchRowRef.current) return;

      gsap.killTweensOf([defaultRowRef.current, searchRowRef.current]);

      searchRowRef.current.style.display = 'flex';
      searchRowRef.current.style.pointerEvents = 'auto';
      defaultRowRef.current.style.pointerEvents = 'none';

      const tl = gsap.timeline();
      tl.to(defaultRowRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.22,
        ease: 'power2.inOut',
      });
      tl.fromTo(
        searchRowRef.current,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            inputRef.current?.focus();
          },
        },
        0.06
      );
    });
  }, []);

  // Close search mode with GSAP smooth flow transition back to normal navbar
  const closeSearch = useCallback(() => {
    if (!searchRowRef.current || !defaultRowRef.current) {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    gsap.killTweensOf([defaultRowRef.current, searchRowRef.current, dropdownRef.current]);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
        if (searchRowRef.current) {
          searchRowRef.current.style.display = 'none';
          searchRowRef.current.style.pointerEvents = 'none';
        }
        if (defaultRowRef.current) {
          defaultRowRef.current.style.pointerEvents = 'auto';
        }
      },
    });

    if (dropdownRef.current) {
      tl.to(
        dropdownRef.current,
        {
          opacity: 0,
          y: -8,
          duration: 0.18,
          ease: 'power2.in',
        },
        0
      );
    }

    tl.to(
      searchRowRef.current,
      {
        opacity: 0,
        y: 6,
        duration: 0.22,
        ease: 'power2.in',
      },
      0
    );

    tl.fromTo(
      defaultRowRef.current,
      { opacity: 0, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.26,
        ease: 'power2.out',
      },
      0.08
    );
  }, []);

  // Debounce search query and query Shopify Storefront API
  useEffect(() => {
    if (!isSearchOpen) return;

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetchShopifyProducts({
          query: trimmed,
          first: 10,
          sortKey: 'RELEVANCE',
          reverse: false,
        });

        const normalized = (res.products || []).slice(0, 10).map(normalizeNavProduct);
        setSearchResults(normalized);
        setHasSearched(true);
      } catch (err) {
        console.error('Navbar search error:', err);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [searchQuery, isSearchOpen]);

  // Click outside listener: smooth return to normal navbar
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e) => {
      if (navRef.current && navRef.current.contains(e.target)) {
        return;
      }
      closeSearch();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  // Close search when opening full-screen menu
  useEffect(() => {
    if (menuOpen && isSearchOpen) {
      closeSearch();
    }
  }, [menuOpen, isSearchOpen, closeSearch]);

  // Subtle GSAP entrance for dropdown and search items
  useEffect(() => {
    if (isSearchOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [isSearchOpen, hasSearched]);

  useEffect(() => {
    if (isSearchOpen && searchResults.length > 0) {
      gsap.fromTo(
        '.nav-search-result-item',
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.22, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [searchResults, isSearchOpen]);

  // Isolate scroll inside search dropdown: prevent Lenis & body scroll bleed
  useEffect(() => {
    const dropdownEl = dropdownRef.current;
    const contentEl = dropdownContentRef.current;
    if (!dropdownEl || !isSearchOpen) return;

    const handleWheel = (e) => {
      e.stopPropagation();

      const targetEl = contentEl || dropdownEl;
      const { scrollTop, scrollHeight, clientHeight } = targetEl;

      if (scrollHeight > clientHeight) {
        const isUp = e.deltaY < 0;
        const isDown = e.deltaY > 0;
        const atTop = targetEl.scrollTop <= 0;
        const atBottom = Math.ceil(targetEl.scrollTop + clientHeight) >= scrollHeight - 1;

        if (contentEl && e.target !== contentEl && !contentEl.contains(e.target)) {
          contentEl.scrollTop += e.deltaY;
          e.preventDefault();
          return;
        }

        if ((isUp && atTop) || (isDown && atBottom)) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    };

    dropdownEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      dropdownEl.removeEventListener('wheel', handleWheel);
    };
  }, [isSearchOpen, searchResults.length, isSearching]);

  return (
    <>
      {/* BACKGROUND BACKDROP FOR CLICK-OUTSIDE & FOCUS */}
      {isSearchOpen && (
        <div
          className="nav-search-backdrop"
          onClick={closeSearch}
          aria-hidden="true"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}

      {/* NAVIGATION BAR */}
      <nav ref={navRef} className="nav">
        {/* DEFAULT NAVBAR CONTENT */}
        <div ref={defaultRowRef} className="nav-default-row">
          <div className="nav-left">
            <Link href="/" className="logo">
              <img src="/assets/logo2.png" alt="Arshia Singh Logo" className="brand-logo" />
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/story" className="nav-link-item">Our Story</Link>
            <Link href="/blogs" className="nav-link-item">Blog</Link>
            <Link href="/discover" className="nav-link-item">Discover</Link>
          </div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* SEARCH BUTTON */}
            <button
              type="button"
              className="search-toggle-btn"
              onClick={openSearch}
              aria-label="Search"
              title="Search silhouettes and archive"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon-svg" style={{ display: 'block' }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* PROFILE BUTTON & POPUP */}
            <div className="profile-container">
              <button
                className="profile-toggle"
                onClick={() => {
                  if (user) {
                    setModalView('profile');
                    setLoginModalOpen(true);
                  } else {
                    setModalView('login');
                    setLoginModalOpen(true);
                  }
                }}
                aria-label="Profile"
              >
                {user ? (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#111',
                    color: '#FAF9F6',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="profile-icon-svg" style={{ display: 'block' }}>
                    <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              CART{cartItems.reduce((acc, item) => acc + (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1), 0) > 0 && (
                <span className="cart-count-badge">
                  {cartItems.reduce((acc, item) => acc + (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1), 0)}
                </span>
              )}
            </button>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open Menu">
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="menu-icon-svg">
                <path d="M1.5 2H20.5M1.5 7H20.5M1.5 12H20.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* SEARCH BAR ROW (MORPHED NAVBAR) */}
        <div
          ref={searchRowRef}
          className="nav-search-row"
          style={{ display: 'none', opacity: 0 }}
        >
          <div className="nav-search-icon-wrap" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                closeSearch();
                window.location.href = `/products/${searchResults[0].handle}`;
              }
            }}
            placeholder="SEARCH SILHOUETTES, FABRICS, OR PRINTS..."
            className="nav-search-input"
            autoComplete="off"
            spellCheck="false"
            aria-label="Search silhouettes, fabrics, or prints"
          />

          <div className="nav-search-actions">
            {isSearching && (
              <div className="nav-search-spinner" aria-label="Searching..." />
            )}

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setHasSearched(false);
                  inputRef.current?.focus();
                }}
                className="nav-search-clear-btn"
                aria-label="Clear query"
                title="Clear query"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={closeSearch}
              className="nav-search-close-btn"
              aria-label="Close search"
              title="Close search"
            >
              <span className="nav-search-close-label">CLOSE</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* SEARCH RESULTS DROPDOWN MATCHING NAVBAR */}
        {isSearchOpen && (searchQuery.trim().length > 0 || isSearching || searchResults.length > 0) && (
          <div
            ref={dropdownRef}
            className="nav-search-dropdown"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="nav-search-dropdown-header">
              <span className="nav-search-dropdown-title">
                {isSearching
                  ? 'SEARCHING ARCHIVE...'
                  : `SEARCH RESULTS (${searchResults.length})`}
              </span>
              <span className="nav-search-dropdown-hint">TOP 10 CURATED SILHOUETTES</span>
            </div>

            <div
              ref={dropdownContentRef}
              className="nav-search-dropdown-content"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
            >
              {/* Loading State when first searching */}
              {isSearching && searchResults.length === 0 && (
                <div className="nav-search-loading-state">
                  <div className="nav-search-spinner large" />
                  <span>Searching conscious luxury archive...</span>
                </div>
              )}

              {/* Results List (top 10 or lesser) */}
              {searchResults.length > 0 && (
                <ul className="nav-search-results-list">
                  {searchResults.map((item) => (
                    <li key={item.id || item.handle}>
                      <Link
                        href={`/products/${item.handle}`}
                        onClick={closeSearch}
                        className="nav-search-result-item"
                      >
                        <div className="nav-search-item-thumb-box">
                          <img
                            src={item.img}
                            alt={item.altText || item.name}
                            className="nav-search-item-thumb"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="nav-search-item-info">
                          <div className="nav-search-item-top">
                            <span className="nav-search-item-name">{item.name}</span>
                            <span className="nav-search-item-price">{item.price}</span>
                          </div>
                          <p className="nav-search-item-desc" title={item.description || item.name}>
                            {item.description || 'Conscious luxury silhouette crafted with artisanal precision.'}
                          </p>
                        </div>
                        <div className="nav-search-item-arrow" aria-hidden="true">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Empty state when search returned 0 results */}
              {!isSearching && hasSearched && searchResults.length === 0 && searchQuery.trim() && (
                <div className="nav-search-empty-state">
                  <p className="nav-search-empty-msg">
                    No silhouettes found for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </p>
                  <p className="nav-search-empty-sub">
                    Try searching by silhouette, fabric, print, or browse all pieces in our Discover archive.
                  </p>
                  <Link
                    href="/discover"
                    onClick={closeSearch}
                    className="nav-search-discover-cta"
                  >
                    Explore Discover Archive &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Footer when results exist */}
            {searchResults.length > 0 && (
              <div className="nav-search-dropdown-footer">
                <Link
                  href="/discover"
                  onClick={closeSearch}
                  className="nav-search-view-all-link"
                >
                  <span>Explore All in Discover Archive</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* FULLSCREEN MENU OVERLAY */}
      <div ref={overlayRef} className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="menu-close-btn" onClick={closeMenu}>&times;</div>
        <div className="menu-container">
          <div className="menu-visual-showcase">
            <div className="showcase-img-wrapper">
              <img src={showcaseImg} alt="Editorial Showcase" id="menu-showcase-img" className="showcase-img" />
            </div>
          </div>

          <div className="menu-navigation-grid">
            {/* Women */}
            <div className="nav-section">
              <span className="nav-section-num">01</span>
              <div className="nav-section-header">
                <span className="nav-section-title">Women</span>
                <Link
                  href="/collections/women"
                  onClick={closeMenu}
                  className="nav-view-all-tag"
                  aria-label="View all women products"
                >
                  <span>View All</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <ul className="nav-section-links">
                {womenLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-img={link.img}
                      onMouseEnter={() => link.img && setShowcaseImg(link.img)}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Men */}
            <div className="nav-section">
              <span className="nav-section-num">02</span>
              <div className="nav-section-header">
                <span className="nav-section-title">Men</span>
                <Link
                  href="/collections/men"
                  onClick={closeMenu}
                  className="nav-view-all-tag"
                  aria-label="View all men products"
                >
                  <span>View All</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <ul className="nav-section-links">
                {menLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-img={link.img}
                      onMouseEnter={() => link.img && setShowcaseImg(link.img)}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore & Connect */}
            <div className="nav-section connect-section">
              <span className="nav-section-num">03</span>
              <span className="nav-section-title">Explore & Connect</span>
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
          </div>

          {/* Ornate Buttons Section - Cleanly positioned between grid and footer */}
          <div className="karigar-section-custom">
            <span className="nav-section-title karigar-title karigar-title-custom">
              <Link href="/karigar-of-as" onClick={closeMenu}>Karigar of AS</Link>
            </span>
            <span className="nav-section-title karigar-title karigar-title-custom">
              <Link href={bespokeLink.href} onClick={closeMenu}>{bespokeLink.label}</Link>
            </span>
            <style>{`
              .karigar-section-custom {
                display: flex !important;
                flex-direction: row !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 20px 30px !important;
                flex-wrap: wrap !important;
                width: 100% !important;
                margin: 20px 0 !important;
              }
              .karigar-title-custom {
                display: inline-block !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
              }
              .karigar-title-custom a {
                font-size: 1.3rem !important;
                padding: 12px 30px !important;
                letter-spacing: 0.1em !important;
                opacity: 1 !important;
                color: #ffffff !important;
              }
              @media (max-width: 768px) {
                .karigar-section-custom {
                  flex-direction: column !important;
                  gap: 15px !important;
                  width: 100% !important;
                  padding: 0 10px !important;
                  box-sizing: border-box !important;
                }
                .karigar-title-custom {
                  width: 100% !important;
                  display: flex !important;
                  justify-content: center !important;
                }
                .karigar-title-custom a {
                  font-size: clamp(0.72rem, 3.2vw, 0.92rem) !important;
                  letter-spacing: clamp(0.04em, 1.2vw, 0.08em) !important;
                  padding: 10px 14px !important;
                  width: min(340px, calc(100vw - 44px)) !important;
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                  white-space: nowrap !important;
                  overflow: hidden !important;
                  text-overflow: ellipsis !important;
                  text-align: center !important;
                  display: inline-flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
              }
            `}</style>
          </div>

          {/* Menu Footer */}
          <div className="menu-footer-info">
            <div className="m-footer-left">ARSHIA SINGH - CONSCIOUS LUXURY</div>
            <div className="m-footer-links">
              <Link href="/shipping-policy" onClick={closeMenu}>Shipping Policy</Link>
              <Link href="/privacy-policy" onClick={closeMenu}>Privacy Policy</Link>
              <Link href="/exchange-policy" onClick={closeMenu}>Exchange Policy</Link>
              <Link href="/returns-and-refunds" onClick={closeMenu}>Returns and Refunds</Link>
              <Link href="/terms-and-conditions" onClick={closeMenu}>Terms &amp; Conditions</Link>
            </div>
            <div className="m-footer-right">LOCAL TIME <span className="menu-local-time">{currentTime}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

