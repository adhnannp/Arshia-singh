'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../components/Footer';
import { fetchShopifyTestimonials } from '../lib/shopify/queries/testimonials';

const VEGAN_BGS = [
  "/assets/art_museum_1.jpg",
  "/assets/art_museum_3.jpg",
  "/assets/art_museum_4.jpg",
  "/assets/art_museum_2.jpg",
  "/assets/art_museum_5.jpg"
];

const getLinkForImage = (src) => {
  if (src.includes('new_coll_1.jpg')) return '/products/rangrez-print-kaftan';
  if (src.includes('new_coll_2.png')) return '/products/ravel-print-dhoti-skirt-blazer-set';
  if (src.includes('IMG-20260903-WA0000.webp')) return '/products/linen-short-dress';
  if (src.includes('IMG-20260903-WA0002.webp')) return '/products/linen-shirt-skirt-se';
  if (src.includes('new_coll_3.png')) return '/products/raat-print-skirt-jacket-set';
  if (src.includes('new_coll_4.jpeg')) return '/products/pastel-embroidery-white-blazer-set';
  if (src.includes('new_coll_5.JPG')) return '/products/52-bagh-phulkari-blazer-set';
  if (src.includes('new_coll_6.jpg')) return '/products/libaas-drop-shoulder-shirt';
  if (src.includes('new_coll_7.jpg')) return '/products/block-print-drop-shoulder-shirt';

  if (src.includes('DSC_8756.jpg')) return '/products/ravel-waist-coat-pant-set';
  if (src.includes('DSC_8356.jpg')) return '/products/block-print-palazzo-co-ord';
  if (src.includes('DSC_8473.jpg')) return '/products/block-print-palazzo-co-ord';
  if (src.includes('DSC_8791.jpg')) return '/products/raat-print-skirt-jacket-set';
  if (src.includes('DSC_8402.jpg')) return '/products/block-print-palazzo-co-ord';

  return '/discover';
};

const MOOD_LOOKS = [
  { id: 1, src: "/assets/new_coll_1.jpg", title: "Rangrez Print Kaftan" },
  { id: 2, src: "/assets/new_coll_2.png", title: "Ravel Print Dhoti Skirt Set" },
  { id: 3, src: "/assets/new_coll_3.png", title: "Raat Print Skirt Jacket Set" },
  { id: 4, src: "/assets/new_coll_4.jpeg", title: "Pastel Embroidery Blazer Set" },
  { id: 5, src: "/assets/new_coll_5.JPG", title: "52 Bagh Phulkari Blazer Set" },
  { id: 6, src: "/assets/new_coll_6.jpg", title: "Libaas Drop Shoulder Shirt" },
  { id: 7, src: "/assets/new_coll_7.jpg", title: "Block Print Drop Shoulder Shirt" },
  { id: 8, src: "/assets/DSC_8756.jpg", title: "Ravel Waist Coat Pant Set" },
  { id: 9, src: "/assets/DSC_8356.jpg", title: "Block Print Palazzo Co-ord" },
  { id: 10, src: "/assets/DSC_8473.jpg", title: "Heritage Palazzo Ensemble" },
  { id: 11, src: "/assets/DSC_8791.jpg", title: "Raat Print Skirt Set" },
  { id: 12, src: "/assets/DSC_8402.jpg", title: "Artisanal Block Print Co-ord" },
];

