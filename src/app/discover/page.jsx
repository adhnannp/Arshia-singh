'use client';

export const runtime = "edge";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../../components/Footer';
import { products } from '../../data/products-data';
import { useAuth } from '../../components/AuthContext';
import { useWishlist } from '../../components/WishlistContext';

// Filter out 'custom made' (Made for Moments) products as requested
const filteredProducts = products.filter(p => p.category?.toLowerCase() !== 'custom made');

// Map product category strings to section (men, women)
const SECTION_MAP = {
  'matching moods': 'women',
  'flow state': 'women',
  'power layers': 'women',
  '6 yards of good': 'women',
  'natural luxury': 'men',
  'printed stories': 'men',
  'modern classics': 'men'
};

const CATEGORY_NAMES = {
  'matching moods': 'Matching Moods (Women)',
  'flow state': 'Flow State (Women)',
  'power layers': 'Power Layers (Women)',
  '6 yards of good': 'Six Yards of Good (Women)',
  'natural luxury': 'Natural Luxury (Men)',
  'printed stories': 'Printed Stories (Men)',
  'modern classics': 'Modern Classics (Men)'
};

export default function DiscoverPage() {
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Layout & UI States
  const [layoutMode, setLayoutMode] = useState('studio'); // 'studio' (3-col) vs 'editorial' (2-col)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Filter States
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedPrints, setSelectedPrints] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  // Dynamically extract option lists from filtered products for checkbox stability
  const fabricsList = Array.from(new Set(filteredProducts.map(p => p.fabric?.trim()).filter(Boolean))).sort();
  const componentsList = Array.from(new Set(filteredProducts.map(p => p.components?.trim()).filter(Boolean))).sort();
  const printsList = Array.from(new Set(filteredProducts.map(p => p.print?.trim()).filter(p => p && p !== 'N/A'))).sort();

  // Filter application logic
  let displayProducts = filteredProducts.filter(product => {
    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(query);
      const matchDetails = product.details?.toLowerCase().includes(query);
      const matchFabric = product.fabric?.toLowerCase().includes(query);
      const matchCategory = product.category?.toLowerCase().includes(query);
      const matchPrint = product.print?.toLowerCase().includes(query);
      if (!matchName && !matchDetails && !matchFabric && !matchCategory && !matchPrint) return false;
    }

    // 2. Gender / Section
    if (selectedGenders.length > 0) {
      const section = SECTION_MAP[product.category?.toLowerCase()];
      if (!selectedGenders.includes(section)) return false;
    }

    // 3. Category / Collection
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category?.toLowerCase())) return false;

    // 4. Fabric
    if (selectedFabrics.length > 0 && !selectedFabrics.includes(product.fabric?.trim())) return false;

    // 5. Garment Pieces (Components)
    if (selectedComponents.length > 0 && !selectedComponents.includes(product.components?.trim())) return false;

    // 6. Prints / Craft Styles
    if (selectedPrints.length > 0 && !selectedPrints.includes(product.print?.trim())) return false;

    return true;
  });

  // Price parsing & formatting helpers
  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'N/A' || priceStr === 'Price on Request') return 0;
    const sanitized = priceStr.replace(/[^\d]/g, '');
    return parseInt(sanitized, 10) || 0;
  };

  const formatPrice = (price) => {
    if (!price || price === 'N/A' || price === 'Price on Request') return 'Price on Request';
    return `₹${price.replace('/-', '').replace('₹', '').replace(',', ',').trim()}`;
  };

  // Sorting logic
  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === 'alphabetical') {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Animation triggers with GSAP
  useEffect(() => {
    document.title = "DISCOVER SILHOUETTES | ARSHIA SINGH";

    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ force3D: true });

    // Entrance animation for hero elements
    const tl = gsap.timeline();
    tl.fromTo('.discover-hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.discover-hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.6')
      .fromTo('.discover-hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.8')
      .fromTo('.search-input-container', { scale: 0.98, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.8');

    // Staggered load for product cards
    const cards = document.querySelectorAll('.product-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.08, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.collection-products-grid',
            start: 'top 95%',
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [selectedGenders, selectedCategories, selectedFabrics, selectedComponents, selectedPrints, sortBy, layoutMode]);

  const makeSlug = (name) =>
    name.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/[^a-z0-9-]/g, '');

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedGenders([]);
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedComponents([]);
    setSelectedPrints([]);
    setSortBy('default');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    selectedGenders.length + 
    selectedCategories.length + 
    selectedFabrics.length + 
    selectedComponents.length + 
    selectedPrints.length +
    (searchQuery ? 1 : 0);

  return (
    <>
      {/* ─── TYPOGRAPHIC DISCOVER HERO ─── */}
      <section className="collection-hero" style={{ background: '#FAF9F6' }}>
        <div className="collection-hero-container">
          <div className="collection-hero-content">
            <span className="collection-hero-subtitle discover-hero-subtitle">THE FULL ARCHIVE</span>
            <h1 className="collection-hero-title discover-hero-title">DISCOVER</h1>
            <p className="collection-hero-desc discover-hero-desc">
              Explore our complete collections of luxury conscious silhouettes for men and women. Meticulously handcrafted using vegan, PETA-approved textiles, honoring age-old heritage craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SEARCH SECTION ─── */}
      <section className="discover-search-section" style={{ padding: '0 6vw', background: '#fff', marginTop: '-30px', marginBottom: '30px' }}>
        <div className="search-input-container" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', zIndex: 10 }}>
          <input
            type="text"
            placeholder="SEARCH SILHOUETTES, FABRICS, OR PRINTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px 16px 50px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '40px',
              outline: 'none',
              background: '#FAF9F6',
              color: '#111',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
            className="search-input-field"
          />
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888'
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#888',
                lineHeight: 1
              }}
            >
              &times;
            </button>
          )}
        </div>
      </section>

      {/* ─── DYNAMIC UTILITY CONTROLS BAR ─── */}
      <div className="collection-controls-bar">
        <div className="controls-left">
          <button className="btn-filter-trigger" onClick={() => setIsFilterOpen(true)}>
            <span>Filters</span>
            {activeFiltersCount > 0 ? (
              <span className="filter-count">{activeFiltersCount}</span>
            ) : (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 2.5H13M3.5 6H10.5M5.5 9.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <div className="active-filters-summary">
              {searchQuery && (
                <div className="active-filter-pill">
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>×</button>
                </div>
              )}
              {selectedGenders.map(g => (
                <div key={g} className="active-filter-pill">
                  <span>{g === 'women' ? 'Women' : g === 'men' ? 'Men' : 'Custom / Occasion'}</span>
                  <button onClick={() => toggleFilter(selectedGenders, setSelectedGenders, g)}>×</button>
                </div>
              ))}
              {selectedCategories.map(c => (
                <div key={c} className="active-filter-pill">
                  <span>{CATEGORY_NAMES[c] || c}</span>
                  <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}>×</button>
                </div>
              ))}
              {selectedFabrics.map(f => (
                <div key={f} className="active-filter-pill">
                  <span>{f}</span>
                  <button onClick={() => toggleFilter(selectedFabrics, setSelectedFabrics, f)}>×</button>
                </div>
              ))}
              {selectedComponents.map(c => (
                <div key={c} className="active-filter-pill">
                  <span>{c} Components</span>
                  <button onClick={() => toggleFilter(selectedComponents, setSelectedComponents, c)}>×</button>
                </div>
              ))}
              {selectedPrints.map(p => (
                <div key={p} className="active-filter-pill">
                  <span>{p} Print</span>
                  <button onClick={() => toggleFilter(selectedPrints, setSelectedPrints, p)}>×</button>
                </div>
              ))}
              <button className="btn-clear-all" onClick={clearAllFilters}>Clear All</button>
            </div>
          )}
        </div>
        
        <div className="controls-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="layout-switchers" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '16px' }}>
            <button 
              className={`btn-layout ${layoutMode === 'studio' ? 'active' : ''}`} 
              onClick={() => setLayoutMode('studio')}
              aria-label="Studio grid"
              style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="5" height="20" rx="0.5" fill={layoutMode === 'studio' ? 'currentColor' : 'none'} />
                <rect x="9.5" y="2" width="5" height="20" rx="0.5" fill={layoutMode === 'studio' ? 'currentColor' : 'none'} />
                <rect x="17" y="2" width="5" height="20" rx="0.5" fill={layoutMode === 'studio' ? 'currentColor' : 'none'} />
              </svg>
            </button>
            <button 
              className={`btn-layout ${layoutMode === 'editorial' ? 'active' : ''}`} 
              onClick={() => setLayoutMode('editorial')}
              aria-label="Editorial grid"
              style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="2" width="7" height="20" rx="0.5" fill={layoutMode === 'editorial' ? 'currentColor' : 'none'} />
                <rect x="14" y="2" width="7" height="20" rx="0.5" fill={layoutMode === 'editorial' ? 'currentColor' : 'none'} />
              </svg>
            </button>
          </div>

          <div className="sort-select-wrapper">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="alphabetical">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT GRID ─── */}
      <section className={`collection-products-grid grid-${layoutMode}`}>
        {displayProducts.length === 0 ? (
          <div className="collection-empty">
            <p>No silhouettes match your search or filter selections.</p>
            <button className="btn-primary" onClick={clearAllFilters} style={{ background: '#000', color: '#fff', border: '1px solid #000', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer', marginTop: '10px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          displayProducts.map((product) => {
            const productSlug = makeSlug(product.name);
            const productSection = SECTION_MAP[product.category?.toLowerCase()];
            return (
              <Link 
                href={`/product/${productSlug}`}
                key={product.name} 
                className="product-card"
              >
                <div className="product-card-image-wrap">
                  <img src={product.img} alt={product.name} loading="lazy" />
                  {productSection && (
                    <span className="card-badge">
                      {productSection === 'women' ? "Women" : productSection === 'men' ? "Men" : "Custom"}
                    </span>
                  )}
                  <div className="product-card-overlay">
                    <span className="btn-card-quick-view">
                      View Silhouette
                    </span>
                  </div>
                </div>
                <div className="product-card-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 className="product-card-name" style={{ margin: 0 }}>{product.name.toUpperCase()}</h3>
                    <button
                      className={`wishlist-heart-btn ${isInWishlist(product.name) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        e.preventDefault();  // prevent Link click trigger
                        requireAuth(() => {
                          toggleWishlist(product);
                        });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isInWishlist(product.name) ? '#b00' : 'inherit',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product.name) ? '#b00' : 'none'} stroke={isInWishlist(product.name) ? '#b00' : 'currentColor'} strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-meta">
                    <span className="product-card-fabric">{product.fabric?.toUpperCase() || 'PREMIUM'}</span>
                    <span className="product-card-price">{formatPrice(product.price)}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>

      {/* ─── LUXURY FILTERS SIDE DRAWER ─── */}
      <div className={`drawer-backdrop ${isFilterOpen ? 'show' : ''}`} onClick={() => setIsFilterOpen(false)}></div>
      <div className={`filters-drawer ${isFilterOpen ? 'open' : ''}`}>
        <div className="filters-header">
          <h2>Filter Archive</h2>
          <button className="btn-close-filters" onClick={() => setIsFilterOpen(false)}>×</button>
        </div>
        <div className="filters-body">
          {/* Section Filter */}
          <div className="filter-group">
            <div className="filter-group-title">Section</div>
            <div className="filter-options">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedGenders.includes('women')}
                  onChange={() => toggleFilter(selectedGenders, setSelectedGenders, 'women')}
                />
                <span>Women's Collections</span>
              </label>
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  checked={selectedGenders.includes('men')}
                  onChange={() => toggleFilter(selectedGenders, setSelectedGenders, 'men')}
                />
                <span>Men's Collections</span>
              </label>
            </div>
          </div>

          {/* Collection Specific Filters */}
          <div className="filter-group">
            <div className="filter-group-title">Collections</div>
            <div className="filter-options">
              {Object.entries(CATEGORY_NAMES).map(([key, value]) => (
                <label key={key} className="filter-label">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(key)}
                    onChange={() => toggleFilter(selectedCategories, setSelectedCategories, key)}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          {fabricsList.length > 0 && (
            <div className="filter-group">
              <div className="filter-group-title">Fabrics</div>
              <div className="filter-options" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '10px' }}>
                {fabricsList.map(fabric => (
                  <label key={fabric} className="filter-label">
                    <input 
                      type="checkbox" 
                      checked={selectedFabrics.includes(fabric)}
                      onChange={() => toggleFilter(selectedFabrics, setSelectedFabrics, fabric)}
                    />
                    <span>{fabric}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Garment Pieces Filter */}
          {componentsList.length > 0 && (
            <div className="filter-group">
              <div className="filter-group-title">Garment Pieces</div>
              <div className="filter-options">
                {componentsList.map(comp => (
                  <label key={comp} className="filter-label">
                    <input 
                      type="checkbox" 
                      checked={selectedComponents.includes(comp)}
                      onChange={() => toggleFilter(selectedComponents, setSelectedComponents, comp)}
                    />
                    <span>{comp} Piece Set</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Prints / Craft Styles Filter */}
          {printsList.length > 0 && (
            <div className="filter-group">
              <div className="filter-group-title">Prints / Craft Styles</div>
              <div className="filter-options" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '10px' }}>
                {printsList.map(print => (
                  <label key={print} className="filter-label">
                    <input 
                      type="checkbox" 
                      checked={selectedPrints.includes(print)}
                      onChange={() => toggleFilter(selectedPrints, setSelectedPrints, print)}
                    />
                    <span>{print} Print</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
