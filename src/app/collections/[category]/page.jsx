'use client';

export const runtime = "edge";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../components/AuthContext';
import { useWishlist } from '../../../components/WishlistContext';
import { fetchCollectionProducts } from '../../../lib/shopify/queries/products';
import { fetchShopifyCollections } from '../../../lib/shopify/queries/collections';

// Helper: Normalize Shopify product node
const normalizeProduct = (node, collectionCategory) => {
  const metafieldMap = {};
  if (Array.isArray(node.metafields)) {
    node.metafields.forEach(m => {
      if (m && m.key) {
        metafieldMap[m.key] = m.value;
      }
    });
  }

  const rawPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const formattedPrice = rawPrice > 0
    ? `₹${Math.round(rawPrice).toLocaleString('en-IN')}`
    : 'Price on Request';

  return {
    id: node.id,
    name: node.title,
    title: node.title,
    handle: node.handle,
    price: formattedPrice,
    rawPrice: rawPrice,
    img: node.featuredImage?.url || '/assets/placeholder.jpg',
    altText: node.featuredImage?.altText || node.title,
    availableForSale: node.availableForSale,
    fabric: metafieldMap.fabric || '',
    components: metafieldMap.components || '',
    category: collectionCategory || metafieldMap.category || 'Luxury Edit',
    details: node.description || '',
    is_couple_set:
      metafieldMap.is_couple_set === true ||
      metafieldMap.is_couple_set === 'true' ||
      metafieldMap.is_couple_set === '1' ||
      metafieldMap.is_couple_set === 'yes' ||
      (typeof metafieldMap.is_couple_set === 'string' && metafieldMap.is_couple_set.toLowerCase() === 'true'),
    tags: Array.isArray(node.tags) ? node.tags : [],
    metafields: metafieldMap,
  };
};

