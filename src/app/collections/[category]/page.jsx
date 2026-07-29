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
    case 'alphabetical':
      return { sortKey: 'TITLE', reverse: false };
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
  const [productsList, setProductsList] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Layout & Filter States
  const [layoutMode] = useState('studio'); // 'studio' (3-col)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const sentinelRef = useRef(null);

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

  // Extract dynamic filter lists from fetched collection products
  const fabricsList = Array.from(new Set(productsList.map(p => p.fabric?.trim()).filter(Boolean))).sort();
  const componentsList = Array.from(new Set(productsList.map(p => p.components?.trim()).filter(Boolean))).sort();

  // Client-side filter application for Fabrics & Components
  const displayProducts = productsList.filter(product => {
    if (selectedFabrics.length > 0 && !selectedFabrics.includes(product.fabric?.trim())) return false;
    if (selectedComponents.length > 0 && !selectedComponents.includes(product.components?.trim())) return false;
    return true;
  });

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
  }, [slug, collectionInfo.title, selectedFabrics, selectedComponents, sortBy, productsList.length]);

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedFabrics([]);
    setSelectedComponents([]);
    setSortBy('default');
  };

  const activeFiltersCount = selectedFabrics.length + selectedComponents.length;
  const displayTitle = collectionInfo.title || slug.replace(/-/g, ' ').toUpperCase();

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

      {/* ─── DYNAMIC UTILITY CONTROLS BAR ─── */}
      <div className="collection-controls-bar">
        <div className="controls-left">
          <button className="btn-filter-trigger" onClick={() => setIsFilterOpen(true)}>
            <span>Filters</span>
            {activeFiltersCount > 0 ? (
              <span className="filter-count">{activeFiltersCount}</span>
            ) : (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 2.5H13M3.5 6H10.5M5.5 9.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <div className="active-filters-summary">
              {selectedFabrics.map(f => (
                <div key={f} className="active-filter-pill">
                  <span>{f}</span>
                  <button onClick={() => toggleFilter(selectedFabrics, setSelectedFabrics, f)}>×</button>
                </div>
              ))}
              {selectedComponents.map(c => (
                <div key={c} className="active-filter-pill">
                  <span>{c} Piece Set</span>
                  <button onClick={() => toggleFilter(selectedComponents, setSelectedComponents, c)}>×</button>
                </div>
              ))}
              <button className="btn-clear-all" onClick={clearAllFilters}>Clear All</button>
            </div>
          )}
        </div>
        <div className="controls-right">
          <div className="sort-select-wrapper">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Collection Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="alphabetical">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT GRID ─── */}
      <section className={`collection-products-grid grid-${layoutMode}`}>
        {loading ? (
          <div className="collection-loading-state" style={{ gridColumn: '1 / -1', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', padding: '100px 0', fontSize: '13px', color: '#666' }}>
            Loading Collection Silhouettes...
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="collection-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              No products found matching your selected filters.
            </p>
            <button className="btn-primary" onClick={clearAllFilters} style={{ padding: '12px 24px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          displayProducts.map((product, idx) => (
            <Link
              href={`/products/${product.handle}`}
              key={product.id ? `${product.id}-${idx}` : `${product.handle}-${idx}`}
              className="product-card"
            >
              <div className="product-card-image-wrap">
                <img src={product.img} alt={product.altText || product.name} loading="lazy" />
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
                      e.preventDefault();
                      e.stopPropagation();
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
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
                <div className="product-card-meta">
                  <span className="product-card-fabric">{product.fabric?.toUpperCase() || 'PREMIUM'}</span>
                  <span className="product-card-price">{product.price}</span>
                </div>
              </div>
            </Link>
          ))
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
          {/* Fabrics Filter */}
          {fabricsList.length > 0 && (
            <div className="filter-group">
              <div className="filter-group-title">Fabrics</div>
              <div className="filter-options">
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

          {/* Components Filter */}
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
        </div>
      </div>

      <Footer />
    </>
  );
}
