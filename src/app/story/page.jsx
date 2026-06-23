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
        </div>
      </div>
      <Footer />
    </>
  );
}
