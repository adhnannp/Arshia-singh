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
      {/* SUBPAGE HERO */}
      <section className="subpage-hero">
        <div className="subpage-hero-bg" style={{ backgroundImage: "url('/assets/craft_detail_1_1777345251366.png')" }}></div>
        <div className="subpage-hero-content">
          <span className="subpage-hero-subtitle fade-up">The Hands Behind the Brand</span>
          <h1 className="subpage-hero-title fade-up">Karigar of AS</h1>
        </div>
      </section>

      {/* EDITORIAL BLOCK 1 */}
      <section className="editorial-block">
        <h2 className="editorial-title fade-up">Honouring Indian Artisans</h2>
        <p className="editorial-text fade-up">
          At Arshia Singh, we believe luxury lies not in the speed of production, but in the time dedicated to the craft. Every embroidery node, every print impression, and every stitch is made by the expert hands of our Karigars. By preserving heritage techniques like Phulkari and hand block printing, we honor their legacy while weaving a story of empowerment and conscious luxury.
        </p>
      </section>

      {/* STORY VISUALS */}
      <section className="masterclass-grid pt-0 pb-[10vh]">
        <div className="masterclass-item fade-up">
          <img src="/assets/13.jpg" alt="Phulkari Embroidery" className="w-full h-auto block" />
          <div className="mt-5 font-mono text-[10px] tracking-[0.1em] uppercase opacity-50">Atelier // PHULKARI EMBROIDERY</div>
        </div>
        <div className="masterclass-item fade-up mt-[100px]">
          <img src="/assets/craft_detail_2_1777345268074.png" alt="Hand Craft Detail" className="w-full h-auto block" />
          <div className="mt-5 font-mono text-[10px] tracking-[0.1em] uppercase opacity-50">Detail // HANDCRAFTED EMBELLISHMENTS</div>
        </div>
      </section>

      {/* DETAILED BIO SECTION */}
      <section className="editorial-block bg-[var(--color-silver)] text-[var(--color-text)] py-[10vh] px-[8vw]">
        <h2 className="editorial-title fade-up">Our Conscious Promise</h2>
        <p className="editorial-text fade-up opacity-80">
          Our workshop in New Delhi serves as a sanctuary for craftsmanship, where modern design meets generational skill. By ensuring fair wages, ethical working conditions, and a creative space that values human dignity, we keep the heartbeat of Indian textiles alive.
        </p>
      </section>

      <Footer />
    </>
  );
}