export default function HomePage() {
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [patrons, setPatrons] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveTestimonial(null);
      }
    };
    if (activeTestimonial) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTestimonial]);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await fetchShopifyTestimonials();
        if (data && data.length > 0) {
          setPatrons(data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    }
    loadTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % VEGAN_BGS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setCurrentMoodIndex((prev) => (prev === MOOD_LOOKS.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      setCurrentMoodIndex((prev) => (prev === 0 ? MOOD_LOOKS.length - 1 : prev - 1));
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ force3D: true });

    // Hero entrance
    const tl = gsap.timeline();
    tl.from('.cinematic-overlay', { opacity: 0, duration: 2, ease: 'power2.inOut' })
      .fromTo('.cinematic-title', { y: 150, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out' }, '-=1')
      .from('.cinematic-meta', { y: 20, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.2')
      .from('.cinematic-subtitle', { y: 20, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')
      .from('.cinematic-ctas', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');

    // Hero parallax
    gsap.to('.cinematic-bg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
    gsap.to('.cinematic-content', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });

    // Parallax columns on desktop
    if (window.innerWidth >= 1024) {
      const galleryTrigger = { trigger: '.parallax-gallery', start: 'top bottom', end: 'bottom top', scrub: 1.5 };
      gsap.fromTo('#pcol1', { y: 0 }, { y: '200vh', ease: 'none', scrollTrigger: galleryTrigger });
      gsap.fromTo('#pcol2', { y: 0 }, { y: '330vh', ease: 'none', scrollTrigger: galleryTrigger });
      gsap.fromTo('#pcol3', { y: 0 }, { y: '125vh', ease: 'none', scrollTrigger: galleryTrigger });
      gsap.fromTo('#pcol4', { y: 0 }, { y: '300vh', ease: 'none', scrollTrigger: galleryTrigger });
    }

    // Founder quote word animation
    const quote = document.querySelector('.quote-text');
    if (quote && !quote.dataset.split) {
      quote.dataset.split = 'true';
      const rawText = quote.innerText;
      const wordsText = rawText.trim().split(/\s+/);
      quote.innerHTML = '';
      wordsText.forEach((word) => {
        const span = document.createElement('span');
        span.innerText = word + '\u00A0';
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(10px)';
        quote.appendChild(span);
      });
      gsap.to('.quote-text span', { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.founder-quote', start: 'top 70%' } });
    }

    // Fade-ups
    document.querySelectorAll('.fade-up').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Marquee setup
    const setupMarquee = (selector, duration, direction = -1) => {
      document.querySelectorAll(selector).forEach(track => {
        track.innerHTML += track.innerHTML;
        const anim = direction === -1
          ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration, ease: 'none', repeat: -1 })
          : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration, ease: 'none', repeat: -1 });
        ScrollTrigger.create({ trigger: track, start: 'top bottom', end: 'bottom top', onEnter: () => anim.play(), onLeave: () => anim.pause(), onEnterBack: () => anim.play(), onLeaveBack: () => anim.pause() });
      });
    };
    setupMarquee('.keyword-marquee .marquee-track', 35, -1);
    setupMarquee('.collection-ticker .ticker-track', 25, -1);

    // Collection progress bar
    const grid = document.querySelector('.editorial-grid');
    const progressBar = document.querySelector('.progress-bar');
    if (grid && progressBar) {
      grid.addEventListener('scroll', () => {
        const progress = (grid.scrollLeft / (grid.scrollWidth - grid.clientWidth)) * 100;
        progressBar.style.width = `${progress}%`;
      });
    }

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section hero cinematic-hero" id="hero">
        <div className="hero-bg cinematic-bg">
          <img src="/assets/hero_bg_video.webp" alt="Background" className="cinematic-video" />
          <div className="cinematic-overlay"></div>
        </div>
        <div className="hero-content cinematic-content">
          <div className="hero-meta fade-up cinematic-meta"><span>INDIA</span></div>
          <div className="title-wrapper">
            <h1 className="hero-title cinematic-title">ARSHIA SINGH</h1>
          </div>
          <p className="hero-subtitle italic fade-up cinematic-subtitle">Where Craftsmanship Meets Consciousness.</p>
          <div className="hero-ctas fade-up cinematic-ctas">
            <Link href="/collections" className="btn-primary cinematic-btn">Enter the Collection</Link>
            <Link href="/story" className="btn-secondary cinematic-btn-outline">Discover the Story</Link>
          </div>
        </div>
      </section>

      {/* ─── WEAR YOUR MOOD — Parallax Gallery ─── */}
      <section className="parallax-mood-section">
        <div className="parallax-mood-header">
          <h2 className="display parallax-mood-title">WEAR YOUR MOOD</h2>
        </div>
        <div className="parallax-gallery" id="parallax-gallery">
          <div className="parallax-col parallax-col-1" id="pcol1"><div className="pcol-inner">
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_1.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_1.jpg" alt="Look 1" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_2.png')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_2.png" alt="Look 2" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/DSC_8756.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/DSC_8756.jpg" alt="Look 3" />
              </Link>
            </div>
          </div></div>
          <div className="parallax-col parallax-col-2" id="pcol2"><div className="pcol-inner">
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_3.png')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_3.png" alt="Look 4" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_4.jpeg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_4.jpeg" alt="Look 5" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/DSC_8356.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/DSC_8356.jpg" alt="Look 6" />
              </Link>
            </div>
          </div></div>
          <div className="parallax-col parallax-col-3" id="pcol3"><div className="pcol-inner">
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_5.JPG')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_5.JPG" alt="Look 7" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_6.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_6.jpg" alt="Look 8" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/DSC_8473.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/DSC_8473.jpg" alt="Look 9" />
              </Link>
            </div>
          </div></div>
          <div className="parallax-col parallax-col-4" id="pcol4"><div className="pcol-inner">
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/new_coll_7.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/new_coll_7.jpg" alt="Look 10" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/DSC_8791.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/DSC_8791.jpg" alt="Look 11" />
              </Link>
            </div>
            <div className="pcol-img-wrap">
              <Link href={getLinkForImage('/assets/DSC_8402.jpg')} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src="/assets/DSC_8402.jpg" alt="Look 12" />
              </Link>
            </div>
          </div></div>
        </div>

        {/* Mobile View: Intuitive Sequential Lookbook Carousel */}
        <div className="mood-mobile-carousel">
          <div className="mood-carousel-header">
            <span className="mood-carousel-kicker">
              LOOK {String(currentMoodIndex + 1).padStart(2, '0')} OF {String(MOOD_LOOKS.length).padStart(2, '0')}
            </span>
            <div className="mood-carousel-controls">
              <button
                type="button"
                className="mood-nav-btn prev"
                onClick={() => setCurrentMoodIndex((prev) => (prev === 0 ? MOOD_LOOKS.length - 1 : prev - 1))}
                aria-label="Previous Look"
              >
                ←
              </button>
              <button
                type="button"
                className="mood-nav-btn next"
                onClick={() => setCurrentMoodIndex((prev) => (prev === MOOD_LOOKS.length - 1 ? 0 : prev + 1))}
                aria-label="Next Look"
              >
                →
              </button>
            </div>
          </div>

          <div
            className="mood-carousel-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Link
              href={getLinkForImage(MOOD_LOOKS[currentMoodIndex].src)}
              className="mood-slide-link"
            >
              <div className="mood-slide-img-wrap">
                <img
                  src={MOOD_LOOKS[currentMoodIndex].src}
                  alt={MOOD_LOOKS[currentMoodIndex].title}
                />
                <div className="mood-slide-tag">
                  LOOK {String(currentMoodIndex + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="mood-slide-info">
                <span className="mood-slide-name">{MOOD_LOOKS[currentMoodIndex].title}</span>
                <span className="mood-slide-cta">View Silhouette →</span>
              </div>
            </Link>
          </div>

          <div className="mood-carousel-pills">
            {MOOD_LOOKS.map((look, idx) => (
              <button
                key={look.id}
                type="button"
                className={`mood-pill-dot${idx === currentMoodIndex ? ' active' : ''}`}
                onClick={() => setCurrentMoodIndex(idx)}
                aria-label={`Go to look ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="parallax-mood-body">
          <p className="italic">&ldquo;In a world that constantly shifts, what you choose to wear remains entirely yours. It is a personal decision, an individual expression, a quiet form of power.&rdquo;</p>
        </div>
      </section>

      {/* ─── THE CRAFT ─── */}
      <section className="section the-craft" id="the-craft">
        <div className="sidebar-label left">CRAFT / HERITAGE</div>
        <img src="/assets/phulkari_pattern.png" className="floating-illustration phulkari-decor" alt="Phulkari Pattern" data-speed="0.8" />
        <div className="craft-container">
          <div className="craft-images">
            <Link href="/products/multi-colored-phulkari-cape-co-ord-set" className="craft-img-link">
              <img src="/assets/craft_new_1.jpg" className="craft-img duotone-1" alt="Garment 1" />
            </Link>
            <Link href="/products/drop-shoulder-hemp-shirt" className="craft-img-link">
              <img src="/assets/craft_new_2.jpg" className="craft-img duotone-2" alt="Garment 2" />
            </Link>
            <Link href="/products/rangrez-blazer-set" className="craft-img-link">
              <img src="/assets/craft_new_3.jpg" className="craft-img duotone-1" alt="Garment 3" />
            </Link>
            <Link href="/products/ravel-waist-coat-pant-set" className="craft-img-link">
              <img src="/assets/craft_new_4.jpg" className="craft-img duotone-2" alt="Garment 4" />
            </Link>
          </div>
          <div className="craft-text"><div className="craft-title">CRAFTED TO FEEL +</div></div>
        </div>
      </section>

      {/* ─── FOUNDER QUOTE ─── */}
      <section className="section founder-quote">
        <div className="quote-container">
          <div className="quote-decor">
            <span className="decorative-quote open-quote">&ldquo;</span>
            <span className="decorative-quote close-quote">&rdquo;</span>
          </div>
          <h2 className="quote-text italic fade-up">&ldquo;Dressing up has never been vanity for me, it&apos;s escape, empowerment, emotional shift. It is transformation.&rdquo;</h2>
        </div>
        <div className="peta-badge small fade-up">PETA VEGAN™</div>
      </section>

      {/* ─── CONSCIOUSNESS ─── */}
      <section className="section consciousness" id="consciousness">
        <div className="vegan-fabric-decor">
          {VEGAN_BGS.map((bg, idx) => (
            <img
              key={idx}
              src={bg}
              className={`fabric-img ${idx === currentBgIndex ? 'active' : ''}`}
              alt={`Vegan Conscious BG ${idx + 1}`}
            />
          ))}
          <img src="/assets/vegan_weave.png" className="floating-illustration weave-decor" alt="Vegan Weave" data-speed="1.2" />
        </div>
        <div className="consciousness-card">
          <div className="consciousness-hero">
            <h2 className="brand-lockup">VEGAN<br />CONSCIOUS</h2>
          </div>
          <div className="consciousness-body">
            <p className="italic">&ldquo;Consciousness is not an afterthought, it is the foundation.&rdquo;</p>
          </div>
        </div>
      </section>

      {/* ─── THE COLLECTION EDITORIAL GRID ─── */}
      <section className="section the-collection" id="the-collection">
        <div className="collection-header">
          <div className="collection-header-text">
            <span className="collection-kicker">EDITORIAL ARCHIVE / CHAPTER 01</span>
            <h2 className="display">ROOTED IN INTENTION</h2>
          </div>
          <div className="collection-badges">
            <span className="badge">Heritage Craft</span>
            <span className="badge">NEW IN</span>
            <Link href="/collections" className="btn-primary collection-header-cta">
              Enter The Collection →
            </Link>
          </div>
        </div>

        <div className="collection-swipe-cue-wrap">
          <div className="collection-swipe-cue">
            <span className="cue-dot" />
            <span className="cue-text">SWIPE TO UNFOLD ARCHIVE</span>
            <span className="cue-arrow">→</span>
          </div>
        </div>
        <div className="editorial-grid">
          <div className="grid-item item-large" data-speed="0.9" data-index="01">
            <Link href={getLinkForImage('/assets/IMG-20260903-WA0002.webp')} className="grid-item-link">
              <img src="/assets/IMG-20260903-WA0002.webp" alt="Piece 1" loading="eager" />
            </Link>
          </div>
          <div className="grid-item item-small offset-down" data-speed="1.1" data-index="02">
            <Link href={getLinkForImage('/assets/new_coll_6.jpg')} className="grid-item-link">
              <img src="/assets/new_coll_6.jpg" alt="Piece 2" loading="eager" />
            </Link>
          </div>
          <div className="grid-item item-medium" data-speed="1" data-index="03">
            <Link href={getLinkForImage('/assets/new_coll_5.JPG')} className="grid-item-link">
              <img src="/assets/new_coll_5.JPG" alt="Piece 3" loading="eager" />
            </Link>
          </div>
          <div className="grid-item item-tall offset-down" data-speed="1.2" data-index="04">
            <Link href={getLinkForImage('/assets/new_coll_4.jpeg')} className="grid-item-link">
              <img src="/assets/new_coll_4.jpeg" alt="Piece 4" loading="eager" />
            </Link>
          </div>
          <div className="grid-item item-wide" data-speed="0.8" data-index="05">
            <Link href={getLinkForImage('/assets/IMG-20260903-WA0000.webp')} className="grid-item-link">
              <img src="/assets/IMG-20260903-WA0000.webp" alt="Piece 5" loading="eager" />
            </Link>
          </div>
        </div>
        {/* Mobile prominent CTA below editorial grid */}
        <div className="collection-mobile-cta-wrap">
          <Link href="/collections" className="btn-primary collection-mobile-cta">
            Enter The Collection →
          </Link>
        </div>

        <div className="collection-progress"><div className="progress-track"><div className="progress-bar"></div></div></div>
        <div className="collection-ticker"><div className="ticker-track">
          <div className="ticker-text">NEW IN → → EVERYDAY EASE OCCASION STATEMENT PIECES CUSTOM // // // ∞ PHULKARI BLOCK PRINT HAND EMBROIDERY</div>
          <div className="ticker-text">NEW IN → → EVERYDAY EASE OCCASION STATEMENT PIECES CUSTOM // // // ∞ PHULKARI BLOCK PRINT HAND EMBROIDERY</div>
        </div></div>
      </section>

      {/* ─── KEYWORD MARQUEE ─── */}
      <section className="keyword-marquee">
        <div className="marquee-track">
          <div className="marquee-text">CRAFTSMANSHIP ✧ CONSCIOUSNESS — HERITAGE ∞ VEGAN ♥ PHULKARI ★ BLOCK PRINT ✧ HAND EMBROIDERY — INTENTIONAL ∞ MODERN ✧ EVOLUTION — TIMELESS ♥ EMPOWERMENT ★ INDIVIDUALITY ✧ PETA APPROVED ∞ SUSTAINABLE — DESIGN ★ EXPRESSION ♥ IDENTITY</div>
          <div className="marquee-text">CRAFTSMANSHIP ✧ CONSCIOUSNESS — HERITAGE ∞ VEGAN ♥ PHULKARI ★ BLOCK PRINT ✧ HAND EMBROIDERY — INTENTIONAL ∞ MODERN ✧ EVOLUTION — TIMELESS ♥ EMPOWERMENT ★ INDIVIDUALITY ✧ PETA APPROVED ∞ SUSTAINABLE — DESIGN ★ EXPRESSION ♥ IDENTITY</div>
        </div>
      </section>

      {/* ─── PATRON REFLECTIONS / COURIER POSTCARD RAIL ─── */}
      {patrons && patrons.length > 0 && (
        <section className="section patron-reflections" id="reflections">
          <div className="reflections-container">
            <div className="reflections-header">
              <span className="reflections-kicker">VOICES OF CONSCIOUS LUXURY</span>
              <h2 className="reflections-title">In Praise of the Craft</h2>
              <p className="reflections-subtitle">
                Reflections from patrons who embrace mindful craftsmanship, ethical luxury, and timeless individuality.
              </p>
            </div>

            {/* Courier Postcard Infinite Rail */}
            <div className="postcard-rail-wrapper">
              <div className="postcard-track">
                {(patrons.length < 4 ? [...patrons, ...patrons, ...patrons, ...patrons] : [...patrons, ...patrons]).map((item, index) => (
                  <article
                    key={`postcard-${index}`}
                    className="postcard-card"
                    style={{
                      backgroundColor: item.cardColor,
                      '--card-color': item.cardColor,
                      '--stamp-tint': item.stampTint,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`Read full reflection from ${item.name}`}
                    onClick={() => setActiveTestimonial(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTestimonial(item);
                      }
                    }}
                  >
                    {/* Top: Quote & Postage Stamp */}
                    <div className="postcard-top">
                      <div className="postcard-quote-wrapper">
                        <p className="postcard-quote">&ldquo;{item.quote}&rdquo;</p>
                        <span className="postcard-read-prompt">Read reflection ↗</span>
                      </div>

                      <div className="postcard-stamp-cluster">
                        <div className="postcard-postmark" aria-hidden="true">
                          <svg width="60" height="60" viewBox="0 0 60 60" className="postmark-svg">
                            <circle cx="30" cy="30" r="28" fill="none" stroke="#2D2319" strokeWidth="1.1" opacity="0.45" />
                            <circle cx="30" cy="30" r="18" fill="none" stroke="#2D2319" strokeWidth="0.8" opacity="0.35" />
                          </svg>
                          <span className="postmark-date">{item.postmark}</span>
                        </div>

                        <div className="postcard-stamp">
                          <div className="postcard-stamp-inner">
                            <img
                              src={item.photo}
                              alt={item.name}
                              className="postcard-stamp-img"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Signature / Name / City / Address lines */}
                    <div className="postcard-bottom">
                      <div className="postcard-author-info">
                        <div className="postcard-signature" aria-hidden="true">
                          <svg width="86" height="14" viewBox="0 0 120 16" fill="none">
                            <path
                              d="M2 12 C10 2, 18 2, 24 11 C29 18, 36 4, 44 10 C50 14, 55 4, 62 9 C69 14, 74 5, 82 10 C89 14, 96 6, 118 4"
                              stroke="#2D2319"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="postcard-name">{item.name}</span>
                        <span className="postcard-meta">{item.role} &bull; {item.city}</span>
                      </div>

                      <div className="postcard-address-lines" aria-hidden="true">
                        <span className="postcard-addr-line" />
                        <span className="postcard-addr-line" />
                        <span className="postcard-addr-line short" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="reflections-trust-bar">
              <div className="trust-item">
                <span className="trust-icon">✦</span>
                <span className="trust-label">100% PETA-Approved Vegan Textiles</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-icon">✦</span>
                <span className="trust-label">Authentic Artisanal Heritage Karigari</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <span className="trust-icon">✦</span>
                <span className="trust-label">Bespoke Fit &amp; Global Conscious Delivery</span>
              </div>
            </div>
          </div>

          {/* ─── FULL-TEXT PATRON REFLECTION MODAL ─── */}
          {activeTestimonial && (
            <div
              className="postcard-modal-overlay"
              onClick={() => setActiveTestimonial(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="postcard-modal-patron"
            >
              <div
                className="postcard-modal-card"
                style={{
                  backgroundColor: activeTestimonial.cardColor || '#E9A78C',
                  '--card-color': activeTestimonial.cardColor || '#E9A78C',
                  '--stamp-tint': activeTestimonial.stampTint || '#C4826A',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  className="postcard-modal-close"
                  onClick={() => setActiveTestimonial(null)}
                  aria-label="Close reflection"
                >
                  &times;
                </button>

                <div className="postcard-modal-header">
                  <span className="postcard-modal-kicker">PATRON REFLECTION</span>
                  <span className="postcard-modal-verified">✦ VERIFIED PATRON</span>
                </div>

                <div className="postcard-modal-body">
                  <div className="postcard-modal-main">
                    <div className="postcard-modal-quote-wrapper">
                      <p className="postcard-modal-quote">
                        &ldquo;{activeTestimonial.quote}&rdquo;
                      </p>
                    </div>

                    <div className="postcard-modal-author-info">
                      <div className="postcard-modal-signature" aria-hidden="true">
                        <svg width="100" height="16" viewBox="0 0 120 16" fill="none">
                          <path
                            d="M2 12 C10 2, 18 2, 24 11 C29 18, 36 4, 44 10 C50 14, 55 4, 62 9 C69 14, 74 5, 82 10 C89 14, 96 6, 118 4"
                            stroke="#2D2319"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <h3 id="postcard-modal-patron" className="postcard-modal-name">
                        {activeTestimonial.name}
                      </h3>
                      <p className="postcard-modal-meta">
                        {activeTestimonial.role} &bull; {activeTestimonial.city}
                      </p>
                    </div>
                  </div>

                  <div className="postcard-modal-stamp-cluster">
                    <div className="postcard-postmark modal-postmark" aria-hidden="true">
                      <svg width="70" height="70" viewBox="0 0 60 60" className="postmark-svg">
                        <circle cx="30" cy="30" r="28" fill="none" stroke="#2D2319" strokeWidth="1.1" opacity="0.45" />
                        <circle cx="30" cy="30" r="18" fill="none" stroke="#2D2319" strokeWidth="0.8" opacity="0.35" />
                      </svg>
                      <span className="postmark-date">{activeTestimonial.postmark}</span>
                    </div>

                    <div className="postcard-stamp modal-stamp">
                      <div className="postcard-stamp-inner">
                        <img
                          src={activeTestimonial.photo}
                          alt={activeTestimonial.name}
                          className="postcard-stamp-img"
                        />
                      </div>
                    </div>

                    <div className="postcard-modal-address-lines" aria-hidden="true">
                      <span className="postcard-addr-line" />
                      <span className="postcard-addr-line" />
                      <span className="postcard-addr-line short" />
                    </div>
                  </div>
                </div>

                <div className="postcard-modal-footer">
                  <span className="postcard-modal-brand">ARSHIA SINGH &bull; CONSCIOUS LUXURY</span>
                  <button
                    type="button"
                    className="postcard-modal-action-btn"
                    onClick={() => setActiveTestimonial(null)}
                  >
                    Close Reflection
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── FOUNDER NOTE ─── */}
      <section className="section founder-note">
        <div className="sidebar-label left rotated">FOUNDER</div>
        <div className="founder-content">
          <h2 className="display founder-quote-title">The Philosophy</h2>
          <div className="founder-sidebar">
            <div className="founder-img-wrapper">
              <img src="/assets/founder.jpeg" alt="Arshia Singh" className="founder-img" />
              <div className="founder-creative-stamp">
                <div className="rotating-seal">
                  <svg viewBox="0 0 100 100">
                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                    <text fontFamily="var(--font-mono)" fontSize="8" letterSpacing="2">
                      <textPath xlinkHref="#circlePath">CONSCIOUS LUXURY — ARSHIA SINGH — PETA VEGAN —</textPath>
                    </text>
                  </svg>
                </div>
                <div className="stamp-inner">★</div>
              </div>
            </div>
          </div>
          <div className="founder-text-wrapper">
            <div className="philosophy-pull-quote fade-up">
              &ldquo;At its core, the brand is built on a simple belief that fashion is one of the few things in life you truly control.&rdquo;
            </div>
            <div className="founder-body italic fade-up">
              <p><span className="drop-cap">I</span>n a world that constantly shifts, what you choose to wear remains entirely yours. It is a personal decision, an individual expression, a quiet form of power. The ability to shape how you feel, how you present yourself, and how you move through the world.</p>
              <p>At the same time, what we create is as important as how we create it. We are a PETA-approved vegan brand, committed to using materials and processes that do not harm animals.</p>
              <div className="philosophy-footer mt-[60px]" style={{ columnSpan: 'all' }}>
                <p className="m-0"><strong>Where Craftsmanship Meets Consciousness</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM JOURNEY: ENTER THE COLLECTION CTA ─── */}
      <section className="section bottom-collection-invitation">
        <div className="invitation-container">
          <span className="invitation-kicker">WHERE CRAFTSMANSHIP MEETS CONSCIOUSNESS</span>
          <h2 className="invitation-title">ENTER THE COLLECTION</h2>
          <p className="invitation-desc">
            Discover our full spectrum of conscious silhouettes—from fluid everyday drapes to handcrafted ceremonial blazers and bespoke ensembles.
          </p>
          <div className="invitation-actions">
            <Link href="/collections" className="btn-primary invitation-btn">
              Explore All Collections
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
