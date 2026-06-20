'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

export default function StoryPage() {
  useEffect(() => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    gsap.config({ force3D: true });
    
    // Animate chapters on scroll
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.from(el, {
        y: 45,
        opacity: 0,
        duration: 1.4,
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
      <div className="story-masterpiece">
        {/* TYPOGRAPHIC HERO */}
        <section className="story-hero">
          <span className="story-hero-subtitle fade-up">Our Heritage</span>
          <h1 className="story-hero-title fade-up">The Narrative</h1>
          <div className="story-divider fade-up"></div>
        </section>

        <div className="story-container">
          {/* CHAPTER 1 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter I</span>
              <h2 className="story-chapter-title">The Origin</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                Arshia Singh was born from a desire to bridge the gap between traditional Indian craftsmanship and modern conscious living. The label emerged not merely to produce garments, but to honor the quiet beauty of slow fashion—where every node, print, and cut carries a memory.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                In a world that demands speed and excess, we choose patience and precision. We design for individuals who view dressing not as an act of vanity, but as a deliberate expression of identity and power.
              </p>
            </div>
          </section>

          {/* PULLQUOTE */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "Dressing up has never been vanity for me, it's escape, empowerment, emotional shift. It is transformation."
            </h2>
            <span className="story-pullquote-author">— Arshia Singh, Founder</span>
          </div>

          {/* CHAPTER 2 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter II</span>
              <h2 className="story-chapter-title">The Vegan Promise</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                Consciousness is not an afterthought for us; it is our foundation. Arshia Singh is a PETA-approved vegan brand, committed to creating luxury fashion that respects all life. We actively exclude any animal-derived materials from our sourcing.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                Instead, we seek out and utilize organic cotton, hemp, and premium bio-based vegan silks. We prove that luxury can be cruelty-free, offering premium textures and silhouettes that speak to both sensory excellence and moral clarity.
              </p>
            </div>
          </section>

          {/* PULLQUOTE 2 */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "Luxury is not about excess. It is about intention."
            </h2>
            <span className="story-pullquote-author">— Conscious Luxury</span>
          </div>

          {/* CHAPTER 3 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter III</span>
              <h2 className="story-chapter-title">Legacy of the Karigar</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                At the core of our label is the Karigar—the artisan. By collaborating directly with master embroiderers in Punjab and block printers in Jaipur, we preserve ancestral techniques that face threat of dilution from industrial duplication.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                By providing fair wages, safe working environments, and creative respect, our atelier in New Delhi keeps the heartbeat of heritage Indian craftsmanship alive. Each piece is a canvas of human dignity, time, and generational mastery.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
