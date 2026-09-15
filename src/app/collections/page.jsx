'use client';

export const runtime = "edge";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { fetchShopifyCollections } from '../../lib/shopify/queries/collections';

const CATEGORIES = ['All', 'Women', 'Men', 'Bespoke'];

// Exact computed celestial orbit rings geometry matching Orbit Gallery Pro
const BASE_ORBIT_RINGS = [
  {
    id: "ring-1",
    dur: 85,
    spin: "cw",
    seats: [
      { id: "orbit-1-1", dx: -2.454, dy: -28.053, w: 11.44, ratio: 0.75, lean: -11, wash: "#DED6C8", src: "/assets/new_coll_1.jpg", title: "Rangrez Print Kaftan", handle: "matching-moods" },
      { id: "orbit-1-2", dx: 28.156, dy: -0.491, w: 9.838, ratio: 1, lean: 21, wash: "#C9CFC6", src: "/assets/new_coll_2.png", title: "Flow State Co-ord", handle: "flow-state" },
      { id: "orbit-1-3", dx: -1.474, dy: 28.121, w: 12.813, ratio: 0.6667, lean: 9, wash: "#E4D2C6", src: "/assets/new_coll_4.jpeg", title: "Pastel Blazer Set", handle: "power-layers" },
      { id: "orbit-1-4", dx: -28.091, dy: 1.964, w: 10.754, ratio: 0.75, lean: -14, wash: "#CFD6DE", src: "/assets/new_coll_3.png", title: "Six Yards of Good Drape", handle: "six-yards-of-good" }
    ]
  },
  {
    id: "ring-2",
    dur: 140,
    spin: "ccw",
    seats: [
      { id: "orbit-2-1", dx: 15.041, dy: -43.683, w: 10.982, ratio: 0.75, lean: 13, wash: "#E6DCC2", src: "/assets/new_coll_6.jpg", title: "Natural Luxury Shirt", handle: "natural-luxury" },
      { id: "orbit-2-2", dx: 42.836, dy: -17.307, w: 8.659, ratio: 1, lean: -7, wash: "#D5CBD6", src: "/assets/new_coll_7.jpg", title: "Block Print Shirt", handle: "printed-stories" },
      { id: "orbit-2-3", dx: 44.41, dy: 12.734, w: 12.461, ratio: 0.75, lean: 19, wash: "#C8D2CE", src: "/assets/DSC_8756.jpg", title: "Modern Classics Kurta Set", handle: "modern-classics" },
      { id: "orbit-2-4", dx: 19.525, dy: 41.871, w: 9.715, ratio: 0.6667, lean: 29, wash: "#E2CDC8", src: "/assets/new_coll_5.JPG", title: "52 Bagh Phulkari Blazer", handle: "custom-made-for-moments" },
      { id: "orbit-2-5", dx: -18.791, dy: 42.206, w: 10.56, ratio: 0.75, lean: 6, wash: "#DED6C8", src: "/assets/DSC_8356.jpg", title: "Palazzo Co-ord Set", handle: "matching-moods" },
      { id: "orbit-2-6", dx: -40.792, dy: 21.69, w: 9.082, ratio: 1, lean: -12, wash: "#C9CFC6", src: "/assets/DSC_8473.jpg", title: "Heritage Palazzo Separates", handle: "power-layers" },
      { id: "orbit-2-7", dx: -43.131, dy: -16.557, w: 11.827, ratio: 0.6667, lean: 17, wash: "#E4D2C6", src: "/assets/DSC_8791.jpg", title: "Raat Ceremonial Set", handle: "six-yards-of-good" },
      { id: "orbit-2-8", dx: -23.795, dy: -39.601, w: 9.926, ratio: 1, lean: -5, wash: "#CFD6DE", src: "/assets/DSC_8402.jpg", title: "Indigo Block Drape", handle: "printed-stories" }
    ]
  },
  {
    id: "ring-3",
    dur: 200,
    spin: "cw",
    seats: [
      { id: "orbit-3-1", dx: -1.152, dy: -65.99, w: 13.728, ratio: 0.75, lean: 10, wash: "#E6DCC2", src: "/assets/art_museum_1.jpg", title: "Bird Embroidery Studio", handle: "custom-made-for-moments" },
      { id: "orbit-3-2", dx: 35.946, dy: -55.352, w: 10.824, ratio: 1, lean: 15, wash: "#D5CBD6", src: "/assets/craft_new_1.jpg", title: "Handloom Weft Craft", handle: "natural-luxury" },
      { id: "orbit-3-3", dx: 54.716, dy: -36.907, w: 15.576, ratio: 0.75, lean: -13, wash: "#C8D2CE", src: "/assets/art_museum_2.jpg", title: "Conscious Architecture", handle: "power-layers" },
      { id: "orbit-3-4", dx: 66, dy: 0, w: 12.144, ratio: 0.6667, lean: 8, wash: "#E2CDC8", src: "/assets/craft_new_3.jpg", title: "Bespoke Evening Tailoring", handle: "matching-moods" },
      { id: "orbit-3-5", dx: 54.716, dy: 36.907, w: 13.2, ratio: 0.75, lean: -15, wash: "#DED6C8", src: "/assets/art_museum_4.jpg", title: "Fluid Drape Silhouette", handle: "flow-state" },
      { id: "orbit-3-6", dx: 35.946, dy: 55.352, w: 11.352, ratio: 1, lean: 12, wash: "#C9CFC6", src: "/assets/craft_new_4.jpg", title: "Artisanal Loom Weave", handle: "printed-stories" },
      { id: "orbit-3-7", dx: -1.152, dy: 65.99, w: 14.784, ratio: 0.6667, lean: -9, wash: "#E4D2C6", src: "/assets/art_museum_5.jpg", title: "Textile Archive Edit", handle: "six-yards-of-good" },
      { id: "orbit-3-8", dx: -37.856, dy: 54.064, w: 12.408, ratio: 1.3333, lean: 14, wash: "#CFD6DE", src: "/assets/vegan_fabric.png", title: "PETA-Approved Vegan Silk", handle: "six-yards-of-good" },
      { id: "orbit-3-9", dx: -55.971, dy: 34.975, w: 13.728, ratio: 0.75, lean: -12, wash: "#E6DCC2", src: "/assets/art_museum_3.jpg", title: "Sculptural Drape Study", handle: "flow-state" },
      { id: "orbit-3-10", dx: -65.96, dy: -2.303, w: 10.824, ratio: 1, lean: -12, wash: "#D5CBD6", src: "/assets/vegan_weave.png", title: "Pure Hemp Botanical Weave", handle: "natural-luxury" },
      { id: "orbit-3-11", dx: -59.816, dy: -27.893, w: 15.576, ratio: 0.75, lean: 7, wash: "#C8D2CE", src: "/assets/craft_new_2.jpg", title: "Natural Plant Dye Craft", handle: "printed-stories" },
      { id: "orbit-3-12", dx: -33.993, dy: -56.573, w: 12.144, ratio: 0.6667, lean: -11, wash: "#E2CDC8", src: "/assets/vegan-conscious-bg.jpg", title: "Conscious Luxury Drape", handle: "custom-made-for-moments" }
    ]
  }
];