// Helper: Map sort selection to Storefront API parameters
const getSortParams = (sortBy) => {
  switch (sortBy) {
    case 'price-low':
      return { sortKey: 'PRICE', reverse: false };
    case 'price-high':
      return { sortKey: 'PRICE', reverse: true };
    case 'default':
    default:
      return { sortKey: 'COLLECTION_DEFAULT', reverse: false };
  }
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.category || '';

  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Dynamic Shopify Collection State
  const [collectionInfo, setCollectionInfo] = useState({ title: '', description: '', image: null });
  const [collectionsNav, setCollectionsNav] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadNavCollections() {
      try {
        const data = await fetchShopifyCollections();
        if (data && data.length > 0) {
          setCollectionsNav(data);
        }
      } catch (e) {
        console.error('Error fetching collections nav:', e);
      }
    }
    loadNavCollections();
  }, []);
  const [layoutMode] = useState('studio'); // 'studio' (3-col)
  const [mobileGrid, setMobileGrid] = useState('1col'); // mobile: '1col' | '2col'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCrafts, setSelectedCrafts] = useState([]);
  const [selectedToggles, setSelectedToggles] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const sentinelRef = useRef(null);

  // Restore filters and sort state from sessionStorage or URL query params
  useEffect(() => {
    if (typeof window === 'undefined' || !slug) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSort = urlParams.get('sort');
      const savedRaw = sessionStorage.getItem(`as_filter_${slug}`);
      const saved = savedRaw ? JSON.parse(savedRaw) : null;

      if (urlSort && ['default', 'price-low', 'price-high'].includes(urlSort)) {
        setSortBy(urlSort);
      } else if (saved?.sortBy) {
        setSortBy(saved.sortBy);
      }

      if (saved?.selectedPrices) setSelectedPrices(saved.selectedPrices);
      if (saved?.selectedOccasions) setSelectedOccasions(saved.selectedOccasions);
      if (saved?.selectedCategories) setSelectedCategories(saved.selectedCategories);
      if (saved?.selectedColors) setSelectedColors(saved.selectedColors);
      if (saved?.selectedCrafts) setSelectedCrafts(saved.selectedCrafts);
      if (saved?.selectedToggles) setSelectedToggles(saved.selectedToggles);
    } catch (e) {
      console.warn('Could not restore filter state', e);
    }
  }, [slug]);

  // Persist filters and sort state to sessionStorage and update URL query
  useEffect(() => {
    if (typeof window === 'undefined' || !slug) return;
    try {
      const stateToSave = {
        sortBy,
        selectedPrices,
        selectedOccasions,
        selectedCategories,
        selectedColors,
        selectedCrafts,
        selectedToggles,
      };
      sessionStorage.setItem(`as_filter_${slug}`, JSON.stringify(stateToSave));

      const url = new URL(window.location.href);
      if (sortBy && sortBy !== 'default') {
        url.searchParams.set('sort', sortBy);
      } else {
        url.searchParams.delete('sort');
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      console.warn('Could not persist filter state', e);
    }
  }, [slug, sortBy, selectedPrices, selectedOccasions, selectedCategories, selectedColors, selectedCrafts, selectedToggles]);

  // Fetch initial collection data and products from Shopify
  const loadInitialProducts = useCallback(async () => {
    if (!slug) return;
    setLoading(true);

    const { sortKey, reverse } = getSortParams(sortBy);
    const res = await fetchCollectionProducts({
      handle: slug,
      first: 20,
      after: null,
      sortKey,
      reverse,
    });

    if (res.collection) {
      setCollectionInfo({
        title: res.collection.title,
        description: res.collection.description,
        image: res.collection.image?.url || null,
      });
    }

    const categoryKey = res.collection?.title || slug;
    const normalized = (res.products || []).map(p => normalizeProduct(p, categoryKey));
    setProductsList(normalized);
    setPageInfo(res.pageInfo || { hasNextPage: false, endCursor: null });
    setLoading(false);
  }, [slug, sortBy]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  // Load next batch of products for auto-pagination with deduplication
  const loadMoreProducts = useCallback(async () => {
    if (loading || loadingMore || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setLoadingMore(true);

    const { sortKey, reverse } = getSortParams(sortBy);
    const res = await fetchCollectionProducts({
      handle: slug,
      first: 20,
      after: pageInfo.endCursor,
      sortKey,
      reverse,
    });

    const categoryKey = collectionInfo.title || slug;
    const normalized = (res.products || []).map(p => normalizeProduct(p, categoryKey));
    setProductsList(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newUnique = normalized.filter(p => !existingIds.has(p.id));
      return [...prev, ...newUnique];
    });
    setPageInfo(res.pageInfo || { hasNextPage: false, endCursor: null });
    setLoadingMore(false);
  }, [slug, sortBy, collectionInfo.title, pageInfo, loading, loadingMore]);

  // Intersection Observer for endless scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo.hasNextPage && !loading && !loadingMore) {
          loadMoreProducts();
        }
      },
      { rootMargin: '300px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [pageInfo.hasNextPage, loading, loadingMore, loadMoreProducts]);

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedPrices([]);
    setSelectedOccasions([]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedCrafts([]);
    setSelectedToggles([]);
    setSortBy('default');
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(`as_filter_${slug}`);
        const url = new URL(window.location.href);
        url.searchParams.delete('sort');
        window.history.replaceState(null, '', url.toString());
      } catch (e) {}
    }
  };

  const activeFiltersCount =
    selectedPrices.length +
    selectedOccasions.length +
    selectedCategories.length +
    selectedColors.length +
    selectedCrafts.length +
    selectedToggles.length;

  const displayTitle = collectionInfo.title || slug.replace(/-/g, ' ').toUpperCase();

  // Color option definitions
  const colorOptions = [
    { label: 'Neutral & Ivory', color: '#f5f2eb' },
    { label: 'Earthy Browns & Terracotta', color: '#8c593b' },
    { label: 'Deep Midnight / Raat Black', color: '#1a1a1a' },
    { label: 'Pastel Blues & Muted Greens', color: '#a3b899' },
    { label: 'Multi / Heritage Print', color: 'linear-gradient(135deg, #d4af37, #c85a32, #2c4a3e)' }
  ];

  // Client-side filter evaluation across all 6 luxury filter categories
  const displayProducts = productsList.filter(product => {
    // 1. Price Range evaluation
    if (selectedPrices.length > 0) {
      const price = product.rawPrice || 0;
      const matchesPrice = selectedPrices.some(range => {
        if (range === 'Under ₹10,000') return price < 10000;
        if (range === '₹10,000 – ₹25,000') return price >= 10000 && price <= 25000;
        if (range === '₹25,000 – ₹50,000') return price >= 25000 && price <= 50000;
        if (range === '₹50,000+') return price > 50000;
        return true;
      });
      if (!matchesPrice) return false;
    }

    // 2. Occasion & Mood
    if (selectedOccasions.length > 0) {
      const text = (product.name + ' ' + product.details + ' ' + product.category).toLowerCase();
      const matchesOccasion = selectedOccasions.some(occ => {
        const key = occ.toLowerCase();
        if (key.includes('resort')) return text.includes('kaftan') || text.includes('shirt') || text.includes('co-ord') || text.includes('print');
        if (key.includes('festive')) return text.includes('phulkari') || text.includes('embroidery') || text.includes('skirt') || text.includes('blazer');
        if (key.includes('cocktail')) return text.includes('jacket') || text.includes('blazer') || text.includes('kaftan') || text.includes('set');
        if (key.includes('everyday')) return text.includes('shirt') || text.includes('top') || text.includes('dhoti') || text.includes('co-ord');
        if (key.includes('office')) return text.includes('blazer') || text.includes('waistcoat') || text.includes('pant') || text.includes('shirt');
        return true;
      });
      if (!matchesOccasion) return false;
    }

    // 3. Silhouette & Category Type
    if (selectedCategories.length > 0) {
      const text = (product.name + ' ' + product.details + ' ' + product.category).toLowerCase();
      const matchesCategory = selectedCategories.some(cat => {
        const key = cat.toLowerCase();
        if (key.includes('co-ord')) return text.includes('co-ord') || text.includes('set');
        if (key.includes('cape')) return text.includes('cape') || text.includes('drape');
        if (key.includes('blazer')) return text.includes('blazer') || text.includes('waistcoat') || text.includes('jacket');
        if (key.includes('shirt')) return text.includes('shirt') || text.includes('top');
        if (key.includes('skirt')) return text.includes('skirt') || text.includes('dhoti') || text.includes('palazzo');
        if (key.includes('kaftan')) return text.includes('kaftan') || text.includes('dress');
        return true;
      });
      if (!matchesCategory) return false;
    }

    // 4. Color Palette Swatches
    if (selectedColors.length > 0) {
      const text = (product.name + ' ' + product.details).toLowerCase();
      const matchesColor = selectedColors.some(col => {
        const key = col.toLowerCase();
        if (key.includes('neutral') || key.includes('ivory')) return text.includes('white') || text.includes('ivory') || text.includes('cream') || text.includes('pastel');
        if (key.includes('earthy') || key.includes('brown') || key.includes('terracotta')) return text.includes('brown') || text.includes('gold') || text.includes('ravel');
        if (key.includes('midnight') || key.includes('black')) return text.includes('raat') || text.includes('black') || text.includes('dark');
        if (key.includes('blue') || key.includes('green')) return text.includes('rangrez') || text.includes('green') || text.includes('blue');
        if (key.includes('multi') || key.includes('print')) return text.includes('print') || text.includes('phulkari') || text.includes('bagh');
        return true;
      });
      if (!matchesColor) return false;
    }

    // 5. Artisanal Craft
    if (selectedCrafts.length > 0) {
      const text = (product.name + ' ' + product.details + ' ' + (product.fabric || '')).toLowerCase();
      const matchesCraft = selectedCrafts.some(craft => {
        const key = craft.toLowerCase();
        if (key.includes('embroidered') || key.includes('phulkari')) return text.includes('phulkari') || text.includes('embroidery');
        if (key.includes('block print') || key.includes('rangrez')) return text.includes('print') || text.includes('rangrez') || text.includes('block');
        if (key.includes('vegan silk')) return text.includes('silk') || text.includes('satin') || text.includes('vegan');
        if (key.includes('solid') || key.includes('minimalist')) return !text.includes('print') && !text.includes('phulkari');
        return true;
      });
      if (!matchesCraft) return false;
    }

    // 6. Availability & Quick Toggles
    if (selectedToggles.length > 0) {
      const matchesToggle = selectedToggles.every(tog => {
        if (tog === 'In Stock Only') return product.availableForSale !== false;
        if (tog === 'Ships Next Day (Ready to Ship)') return product.availableForSale !== false;
        if (tog === 'Custom Order Available') return true;
        return true;
      });
      if (!matchesToggle) return false;
    }

    return true;
  });

  // Client-side Price Sorting guarantee
  const sortedDisplayProducts = [...displayProducts];
  if (sortBy === 'price-low') {
    sortedDisplayProducts.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
  } else if (sortBy === 'price-high') {
    sortedDisplayProducts.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
  }

  // Next collection computation for end-of-page CTA
  const currentNavIndex = collectionsNav.findIndex(c => c.handle === slug);
  const nextCollection = collectionsNav.length > 0 
    ? collectionsNav[(currentNavIndex + 1) % collectionsNav.length] 
    : null;

  // Animation triggers with GSAP
  useEffect(() => {
    const displayCategoryName = collectionInfo.title || slug.replace(/-/g, ' ').toUpperCase();
    document.title = `${displayCategoryName.toUpperCase()} | ARSHIA SINGH`;

    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });

    const tl = gsap.timeline();
    tl.fromTo('.collection-hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.collection-hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.6')
      .fromTo('.collection-hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.8');

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
  }, [slug, collectionInfo.title, sortBy, productsList.length]);

  return (
    <>
      {/* ─── TYPOGRAPHIC HERO ─── */}
      <section className="collection-hero">
        <div className="collection-hero-container">
          <div className="collection-hero-content">
            <span className="collection-hero-subtitle">HERITAGE SILHOUETTES</span>
            <h1 className="collection-hero-title">{displayTitle}</h1>
            <p className="collection-hero-desc">
              {collectionInfo.description || 'Consciously handcrafted luxury silhouettes, celebrating age-old artisanal techniques with PETA-approved vegan textiles.'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── LUXURY COLLECTION SWITCHER BAR ─── */}
      <div className="collection-switcher-bar">
        <div className="collection-switcher-track">
          <Link href="/collections" className="switcher-pill directory-pill">
            <span className="pill-dot">✦</span> All Collections
          </Link>
          <div className="switcher-divider" />
          {collectionsNav.map((col) => {
            const isActive = col.handle === slug;
            return (
              <Link
                key={col.handle}
                href={`/collections/${col.handle}`}
                className={`switcher-pill${isActive ? ' active' : ''}`}
              >
                <span className="pill-tag">{col.category}</span>
                <span className="pill-title">{col.title}</span>
                {isActive && <span className="pill-active-dot" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── DYNAMIC UTILITY CONTROLS BAR ─── */}
      <div className="collection-controls-bar">
        <div className="controls-top-row">

          {/* LEFT: Filters button */}
          <button className="btn-filter-trigger" onClick={() => setIsFilterOpen(true)}>
            <span>Filters</span>
            {activeFiltersCount > 0 ? (
              <span className="filter-count">{activeFiltersCount}</span>
            ) : (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path d="M1 2.5H13M3.5 6H10.5M5.5 9.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* RIGHT: grid toggle + sort grouped */}
          <div className="controls-right">

            {/* Mobile-only grid view toggle */}
            <div className="mobile-grid-toggle">
              <button
                className={`mobile-grid-btn${mobileGrid === '1col' ? ' active' : ''}`}
                onClick={() => setMobileGrid('1col')}
                aria-label="Single column view"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="2" y="9" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
              <button
                className={`mobile-grid-btn${mobileGrid === '2col' ? ' active' : ''}`}
                onClick={() => setMobileGrid('2col')}
                aria-label="Two column grid view"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                  <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>

            {/* Thin separator — visible only when toggle is showing */}
            <div className="controls-sep" />

            {/* Sort — clear labels */}
            <div className="sort-select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort silhouettes"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="active-filters-summary">
            {selectedPrices.map(p => (
              <div key={p} className="active-filter-pill">
                <span>{p}</span>
                <button onClick={() => toggleFilter(selectedPrices, setSelectedPrices, p)}>×</button>
              </div>
            ))}
            {selectedOccasions.map(o => (
              <div key={o} className="active-filter-pill">
                <span>{o}</span>
                <button onClick={() => toggleFilter(selectedOccasions, setSelectedOccasions, o)}>×</button>
              </div>
            ))}
            {selectedCategories.map(c => (
              <div key={c} className="active-filter-pill">
                <span>{c}</span>
                <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}>×</button>
              </div>
            ))}
            {selectedColors.map(col => (
              <div key={col} className="active-filter-pill">
                <span>{col}</span>
                <button onClick={() => toggleFilter(selectedColors, setSelectedColors, col)}>×</button>
              </div>
            ))}
            {selectedCrafts.map(cr => (
              <div key={cr} className="active-filter-pill">
                <span>{cr}</span>
                <button onClick={() => toggleFilter(selectedCrafts, setSelectedCrafts, cr)}>×</button>
              </div>
            ))}
            {selectedToggles.map(t => (
              <div key={t} className="active-filter-pill">
                <span>{t}</span>
                <button onClick={() => toggleFilter(selectedToggles, setSelectedToggles, t)}>×</button>
              </div>
            ))}
            <button className="btn-clear-all" onClick={clearAllFilters}>Clear All</button>
          </div>
        )}
      </div>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="collection-products-section">
        {loading ? (
          <div className="collection-loading-state">
            <div className="spinner"></div>
            <span>Curating Collection...</span>
          </div>
        ) : sortedDisplayProducts.length === 0 ? (
          <div className="collection-empty-state">
            <h3>No Silhouettes Available</h3>
            <p>We couldn&apos;t find any items matching your selected criteria.</p>
            <button className="btn-primary" onClick={clearAllFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className={`collection-products-grid grid-studio${mobileGrid === '2col' ? ' mobile-2col' : ''}`}>
            {sortedDisplayProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-card-image-wrap">
                    <Link href={`/products/${product.handle}`}>
                      <img src={product.img} alt={product.altText} />
                    </Link>
                    <button
                      className={`card-wishlist-icon ${isWishlisted ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requireAuth(() => toggleWishlist(product));
                      }}
                      aria-label="Add to Wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#b00" : "none"} stroke={isWishlisted ? "#b00" : "#111"} strokeWidth="1.5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div className="product-card-info">
                    <div className="product-card-category">{product.category}</div>
                    <h3 className="product-card-name">
                      <Link href={`/products/${product.handle}`}>{product.name}</Link>
                    </h3>
                    <div className="product-card-price">{product.price}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── ENDLESS SCROLL SENTINEL & AUTO-PAGINATION LOADER ─── */}
      <div ref={sentinelRef} style={{ height: '20px', margin: '20px 0' }} />
      {loadingMore && (
        <div style={{ textAlign: 'center', padding: '20px 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', color: '#888' }}>
          Loading More Silhouettes...
        </div>
      )}

      {/* ─── LUXURY FILTERS SIDE DRAWER ─── */}
      <div className={`drawer-backdrop ${isFilterOpen ? 'show' : ''}`} onClick={() => setIsFilterOpen(false)}></div>
      <div className={`filters-drawer ${isFilterOpen ? 'open' : ''}`}>
        <div className="filters-header">
          <h2>Filter Collection</h2>
          <button className="btn-close-filters" onClick={() => setIsFilterOpen(false)}>×</button>
        </div>
        <div className="filters-body">
          {/* 1. Price Range Tiers */}
          <div className="filter-group">
            <div className="filter-group-title">1. Price Range</div>
            <div className="filter-options">
              {['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+'].map(price => (
                <label key={price} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(price)}
                    onChange={() => toggleFilter(selectedPrices, setSelectedPrices, price)}
                  />
                  <span>{price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Occasion & Mood */}
          <div className="filter-group">
            <div className="filter-group-title">2. Occasion & Mood</div>
            <div className="filter-options">
              {[
                'Resort & Vacation',
                'Festive & Wedding Guest',
                'Cocktail & Evening Statement',
                'Everyday Luxe & Casual',
                'Office / Formal Tailoring'
              ].map(occ => (
                <label key={occ} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedOccasions.includes(occ)}
                    onChange={() => toggleFilter(selectedOccasions, setSelectedOccasions, occ)}
                  />
                  <span>{occ}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Silhouette & Category Type */}
          <div className="filter-group">
            <div className="filter-group-title">3. Silhouette & Category</div>
            <div className="filter-options">
              {[
                'Co-ord Sets',
                'Capes & Drapes',
                'Blazers & Waistcoats',
                'Shirts & Tops',
                'Skirts & Dhoti Skirts',
                'Kaftans & Dresses'
              ].map(cat => (
                <label key={cat} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Color Palette Swatches */}
          <div className="filter-group">
            <div className="filter-group-title">4. Color Palette</div>
            <div className="color-swatches-grid">
              {colorOptions.map(opt => {
                const isSelected = selectedColors.includes(opt.label);
                return (
                  <div
                    key={opt.label}
                    className={`color-swatch-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleFilter(selectedColors, setSelectedColors, opt.label)}
                  >
                    <span className="color-dot" style={{ background: opt.color }}></span>
                    <span>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Craft & Heritage Technique */}
          <div className="filter-group">
            <div className="filter-group-title">5. Artisanal Craft</div>
            <div className="filter-options">
              {[
                'Hand Embroidered (Phulkari)',
                'Block Print / Rangrez',
                'Vegan Silk Weave',
                'Solid / Minimalist'
              ].map(craft => (
                <label key={craft} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedCrafts.includes(craft)}
                    onChange={() => toggleFilter(selectedCrafts, setSelectedCrafts, craft)}
                  />
                  <span>{craft}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Availability & Sorting */}
          <div className="filter-group">
            <div className="filter-group-title">6. Availability & Sort</div>
            <div className="filter-options" style={{ marginBottom: '20px' }}>
              {[
                'In Stock Only',
                'Ships Next Day (Ready to Ship)',
                'Custom Order Available'
              ].map(tog => (
                <label key={tog} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedToggles.includes(tog)}
                    onChange={() => toggleFilter(selectedToggles, setSelectedToggles, tog)}
                  />
                  <span>{tog}</span>
                </label>
              ))}
            </div>
            <div className="filter-group-title" style={{ marginTop: '15px' }}>Sort By</div>
            <div className="sort-select-wrapper" style={{ width: '100%' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                style={{ width: '100%', padding: '10px' }}
                aria-label="Sort silhouettes"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NEXT COLLECTION END-OF-PAGE CTA ─── */}
      {nextCollection && (
        <section className="next-collection-section">
          <div className="next-collection-card">
            <div className="next-collection-media">
              <img src={nextCollection.img} alt={nextCollection.title} loading="lazy" />
              <div className="next-collection-overlay" />
            </div>
            <div className="next-collection-content">
              <div className="next-collection-tag-wrap">
                <span className="next-collection-badge">CONTINUE BROWSING</span>
                <span className="next-collection-gender">{(nextCollection.category || 'CURATED').toUpperCase()} COLLECTION</span>
              </div>
              <h2 className="next-collection-title">
                Next: {nextCollection.title}
              </h2>
              <p className="next-collection-desc">
                {nextCollection.shortDescription || nextCollection.description || 'Consciously handcrafted luxury silhouettes, celebrating age-old artisanal techniques.'}
              </p>
              <Link
                href={`/collections/${nextCollection.handle}`}
                className="btn-next-collection"
              >
                <span>Explore {nextCollection.title}</span>
                <span className="btn-next-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        /* ── Collection Switcher Bar ── */
        .collection-switcher-bar {
          width: 100%;
          background: #FAF9F6;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          padding: 14px 6vw;
          box-sizing: border-box;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .collection-switcher-bar::-webkit-scrollbar {
          display: none;
        }
        .collection-switcher-track {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: max-content;
        }
        .switcher-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 30px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #ffffff;
          color: #222222;
          text-decoration: none;
          font-family: var(--font-body, sans-serif);
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          position: relative;
          white-space: nowrap;
        }
        .switcher-pill:hover {
          border-color: #111111;
          color: #000000;
          background: #fdfdfd;
          transform: translateY(-1px);
        }
        .switcher-pill.active {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
          font-weight: 600;
        }
        .switcher-pill.directory-pill {
          background: rgba(136, 122, 100, 0.1);
          border-color: rgba(136, 122, 100, 0.3);
          color: #72624d;
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .switcher-pill.directory-pill:hover {
          background: rgba(136, 122, 100, 0.2);
          border-color: #72624d;
          color: #111;
        }
        .switcher-pill .pill-tag {
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.65;
        }
        .switcher-pill.active .pill-tag {
          opacity: 0.85;
          color: #e5e5e5;
        }
        .pill-active-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d4af37;
          display: inline-block;
        }
        .switcher-divider {
          width: 1px;
          height: 22px;
          background: rgba(0, 0, 0, 0.12);
          margin: 0 4px;
        }

        /* ── Next Collection Card ── */
        .next-collection-section {
          padding: 80px 6vw 100px;
          background: #FAF9F6;
          box-sizing: border-box;
        }
        .next-collection-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #111111;
          color: #FAF9F6;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          min-height: 400px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .next-collection-media {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 320px;
          overflow: hidden;
        }
        .next-collection-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .next-collection-card:hover .next-collection-media img {
          transform: scale(1.04);
        }
        .next-collection-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(17,17,17,0.7) 100%);
        }
        .next-collection-content {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          z-index: 2;
        }
        .next-collection-tag-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .next-collection-badge {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.15);
          color: #FAF9F6;
          padding: 6px 14px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .next-collection-gender {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c4b59d;
        }
        .next-collection-title {
          font-family: var(--font-display, serif);
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 400;
          color: #FAF9F6;
          line-height: 1.15;
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }
        .next-collection-desc {
          font-family: var(--font-body, sans-serif);
          font-size: 1.05rem;
          color: #cccccc;
          line-height: 1.6;
          margin: 0 0 35px;
          max-width: 440px;
        }
        .btn-next-collection {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 40px;
          background: #FAF9F6;
          color: #111111;
          text-decoration: none;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-next-collection:hover {
          background: #d4af37;
          color: #000;
          transform: translateX(4px);
        }
        .btn-next-arrow {
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        .btn-next-collection:hover .btn-next-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 900px) {
          .next-collection-card {
            grid-template-columns: 1fr;
          }
          .next-collection-overlay {
            background: linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.4) 100%);
          }
          .next-collection-content {
            padding: 40px 28px;
          }
          .next-collection-section {
            padding: 50px 5vw 70px;
          }
        }

        /* ── Controls Bar ── */
        .collection-controls-bar {
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .controls-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
          flex-wrap: nowrap;
          overflow: hidden;
        }
        .controls-right {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .controls-sep {
          display: none;
          width: 1px;
          height: 18px;
          background: #d4d4d4;
          flex-shrink: 0;
        }

        /* ── Grid Toggle (hidden on desktop, shown on mobile) ── */
        .mobile-grid-toggle {
          display: none;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }
        .mobile-grid-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid #d4d4d4;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: #999;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          flex-shrink: 0;
          padding: 0;
        }
        .mobile-grid-btn.active {
          border-color: #1d1d1f;
          color: #1d1d1f;
          background: #f0f0f0;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .mobile-grid-toggle {
            display: flex;
          }
          .controls-sep {
            display: block;
          }

          /* 2-column grid */
          .collection-products-grid.mobile-2col {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: clamp(6px, 2vw, 12px) !important;
          }
          .collection-products-grid.mobile-2col .product-card-name {
            font-size: clamp(0.8rem, 3vw, 0.95rem);
            line-height: 1.3;
          }
          .collection-products-grid.mobile-2col .product-card-price {
            font-size: clamp(0.78rem, 2.8vw, 0.9rem);
            font-weight: 600;
          }
          .collection-products-grid.mobile-2col .product-card-category {
            font-size: clamp(0.52rem, 1.6vw, 0.6rem);
            letter-spacing: 0.08em;
            opacity: 0.55;
          }
        }

        /* ── Very small screens (320px) ── */
        @media (max-width: 380px) {
          .btn-filter-trigger {
            padding: 7px 10px !important;
            font-size: 10px !important;
            gap: 5px !important;
          }
          .sort-select {
            font-size: 10px !important;
            padding: 7px 20px 7px 8px !important;
          }
          .mobile-grid-btn {
            width: 26px;
            height: 26px;
          }
          .mobile-grid-btn svg {
            width: 13px;
            height: 13px;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}
