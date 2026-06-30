'use client';

export const runtime = "edge";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../../../components/Footer';
import { products } from '../../../data/products-data';

// Map URL slugs → product category strings & page metadata
const CATEGORY_MAP = {
  'matching-moods': {
    title: 'Matching Moods',
    subtitle: 'Elegantly Tailored Co-ord & Blazer Sets',
    heroImg: '/assets/new_coll_2.png',
    categoryKey: 'matching moods',
    description: 'Effortless coordination for every version of you. Thoughtfully designed co-ord sets that bring together comfort, confidence, and conscious luxury in perfect harmony.',
  },
  'flow-state': {
    title: 'Flow State',
    subtitle: 'Effortless Kaftans & Fluid Silhouettes',
    heroImg: '/assets/new_coll_5.JPG',
    categoryKey: 'flow state',
    description: 'Designed to move with you. Our kaftans combine fluid silhouettes, breathable fabrics, and timeless elegance for moments of ease, travel, and everyday luxury.',
  },
  'power-layers': {
    title: 'Power Layers',
    subtitle: 'Statement Blazers & Outer Layers',
    heroImg: '/assets/new_coll_3.png',
    categoryKey: 'power layers',
    description: 'Structured yet mindful. From tailored blazers to statement jackets, these versatile layers are crafted to elevate your wardrobe while reflecting conscious craftsmanship.',
  },
  'six-yards-of-good': {
    title: 'Six Yards of Good',
    subtitle: 'Printed & Embroidered Saree Editions',
    heroImg: '/assets/new_coll_1.jpg',
    categoryKey: '6 yards of good',
    description: 'Traditional artistry meets modern values. Our sarees celebrate Indian heritage through handcrafted details, luxurious vegan fabrics, and timeless design.',
  },
  'custom-made-for-moments': {
    title: 'Custom Made for Moments',
    subtitle: 'Bespoke Bridal, Groom & Occasion Wear',
    heroImg: '/assets/new_coll_6.jpg',
    categoryKey: 'custom made',
    description: 'Created exclusively for you. From personalised fits to bespoke designs, our custom-made pieces honour individuality while embracing conscious fashion.',
  },
  'natural-luxury': {
    title: 'Natural Luxury',
    subtitle: 'Hemp & Muslin Essentials for Him',
    heroImg: '/assets/new_coll_6.jpg',
    categoryKey: 'natural luxury',
    description: 'Elevated essentials crafted from premium natural and vegan fabrics. Thoughtfully tailored shirts and separates designed for comfort, sophistication, and everyday refinement.',
  },
  'printed-stories': {
    title: 'Printed Stories',
    subtitle: 'Digital Print Drop-Shoulder Shirts',
    heroImg: '/assets/new_coll_7.jpg',
    categoryKey: 'printed stories',
    description: 'Wearable narratives inspired by culture, craftsmanship, and creativity. Each printed shirt brings together artistic expression and conscious design.',
  },
  'modern-classics': {
    title: 'Modern Classics',
    subtitle: 'Phulkari Nehru Jackets & Heritage Shirts',
    heroImg: '/assets/new_coll_3.png',
    categoryKey: 'modern classics',
    description: 'Timeless menswear reimagined. Featuring Nehru jackets and handcrafted Phulkari details, these pieces honour tradition while embracing a contemporary aesthetic.',
  },
};

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.category || '';
  const meta = CATEGORY_MAP[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'COLLECTION EDITION',
    heroImg: '/assets/new_coll_3.png',
    categoryKey: slug,
    description: 'Explore our premium luxury garment edits, meticulously constructed with organic fabrics, artisanal details, and conscious vegan manufacturing.',
  };

  const filteredByCategory = products.filter(
    (p) => p.category && p.category.toLowerCase() === meta.categoryKey.toLowerCase()
  );

  // States
  const [layoutMode, setLayoutMode] = useState('studio'); // 'studio' (3-col) vs 'editorial' (2-col)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedPrints, setSelectedPrints] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  // Dynamic filter options extraction
  const fabricsList = Array.from(new Set(filteredByCategory.map(p => p.fabric?.trim()).filter(Boolean)));
  const componentsList = Array.from(new Set(filteredByCategory.map(p => p.components?.trim()).filter(Boolean)));
  const printsList = Array.from(new Set(filteredByCategory.map(p => p.print?.trim()).filter(p => p && p !== 'N/A')));

  // Filter application
  let displayProducts = filteredByCategory.filter(product => {
    if (selectedFabrics.length > 0 && !selectedFabrics.includes(product.fabric?.trim())) return false;
    if (selectedComponents.length > 0 && !selectedComponents.includes(product.components?.trim())) return false;
    if (selectedPrints.length > 0 && !selectedPrints.includes(product.print?.trim())) return false;
    return true;
  });

  // Price formatting and parsing helper
  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'N/A' || priceStr === 'Price on Request') return 0;
    const sanitized = priceStr.replace(/[^\d]/g, '');
    return parseInt(sanitized, 10) || 0;
  };

  const formatPrice = (price) => {
    if (!price || price === 'N/A' || price === 'Price on Request') return 'Price on Request';
    return `₹${price.replace('/-', '').replace('₹', '').replace(',', ',').trim()}`;
  };

  // Sorting application
  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === 'alphabetical') {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Animation triggers
  useEffect(() => {
    document.title = `${meta.title.toUpperCase()} | ARSHIA SINGH`;
    
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ force3D: true });
    
    const cards = document.querySelectorAll('.product-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.collection-products-grid',
            start: 'top 90%',
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [slug, selectedFabrics, selectedComponents, selectedPrints, sortBy, layoutMode]);

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
    setSelectedFabrics([]);
    setSelectedComponents([]);
    setSelectedPrints([]);
    setSortBy('default');
  };

  const activeFiltersCount = selectedFabrics.length + selectedComponents.length + selectedPrints.length;

  return (
    <>
      {/* ─── MINIMALIST PREMIUM HERO ─── */}
      <section className="collection-hero">
        <div className="collection-hero-container">
          <div className="collection-hero-content">
            <span className="collection-hero-subtitle">{meta.subtitle}</span>
            <h1 className="collection-hero-title">{meta.title}</h1>
            <p className="collection-hero-desc">{meta.description}</p>
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
                <path d="M1 2.5H13M3.5 6H10.5M5.5 9.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
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
        <div className="controls-right">
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
            <p>No silhouettes match your current filter selections.</p>
            <button className="btn-primary" onClick={clearAllFilters}>Reset Filters</button>
          </div>
        ) : (
          displayProducts.map((product) => {
            const productSlug = makeSlug(product.name);
            return (
              <Link 
                href={`/product/${productSlug}`} 
                key={product.name} 
                className="product-card"
              >
                <div className="product-card-image-wrap">
                  <img src={product.img} alt={product.name} loading="lazy" />
                  <div className="product-card-overlay">
                    <span className="btn-card-quick-view">
                      View Silhouette
                    </span>
                  </div>
                </div>
                <div className="product-card-info">
                  <h3 className="product-card-name">{product.name.toUpperCase()}</h3>
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
          <h2>Filter Collection</h2>
          <button className="btn-close-filters" onClick={() => setIsFilterOpen(false)}>×</button>
        </div>
        <div className="filters-body">
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
                    <span>{comp} Piece set</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {printsList.length > 0 && (
            <div className="filter-group">
              <div className="filter-group-title">Prints / Craft Styles</div>
              <div className="filter-options">
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
