import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <h1 className="display footer-hero-text">WEAR<br />YOUR STORY</h1>
      </div>

      <div className="mt-[-8vh] mb-[12vh]">
        <a
          href="https://www.instagram.com/arshia.singh.official?igsh=bWN5cXd1M2txNmsx"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link text-[12px] font-mono tracking-[0.2em] uppercase"
        >
          Instagram
        </a>
      </div>

      <div className="footer-links">
        <Link href="/shipping-policy">Shipping Policy</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/exchange-policy">Exchange Policy</Link>
        <Link href="/returns-and-refunds">Returns & Refunds</Link>
        <Link href="/terms-and-conditions">Terms & Conditions</Link>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 ARSHIA SINGH — CONSCIOUS LUXURY — PETA VEGAN™</p>
      </div>
    </footer>
  );
}
