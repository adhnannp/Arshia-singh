'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

export default function StoryPage() {
  useEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ force3D: true });
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <>
      {/* SUBPAGE HERO */}
      <section className="subpage-hero">
        <div className="subpage-hero-bg" style={{ backgroundImage: "url('/assets/12.jpg')" }}></div>
        <div className="subpage-hero-content">
          <span className="subpage-hero-subtitle fade-up">Our Heritage</span>
          <h1 className="subpage-hero-title fade-up">The Narrative</h1>
        </div>
      </section>

      {/* EDITORIAL BLOCK 1 */}
      <section className="editorial-block">
        <h2 className="editorial-title fade-up">Craftsmanship Reimagined</h2>
        <p className="editorial-text fade-up">
          Arshia Singh was born from a desire to bridge the gap between traditional Indian craftsmanship and modern conscious living. Our story is not just about clothes; it's about the hands that make them, the heritage they carry, and the future we are building together.
        </p>
      </section>

      {/* STORY VISUALS */}
      <section className="masterclass-grid" style={{ paddingTop: 0, paddingBottom: '10vh' }}>
        <div className="masterclass-item fade-up">
          <img src="/assets/13.jpg" alt="Craft Detail" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>Atelier // PHULKARI PROCESS</div>
        </div>
        <div className="masterclass-item fade-up" style={{ marginTop: '100px' }}>
          <img src="/assets/14.jpg" alt="Craft Detail" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>Material // VEGAN CONSCIOUS</div>
        </div>
      </section>

      {/* FOUNDER QUOTE REVISITED */}
      <section className="editorial-block" style={{ background: 'var(--color-dark)', color: 'var(--color-bg)', marginBottom: '15vh', padding: '10vh 8vw' }}>
        <h2 className="editorial-title fade-up" style={{ color: 'var(--color-bg)' }}>"Luxury is not about excess. It is about intention."</h2>
        <p className="editorial-text fade-up" style={{ opacity: 0.6 }}>
          — Arshia Singh, Founder
        </p>
      </section>

      <Footer />
    </>
  );
}
