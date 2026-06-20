'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../components/Footer';

export default function HomePage() {
  const [stack, setStack] = useState([
    { id: 1, src: "/assets/new_coll_1.jpg" },
    { id: 2, src: "/assets/new_coll_3.png" },
    { id: 3, src: "/assets/new_coll_5.JPG" },
    { id: 4, src: "/assets/new_coll_7.jpg" },
  ]);

  const [startX, setStartX] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const cycleStack = () => {
    setStack(prev => {
      const next = [...prev];
      const first = next.shift();
      next.push(first);
      return next;
    });
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setSwipeOffset(diff);
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeOffset) > 80) {
      const flyDirection = swipeOffset > 0 ? 350 : -350;
      setSwipeOffset(flyDirection);
      setTimeout(() => {
        cycleStack();
        setSwipeOffset(0);
      }, 300);
    } else {
      setSwipeOffset(0);
    }
    setStartX(null);
    setIsSwiping(false);
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
    if (quote) {
      const wordsText = quote.innerText.split(' ');
      quote.innerHTML = '';
      wordsText.forEach(word => {
        const span = document.createElement('span');
        span.innerText = word;
        span.style.opacity = 0;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.25em';
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
            <Link href="/collections/matching-moods" className="btn-primary cinematic-btn">Enter the Collection</Link>
            <Link href="/our-story" className="btn-secondary cinematic-btn-outline">Discover the Story</Link>
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
            <div className="pcol-img-wrap"><img src="/assets/new_coll_1.jpg" alt="Look 1" /></div>
            <div className="pcol-img-wrap"><img src="/assets/new_coll_2.png" alt="Look 2" /></div>
            <div className="pcol-img-wrap"><img src="/assets/DSC_8756.jpg" alt="Look 3" /></div>
          </div></div>
          <div className="parallax-col parallax-col-2" id="pcol2"><div className="pcol-inner">
            <div className="pcol-img-wrap"><img src="/assets/new_coll_3.png" alt="Look 4" /></div>
            <div className="pcol-img-wrap"><img src="/assets/new_coll_4.jpeg" alt="Look 5" /></div>
            <div className="pcol-img-wrap"><img src="/assets/DSC_8356.jpg" alt="Look 6" /></div>
          </div></div>
          <div className="parallax-col parallax-col-3" id="pcol3"><div className="pcol-inner">
            <div className="pcol-img-wrap"><img src="/assets/new_coll_5.JPG" alt="Look 7" /></div>
            <div className="pcol-img-wrap"><img src="/assets/new_coll_6.jpg" alt="Look 8" /></div>
            <div className="pcol-img-wrap"><img src="/assets/DSC_8473.jpg" alt="Look 9" /></div>
          </div></div>
          <div className="parallax-col parallax-col-4" id="pcol4"><div className="pcol-inner">
            <div className="pcol-img-wrap"><img src="/assets/new_coll_7.jpg" alt="Look 10" /></div>
            <div className="pcol-img-wrap"><img src="/assets/DSC_8791.jpg" alt="Look 11" /></div>
            <div className="pcol-img-wrap"><img src="/assets/DSC_8402.jpg" alt="Look 12" /></div>
          </div></div>
        </div>

        {/* Mobile View: Layered Stack of Images */}
        <div
          className="mood-mobile-stack"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {stack.map((card, index) => {
            const rotations = [-5, 4, -2, 1];
            const translateXs = [-10, 8, -4, 0];
            const translateYs = [-8, -4, 4, 10];

            const isTopCard = index === stack.length - 1;
            const currentTranslateX = isTopCard ? translateXs[index] + swipeOffset : translateXs[index];
            const currentTranslateY = translateYs[index];
            const currentRotation = isTopCard ? rotations[index] + (swipeOffset / 15) : rotations[index];

            return (
              <div
                key={card.id}
                className="mood-stack-card"
                style={{
                  zIndex: index,
                  transform: `rotate(${currentRotation}deg) translate(${currentTranslateX}px, ${currentTranslateY}px)`,
                  transition: isSwiping && isTopCard ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.3, 1), z-index 0.4s ease',
                }}
              >
                <img src={card.src} alt={`Look ${card.id}`} />
              </div>
            );
          })}
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
            <img src="/assets/new_coll_1.jpg" className="craft-img duotone-1" alt="Garment 1" />
            <img src="/assets/new_coll_2.png" className="craft-img duotone-2" alt="Garment 2" />
            <img src="/assets/new_coll_3.png" className="craft-img duotone-1" alt="Garment 3" />
            <img src="/assets/new_coll_4.jpeg" className="craft-img duotone-2" alt="Garment 4" />
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
          <img src="/assets/vegan-conscious-bg.jpg" className="fabric-img" alt="Vegan Luxury Material" />
          <img src="/assets/vegan_weave.png" className="floating-illustration weave-decor" alt="Vegan Weave" data-speed="1.2" />
        </div>
        <div className="consciousness-hero">
          <h2 className="brand-lockup">VEGAN<br />CONSCIOUS</h2>
        </div>
        <div className="consciousness-body">
          <p className="italic">&ldquo;Consciousness is not an afterthought, it is the foundation.&rdquo;</p>
        </div>
      </section>

      {/* ─── THE COLLECTION EDITORIAL GRID ─── */}
      <section className="section the-collection" id="the-collection">
        <div className="collection-header">
          <h2 className="display">ROOTED IN INTENTION</h2>
          <div className="collection-badges">
            <span className="badge">Heritage Craft</span>
            <span className="badge">NEW IN</span>
            <Link href="/collections/matching-moods" className="btn-primary ml-5 text-[0.8rem] py-2 px-4">Uncover the Details</Link>
          </div>
        </div>
        <div className="collection-swipe-hint">SWIPE TO UNFOLD &gt;&gt;&gt;</div>
        <div className="editorial-grid">
          <div className="grid-item item-large" data-speed="0.9" data-index="01"><img src="/assets/new_coll_3.png" alt="Piece 1" loading="eager" /></div>
          <div className="grid-item item-small offset-down" data-speed="1.1" data-index="02"><img src="/assets/new_coll_4.jpeg" alt="Piece 2" loading="eager" /></div>
          <div className="grid-item item-medium" data-speed="1" data-index="03"><img src="/assets/new_coll_5.JPG" alt="Piece 3" loading="eager" /></div>
          <div className="grid-item item-tall offset-up" data-speed="1.2" data-index="04"><img src="/assets/new_coll_6.jpg" alt="Piece 4" loading="eager" /></div>
          <div className="grid-item item-wide" data-speed="0.8" data-index="05"><img src="/assets/new_coll_7.jpg" alt="Piece 5" loading="eager" /></div>
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

      <Footer />
    </>
  );
}
