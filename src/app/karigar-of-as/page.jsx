'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Footer from '../../components/Footer';

export default function KarigarPage() {
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
      <div className="story-masterpiece">
        {/* HERO SECTION */}
        <section className="story-hero">
          <span className="story-hero-subtitle fade-up">The Hands Behind the Brand</span>
          <h1 className="story-hero-title fade-up">Karigars of AS</h1>
          <div className="story-divider fade-up"></div>
        </section>

        <div className="story-container">
          {/* CONTENT SECTION 1 */}
          <section className="story-chapter fade-up pb-10">
            <div className="story-chapter-meta">
              <span className="story-chapter-num">Legacy</span>
              <h2 className="story-chapter-title">A Story of Dedication</h2>
            </div>
            <div className="story-chapter-intro">
              <p>
                Behind every hand-embroidered masterpiece is a story of dedication. Their skilled hands bring centuries-old techniques to life. Their craft is not just embroidery—it’s a living legacy woven into every stitch.
              </p>
            </div>
          </section>

          {/* PULLQUOTE */}
          <div className="story-pullquote fade-up my-12">
            <h2 className="story-pullquote-text">
              "At the heart of our brand are artisans like Sarfaraz, Gurudas, Kundan, Hema, whose craftsmanship breathes life into our collections."
            </h2>
            <span className="story-pullquote-author">— The Karigars</span>
          </div>

          {/* CONTENT SECTION 2 */}
          <section className="story-chapter fade-up pt-10">
            <div className="story-chapter-intro text-center max-w-2xl mx-auto">
              <p className="italic text-lg md:text-xl font-serif">
                Every stitch tells a story, and every fabric carries the soul of its maker.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
