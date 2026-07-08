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
          <span className="story-hero-subtitle fade-up">Where Craftsmanship Meets Consciousness</span>
          <h1 className="story-hero-title fade-up">Our Story</h1>
          <div className="story-divider fade-up"></div>
        </section>

        <div className="story-container">
          {/* CHAPTER 1 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter I</span>
              <h2 className="story-chapter-title">The Philosophy</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                At its core, the brand is built on a simple belief that fashion is one of the few things in life you truly control.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                In a world that constantly shifts, what you choose to wear remains entirely yours. It is a personal decision, an individual expression, a quiet form of power. The ability to shape how you feel, how you present yourself, and how you move through the world.
              </p>
            </div>
          </section>

          {/* PULLQUOTE 1 */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "This philosophy forms the foundation of the brand."
            </h2>
          </div>

          {/* EXHIBIT I */}
          <div className="museum-item fade-up" style={{ marginBottom: '140px' }}>
            <div className="museum-frame">
              <div className="museum-image-container">
                <img src="/assets/art_museum_1.jpg" alt="The Sacred Archive" className="museum-img" />
              </div>
            </div>
            <div className="museum-label">
              <span className="museum-label-id">EXHIBIT I</span>
              <h3 className="museum-label-title">The Sacred Archive</h3>
              <span className="museum-label-medium">Tactile Heritage & Embossed Gold Bindings</span>
              <p className="museum-label-desc">
                A physical manifestation of storytelling. Woven archives of textures, patterns, and golden block-printed motifs that catalog the visual history of the brand.
              </p>
            </div>
          </div>

          {/* CHAPTER 2 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter II</span>
              <h2 className="story-chapter-title">The Heritage</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                We create contemporary clothing for men and women that blends Indian craftsmanship with modern design. Rooted in heritage yet designed for today, our pieces bring together intricate phulkari, block printing, and hand embroidery, reinterpreted through modern lenses and crafted into Indo-western and western silhouettes that are relevant, versatile, and timeless.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                From detailed artisanal techniques to thoughtfully developed digital prints, each garment reflects a balance of tradition and innovation where craft is not just preserved, but evolved.
              </p>
            </div>
          </section>

          {/* PULLQUOTE 2 */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "At the same time, what we create is as important as how we create it."
            </h2>
          </div>

          {/* EXHIBIT II */}
          <div className="museum-item reverse fade-up" style={{ marginBottom: '80px' }}>
            <div className="museum-label">
              <span className="museum-label-id">EXHIBIT II</span>
              <h3 className="museum-label-title">The Desert Sentinel</h3>
              <span className="museum-label-medium">Handcrafted Floral Cabinet & Salt Plain Contrast</span>
              <p className="museum-label-desc">
                An exploration of isolation and pattern. Our intricate floral prints standing resiliently against the minimalist, infinite salt flats of India.
              </p>
            </div>
            <div className="museum-frame">
              <div className="museum-image-container">
                <img src="/assets/art_museum_3.jpg" alt="The Desert Sentinel" className="museum-img" />
              </div>
            </div>
          </div>

          {/* EXHIBIT III */}
          <div className="museum-item fade-up" style={{ marginBottom: '140px' }}>
            <div className="museum-frame">
              <div className="museum-image-container">
                <img src="/assets/art_museum_4.jpg" alt="Straw Weaver's Ascent" className="museum-img" />
              </div>
            </div>
            <div className="museum-label">
              <span className="museum-label-id">EXHIBIT III</span>
              <h3 className="museum-label-title">Straw Weaver's Ascent</h3>
              <span className="museum-label-medium">Woven Organic Fibers & Sculptural Form</span>
              <p className="museum-label-desc">
                Celebrating the organic structures of nature. A bird handcrafted entirely from woven geometric straw and natural dyes, taking flight as a symbol of conscious elevation.
              </p>
            </div>
          </div>

          {/* CHAPTER 3 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter III</span>
              <h2 className="story-chapter-title">The Consciousness</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                We are a PETA-approved vegan brand, committed to using materials and processes that do not harm animals. Our choice to work with vegan fabrics is intentional. It is about responsibility, awareness, and building a future where fashion exists without compromise.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                Because true design is not only about how something looks or feels, it is also about what it stands for.
              </p>
            </div>
          </section>

          {/* PULLQUOTE 3 */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "This intersection of heritage craftsmanship and conscious creation is where the brand finds its identity."
            </h2>
          </div>

          {/* EXHIBIT IV */}
          <div className="museum-item reverse fade-up" style={{ marginBottom: '140px' }}>
            <div className="museum-label">
              <span className="museum-label-id">EXHIBIT IV</span>
              <h3 className="museum-label-title">Cloud Weaver Kaftan</h3>
              <span className="museum-label-medium">Ethereal Silk & Atmospheric Light</span>
              <p className="museum-label-desc">
                Bridging the material and the atmosphere. A flowing silk kaftan with marble-like golden veins, dissolving seamlessly into sky and clouds to represent the lightness of conscious living.
              </p>
            </div>
            <div className="museum-frame">
              <div className="museum-image-container">
                <img src="/assets/art_museum_2.jpg" alt="Cloud Weaver Kaftan" className="museum-img" />
              </div>
            </div>
          </div>

          {/* CHAPTER 4 */}
          <section className="story-chapter fade-up">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Chapter IV</span>
              <h2 className="story-chapter-title">The Empowerment</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                Every piece is designed to do more than just dress you. It is created to empower, to offer a sense of confidence, ease, and individuality. To become a part of your everyday moments, your celebrations, and everything in between.
              </p>
            </div>
            <div className="story-chapter-body">
              <p>
                Because when you feel good in what you wear, it reflects in everything you do.
              </p>
            </div>
          </section>

          {/* PULLQUOTE 4 */}
          <div className="story-pullquote fade-up">
            <h2 className="story-pullquote-text">
              "Where Craftsmanship Meets Consciousness"
            </h2>
          </div>

          {/* EXHIBIT V */}
          <div className="museum-item fade-up" style={{ marginBottom: '140px' }}>
            <div className="museum-frame">
              <div className="museum-image-container">
                <img src="/assets/art_museum_5.jpg" alt="Flowing River of Indigo" className="museum-img" />
              </div>
            </div>
            <div className="museum-label">
              <span className="museum-label-id">EXHIBIT V</span>
              <h3 className="museum-label-title">Flowing River of Indigo</h3>
              <span className="museum-label-medium">Draped Silk & Natural Mountain Valley</span>
              <p className="museum-label-desc">
                An installation depicting fabric as a force of nature. Rich indigo and green patterned silks flow through the rocks of a mountain valley, mimicking the life-giving nature of clean rivers.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