export default function CollectionsDirectoryPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    document.title = 'COLLECTIONS | ARSHIA SINGH';
    async function load() {
      try {
        const data = await fetchShopifyCollections();
        if (data && data.length > 0) {
          setCollections(data);
        }
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCollections = collections.filter((col) => {
    if (activeTab === 'All') return true;
    return col.category === activeTab;
  });

  // Dynamically map collections into Orbit seats
  let colIndex = 0;
  const orbitRings = BASE_ORBIT_RINGS.map((ring) => ({
    ...ring,
    seats: ring.seats.map((seat) => {
      if (collections.length === 0) return seat;
      const col = collections[colIndex % collections.length];
      colIndex++;
      return {
        ...seat,
        src: col?.img || seat.src,
        title: col?.title || seat.title,
        handle: col?.handle || seat.handle,
      };
    }),
  }));

  return (
    <>
      {/* ─── ORBIT GALLERY PRO COMPONENT (CONTINUOUS UNSTOPPABLE CELESTIAL SPIN) ─── */}
      <section className="orbit-stage">
        {/* Ambient radial halo vignette */}
        <div className="orbit-halo" aria-hidden="true" />

        {/* 3 Concentric Orbital Bands (Always spinning without pause) */}
        {orbitRings.map((ring, ringIdx) => {
          const isCcw = ring.spin === 'ccw';

          return (
            <div
              key={ring.id}
              className={`orbit-band ${isCcw ? 'orbit-ccw' : ''}`}
              style={{
                '--dur': `${ring.dur}s`,
                zIndex: ringIdx + 1,
              }}
            >
              {ring.seats.map((seat) => {
                const heightCqmin = Number((seat.w / seat.ratio).toFixed(3));

                return (
                  <div
                    key={seat.id}
                    className="orbit-seat"
                    style={{
                      '--dx': seat.dx,
                      '--dy': seat.dy,
                      '--w': seat.w,
                      '--h': heightCqmin,
                      '--ratio': seat.ratio,
                      aspectRatio: String(seat.ratio),
                    }}
                  >
                    <div
                      className={`orbit-hold ${isCcw ? 'orbit-ccw' : ''}`}
                      style={{ '--dur': `${ring.dur}s` }}
                    >
                      <Link
                        href={`/collections/${seat.handle}`}
                        className="orbit-plate"
                        style={{ '--lean': `${seat.lean}deg` }}
                        title={seat.title || 'Explore Collection'}
                      >
                        <div
                          className="orbit-inner"
                          style={{ '--wash': seat.wash }}
                        >
                          <img
                            className="orbit-media"
                            src={seat.src}
                            alt={seat.title || 'Arshia Singh Product'}
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Centerpiece (Exact typography structure from Orbit Gallery Pro) */}
        <div className="orbit-center">
          <div className="orbit-col">
            <div className="orbit-kicker">ARCHIVE &amp; EDITIONS</div>
            <h1 className="orbit-line-1">A world of craft,</h1>
            <h2 className="orbit-line-2">in one view</h2>
            <p className="orbit-footnote">
              Every piece we've shipped, still turning.
            </p>
          </div>
        </div>

        {/* Explore Full Catalog smooth scroll button */}
        <a href="#directory" className="orbit-scroll-hint">
          <span>Explore All Collections ↓</span>
        </a>
      </section>

      {/* ─── MODERN SPACE-EFFICIENT COLLECTIONS DIRECTORY ─── */}
      <section className="collections-dir-section" id="directory">
        <div className="collections-dir-container">
          
          {/* Top Bar: Minimalist Title, Category Pills, View Mode Switcher */}
          <div className="collections-dir-topbar">
            <div className="collections-dir-title-box">
              <span className="collections-dir-kicker">CURATED INDEX</span>
              <h3 className="collections-dir-heading">Select Edition</h3>
            </div>

            {/* Category Filter Pills */}
            <div className="collections-tabs" role="tablist" aria-label="Collection Categories">
              {CATEGORIES.map((cat) => {
                const count = cat === 'All' 
                  ? collections.length 
                  : collections.filter((c) => c.category === cat).length;
                const isActive = activeTab === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(cat)}
                    className={`collections-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="tab-label">{cat}</span>
                    <span className="tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle (Grid / Index List) */}
            <div className="collections-view-switcher">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Grid View"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" />
                </svg>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Index List View"
                aria-label="Index List View"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="2.5" rx="1" />
                  <rect x="1" y="6.75" width="14" height="2.5" rx="1" />
                  <rect x="1" y="11.5" width="14" height="2.5" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          {/* ─── VIEW 1: MODERN COMPACT GRID ─── */}
          {viewMode === 'grid' && (
            <div className="collections-compact-grid">
              {filteredCollections.map((col) => (
                <Link
                  key={col.handle}
                  href={`/collections/${col.handle}`}
                  className="collection-compact-card"
                >
                  <div className="compact-media-box">
                    <img src={col.img} alt={col.title} loading="lazy" />
                    <div className="compact-overlay" />
                    <span className="compact-category-tag">{col.category}</span>
                  </div>
                  <div className="compact-info-box">
                    <div className="compact-title-row">
                      <h4 className="compact-title">{col.title}</h4>
                      <span className="compact-arrow">→</span>
                    </div>
                    <p className="compact-subtitle">{col.shortDescription || col.description || 'Conscious Luxury Collection'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ─── VIEW 2: ULTRA-SLEEK EDITORIAL INDEX LIST ─── */}
          {viewMode === 'list' && (
            <div className="collections-index-list">
              {filteredCollections.map((col) => (
                <Link
                  key={col.handle}
                  href={`/collections/${col.handle}`}
                  className="collection-index-row"
                >
                  <div className="index-col-thumb">
                    <img src={col.img} alt={col.title} loading="lazy" />
                  </div>
                  <div className="index-col-main">
                    <h4 className="index-title">{col.title}</h4>
                    <p className="index-subtitle">{col.shortDescription || col.description || 'Conscious Luxury Collection'}</p>
                  </div>
                  <span className="index-col-category">{col.category}</span>
                  <span className="index-col-cta">
                    Explore <span className="arrow">→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      <style jsx global>{`
        /* ─── Geist Typography & Font Declarations ─── */
        @font-face {
          font-family: 'Geist';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOMImpna.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Geist Mono';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KK5U5Ck.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Geist Pixel';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/geistpixel/v1/CSRs4zxZluGGW3oyI0A_AN0hQBvYDU4hBmqoKzA8XT6i.woff2) format('woff2');
        }

        /* ─── Orbit Gallery Pro Root Stage (CONTINUOUS SPIN) ─── */
        .orbit-stage {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          max-height: 1080px;
          background: #FFFFFF;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-user-select: none;
          container-type: size;
        }

        /* Radial Vignette Halo */
        .orbit-halo {
          position: absolute;
          inset: 0;
          background: radial-gradient(farthest-side at 50% 50%, rgba(0,0,0,0) 76%, #FFFFFF 100%);
          pointer-events: none;
          z-index: 30;
        }

        /* Orbital Bands (Continuous unpausing rotation) */
        .orbit-band {
          position: absolute;
          inset: 0;
          animation-name: orbitSpinCw;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--dur, 85s);
          will-change: transform;
        }

        .orbit-band.orbit-ccw {
          animation-name: orbitSpinCcw;
        }

        /* Card Seat on Orbit */
        .orbit-seat {
          position: absolute;
          left: calc(50% + var(--dx) * 1cqmin);
          top: calc(50% + var(--dy) * 1cqmin);
          width: calc(var(--w) * 1cqmin);
          height: calc(var(--h) * 1cqmin);
          aspect-ratio: var(--ratio);
          transform: translate(-50%, -50%);
          pointer-events: auto;
        }

        /* Card Hold (Counter-Rotation to keep card upright) */
        .orbit-hold {
          position: absolute;
          inset: 0;
          animation-name: orbitSpinCcw;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--dur, 85s);
          will-change: transform;
        }

        .orbit-hold.orbit-ccw {
          animation-name: orbitSpinCw;
        }

        /* Card Plate (Tilt, Border Radius, Elevation, Lift) */
        .orbit-plate {
          position: absolute;
          inset: 0;
          display: block;
          border-radius: 10px;
          padding: 0px;
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(24, 20, 16, 0.054), 0 12px 22px rgba(24, 20, 16, 0.120);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transform: rotate(var(--lean, 0deg));
          transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.55s ease;
          cursor: pointer;
        }

        /* On plate hover: gentle scale lift without stopping orbital rotation */
        .orbit-plate:hover {
          transform: rotate(var(--lean, 0deg)) scale(1.08) !important;
          box-shadow: 0 1px 2px rgba(24, 20, 16, 0.060), 0 24px 42px rgba(24, 20, 16, 0.162) !important;
          z-index: 50;
        }

        /* Inner Plate Container */
        .orbit-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
          background: var(--wash, #DED6C8);
        }

        /* Media */
        .orbit-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .orbit-plate:hover .orbit-media {
          transform: scale(1.05);
        }

        /* Center Typography Display */
        .orbit-center {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 40;
          padding: 6%;
          pointer-events: none;
        }

        .orbit-col {
          text-align: center;
          max-width: 62cqmin;
        }

        .orbit-kicker {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: min(12px, 1.333cqmin);
          font-weight: 400;
          letter-spacing: 0.18em;
          line-height: 1.4em;
          text-transform: uppercase;
          color: #7A6E5C;
          margin-bottom: min(16px, 1.8cqmin);
        }

        .orbit-line-1 {
          font-family: 'Geist Pixel', 'Times New Roman', serif;
          font-size: min(54px, 6cqmin);
          font-weight: 400;
          line-height: 1.06em;
          letter-spacing: -0.02em;
          color: #141210;
          margin: 0;
        }

        .orbit-line-2 {
          font-family: 'Geist Pixel', 'Times New Roman', serif;
          font-size: min(54px, 6cqmin);
          font-weight: 400;
          line-height: 1.02em;
          letter-spacing: -0.02em;
          color: #141210;
          margin: 0;
        }

        .orbit-footnote {
          font-family: 'Geist Mono', monospace;
          font-size: min(15px, 1.667cqmin);
          font-weight: 400;
          line-height: 1.5em;
          letter-spacing: 0em;
          color: #6B6154;
          margin: min(18px, 2cqmin) 0 0;
        }

        /* Floating Pill Button to Scroll to Directory */
        .orbit-scroll-hint {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7A6E5C;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(122, 110, 92, 0.22);
          padding: 8px 20px;
          border-radius: 30px;
          pointer-events: auto;
          z-index: 45;
          transition: all 0.3s ease;
        }

        .orbit-scroll-hint:hover {
          background: #141210;
          color: #FAF9F6;
          border-color: #141210;
          transform: translateX(-50%) translateY(-2px);
        }

        /* Continuous CSS Rotation Keyframes */
        @keyframes orbitSpinCw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitSpinCcw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit-band, .orbit-hold {
            animation: none !important;
          }
          .orbit-plate {
            transition: none !important;
          }
        }

        /* Fallback for browsers without container-type */
        @supports not (container-type: size) {
          .orbit-seat {
            left: calc(50% + var(--dx) * 1vmin);
            top: calc(50% + var(--dy) * 1vmin);
            width: calc(var(--w) * 1vmin);
            height: calc(var(--h) * 1vmin);
          }
          .orbit-col {
            max-width: 62vmin;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .orbit-stage {
            min-height: 560px;
          }
          .orbit-col {
            max-width: 80cqmin;
          }
          .orbit-line-1, .orbit-line-2 {
            font-size: min(34px, 7.5cqmin);
          }
          .orbit-seat {
            width: calc(var(--w) * 1.35 * 1cqmin);
            height: calc(var(--h) * 1.35 * 1cqmin);
          }
        }

        /* ─── MODERN SPACE-EFFICIENT COLLECTIONS DIRECTORY ─── */
        .collections-dir-section {
          padding: 50px 5vw 90px;
          background: #FAF9F6;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .collections-dir-container {
          max-width: 1440px;
          margin: 0 auto;
        }

        /* Top Bar */
        .collections-dir-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 28px;
          margin-bottom: 34px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .collections-dir-title-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .collections-dir-kicker {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8C7D6B;
          font-weight: 500;
        }

        .collections-dir-heading {
          font-family: var(--font-display, serif);
          font-size: 26px;
          color: #111111;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Category Filter Tabs */
        .collections-tabs {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ECE7DE;
          padding: 4px;
          border-radius: 40px;
        }

        .collections-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 30px;
          border: none;
          background: transparent;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555555;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .collections-tab-btn:hover {
          color: #111111;
        }

        .collections-tab-btn.active {
          background: #111111;
          color: #FAF9F6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .tab-count {
          font-size: 9px;
          opacity: 0.75;
        }

        .collections-tab-btn.active .tab-count {
          opacity: 0.9;
        }

        /* View Mode Switcher */
        .collections-view-switcher {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ECE7DE;
          padding: 3px;
          border-radius: 8px;
        }

        .view-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: none;
          background: transparent;
          color: #666666;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          color: #111111;
        }

        .view-btn.active {
          background: #FFFFFF;
          color: #111111;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        /* ─── VIEW 1: MODERN COMPACT CARDS GRID ─── */
        .collections-compact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .collection-compact-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.07);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .collection-compact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(24, 20, 16, 0.09);
        }

        .compact-media-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          background: #EAE5DC;
        }

        .compact-media-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .collection-compact-card:hover .compact-media-box img {
          transform: scale(1.06);
        }

        .compact-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(17, 17, 17, 0.35) 0%, transparent 60%);
          pointer-events: none;
        }

        .compact-category-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 4px 9px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border-radius: 14px;
          color: #111111;
          font-weight: 600;
        }

        .compact-badge-pill {
          position: absolute;
          top: 10px;
          right: 10px;
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 8px;
          background: rgba(20, 18, 16, 0.85);
          color: #FAF9F6;
          border-radius: 12px;
          font-weight: 500;
        }

        .compact-number {
          position: absolute;
          bottom: 10px;
          left: 12px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #FAF9F6;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .compact-info-box {
          padding: 16px 16px 14px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .compact-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }

        .compact-title {
          font-family: var(--font-display, serif);
          font-size: 17px;
          font-weight: 500;
          color: #111111;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .compact-arrow {
          font-size: 14px;
          color: #8C7D6B;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        .collection-compact-card:hover .compact-arrow {
          transform: translateX(4px);
          color: #111111;
        }

        .compact-subtitle {
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: #666666;
          line-height: 1.45;
          margin: 0 0 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }

        .compact-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .compact-pieces {
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8C7D6B;
        }

        .compact-cta-text {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #111111;
          font-weight: 600;
        }

        /* ─── VIEW 2: ULTRA-SLEEK EDITORIAL INDEX LIST ─── */
        .collections-index-list {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .collection-index-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 14px 22px;
          text-decoration: none;
          color: inherit;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: background 0.2s ease;
        }

        .collection-index-row:last-child {
          border-bottom: none;
        }

        .collection-index-row:hover {
          background: #FAF8F4;
        }

        .index-col-num {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #8C7D6B;
          width: 30px;
          font-weight: 600;
        }

        .index-col-thumb {
          width: 54px;
          height: 54px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #EAE5DC;
        }

        .index-col-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
        }

        .collection-index-row:hover .index-col-thumb img {
          transform: scale(1.08);
        }

        .index-col-main {
          flex: 1;
          min-width: 0;
        }

        .index-title {
          font-family: var(--font-display, serif);
          font-size: 16px;
          font-weight: 500;
          color: #111111;
          margin: 0 0 3px;
        }

        .index-subtitle {
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: #666666;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .index-col-category {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #111111;
          font-weight: 600;
          width: 90px;
        }

        .index-col-badge {
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.05);
          color: #444;
          border-radius: 12px;
          width: 85px;
          text-align: center;
        }

        .index-col-pieces {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: #8C7D6B;
          width: 95px;
          text-align: right;
        }

        .index-col-cta {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #111111;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 10px;
          transition: gap 0.2s ease;
        }

        .collection-index-row:hover .index-col-cta {
          gap: 10px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .collections-compact-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 860px) {
          .collections-compact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .collections-dir-topbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .collections-tabs {
            width: 100%;
            overflow-x: auto;
          }
          .index-col-badge, .index-col-pieces {
            display: none;
          }
        }

        @media (max-width: 540px) {
          .collections-compact-grid {
            grid-template-columns: 1fr;
          }
          .collections-dir-section {
            padding: 35px 5vw 70px;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}
