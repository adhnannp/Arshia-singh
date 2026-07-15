'use client';

import { useState } from 'react';

export default function InquiriesClient() {
  const [waHover, setWaHover] = useState(false);
  const [igHover, setIgHover] = useState(false);

  // Button styles object to ensure absolute control and override any global CSS conflicts
  const getWhatsAppStyle = () => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    backgroundColor: waHover ? '#008f70' : '#00a884',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '17px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    padding: '22px 48px',
    borderRadius: '9999px',
    textDecoration: 'none',
    boxShadow: waHover
      ? '0 20px 38px rgba(0, 168, 132, 0.35)'
      : '0 10px 25px rgba(0, 168, 132, 0.15)',
    transform: waHover ? 'translateY(-4px)' : 'none',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    minWidth: '280px',
    textAlign: 'center',
    border: 'none',
  });

  const getInstagramStyle = () => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    background: igHover
      ? 'linear-gradient(135deg, #ff5487 0%, #ff1f5a 50%, #c1288c 100%)'
      : 'linear-gradient(135deg, #f9376c 0%, #e1306c 50%, #a83279 100%)',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '17px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    padding: '22px 48px',
    borderRadius: '9999px',
    textDecoration: 'none',
    boxShadow: igHover
      ? '0 20px 38px rgba(225, 48, 108, 0.4)'
      : '0 10px 25px rgba(225, 48, 108, 0.2)',
    transform: igHover ? 'translateY(-4px)' : 'none',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    minWidth: '280px',
    textAlign: 'center',
    border: 'none',
  });

  return (
    <div className="w-full bg-white min-h-[calc(100vh-var(--nav-height))] flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 py-16 lg:py-24 animate-fadeIn">
      <div className="max-w-[850px] w-full flex flex-col items-center">
        {/* Category Label */}
        <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8a8a8f] block mb-6">
          Connect
        </span>

        {/* Serif Heading */}
        <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light uppercase tracking-[0.02em] leading-[0.95] text-[#1d1d1f] mb-8 text-center">
          Let&apos;s Create<br />Together
        </h1>

        {/* Description */}
        <p className="font-body text-[18px] md:text-[21px] leading-[1.8] text-[#4a4a4f] max-w-[650px] mb-12 italic text-center mx-auto">
          For bespoke orders, custom design inquiries, bridal consultations, and collaborations, reach out directly via WhatsApp or Instagram.
        </p>

        {/* Spacious, Highly Readable Luxury Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 justify-center items-center w-full mt-8">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919953275142"
            target="_blank"
            rel="noopener noreferrer"
            style={getWhatsAppStyle()}
            onMouseEnter={() => setWaHover(true)}
            onMouseLeave={() => setWaHover(false)}
          >
            <svg
              style={{ width: '22px', height: '22px', fill: 'currentColor' }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.884-6.948C16.636 2.005 14.193.987 11.599.987c-5.45 0-9.873 4.374-9.877 9.805a9.61 9.61 0 0 0 1.488 5.091l-.98 3.58 3.69-.958zm12.352-7.39c-.322-.16-1.9-1.096-2.222-1.255-.322-.159-.557-.24-.792.112-.236.353-.913 1.155-1.118 1.393-.205.238-.41.266-.732.106-.322-.16-1.36-.503-2.594-1.602-.96-.856-1.607-1.912-1.796-2.23-.19-.317-.02-.49.141-.649.145-.143.322-.374.483-.562.161-.188.215-.322.322-.536.107-.215.053-.403-.027-.563-.08-.16-.792-1.912-1.085-2.616-.285-.685-.572-.593-.792-.604-.204-.01-.439-.012-.674-.012-.235 0-.618.088-.94.439-.322.352-1.23 1.203-1.23 2.933 0 1.73 1.256 3.4 1.433 3.635.176.235 2.472 3.775 5.989 5.29.837.362 1.49.578 2.001.74.84.267 1.606.23 2.21.14.675-.1 2.223-.908 2.535-1.785.312-.877.312-1.63.218-1.786-.093-.157-.343-.252-.665-.412z" />
            </svg>
            <span>WhatsApp Concierge</span>
          </a>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/arshia.singh.official"
            target="_blank"
            rel="noopener noreferrer"
            style={getInstagramStyle()}
            onMouseEnter={() => setIgHover(true)}
            onMouseLeave={() => setIgHover(false)}
          >
            <svg
              style={{ width: '22px', height: '22px', fill: 'currentColor' }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            <span>Instagram Direct</span>
          </a>
        </div>
      </div>
    </div>
  );
}
