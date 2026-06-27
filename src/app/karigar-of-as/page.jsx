import React from 'react';
import Footer from '../../components/Footer';

export default function KarigarPage() {
  const textStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(20px, 2.6vw, 26px)',
    fontWeight: '400',
    lineHeight: '1.8',
    color: '#111111',
    margin: 0,
    maxWidth: '850px',
    textAlign: 'center'
  };

  const images = [
    '/assets/karigar_ticker_1.jpg',
    '/assets/karigar_ticker_2.jpg',
    '/assets/karigar_ticker_3.jpg',
    '/assets/karigar_ticker_4.jpg'
  ];

  // Tripled images to support ultra-wide screens seamlessly
  const marqueeImages = [...images, ...images, ...images];

  return (
    <>
      <div 
        className="story-masterpiece"
        style={{
          backgroundColor: '#FAF9F6',
          color: '#1a1a1a',
          width: '100%'
        }}
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.3333%, 0, 0); }
          }
          .marquee-container {
            overflow: hidden;
            width: calc(100% + 64px);
            margin-left: -32px;
            margin-right: -32px;
            padding: 20px 0;
            background: transparent;
          }
          .marquee-track {
            display: flex;
            width: max-content;
            gap: 30px;
            animation: marquee 30s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          .marquee-item {
            flex-shrink: 0;
            height: 350px;
            border-radius: 4px;
            overflow: hidden;
            background-color: #f3f2ee;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            transition: transform 0.4s ease;
          }
          .marquee-item:hover {
            transform: scale(1.02);
          }
          .marquee-img {
            height: 100%;
            width: auto;
            display: block;
          }
          @media (max-width: 768px) {
            .marquee-item {
              height: 240px;
            }
            .marquee-track {
              gap: 15px;
            }
          }
        `}</style>

        {/* Main Content Area - Full screen landing hero */}
        <main 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '120px',
            paddingBottom: '80px',
            paddingLeft: '32px',
            paddingRight: '32px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            style={{
              maxWidth: '900px',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Minimal Header */}
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#887a64',
                marginBottom: '15px',
                display: 'block'
              }}
            >
              Behind the Brand
            </span>
            
            <h1 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                fontWeight: '300',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#111111',
                lineHeight: 1.2,
                marginTop: '0',
                marginBottom: '50px'
              }}
            >
              Karigars of AS
            </h1>

            {/* Central Content Container */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '40px',
                width: '100%'
              }}
            >
              <p style={textStyle}>
                Behind every hand-embroidered masterpiece is a story of dedication. Their skilled hands bring centuries-old techniques to life. Their craft is not just embroidery—it’s a living legacy woven into every stitch.
              </p>

              <p style={textStyle}>
                At the heart of our brand are artisans like Sarfaraz, Gurudas, Kundan, and Hema, whose craftsmanship breathes life into our collections. Every stitch tells a story, and every fabric carries the soul of its maker.
              </p>

              {/* Infinite Scroll Marquee Ticker */}
              <div className="marquee-container">
                <div className="marquee-track">
                  {marqueeImages.map((src, index) => (
                    <div key={index} className="marquee-item">
                      <img 
                        src={src} 
                        alt={`AS Artisan Karigar Detail ${index + 1}`} 
                        className="marquee-img" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p style={textStyle}>
                Designed with intention, crafted by hand, worn with pride.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
