import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <h1 className="display footer-hero-text">WEAR<br />YOUR STORY</h1>
      </div>

      <div style={{ marginTop: '-8vh', marginBottom: '12vh' }}>
        <a
          href="https://www.instagram.com/arshia.singh.official?igsh=bWN5cXd1M2txNmsx"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          Instagram
        </a>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 ARSHIA SINGH — CONSCIOUS LUXURY — PETA VEGAN™</p>
      </div>
    </footer>
  );
}
