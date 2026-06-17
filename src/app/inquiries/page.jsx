import Footer from '../../components/Footer';

export const metadata = {
  title: 'Inquiries | ARSHIA SINGH',
  description: 'Get in touch with Arshia Singh for bespoke orders, custom design inquiries, and collaborations.',
};

export default function InquiriesPage() {
  return (
    <>
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 60px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#8a8a8f',
          display: 'block',
          marginBottom: '20px',
        }}>Connect</span>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 6rem)',
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: '#1d1d1f',
          lineHeight: 1,
          marginBottom: '30px',
        }}>Let&apos;s Create Together</h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          lineHeight: 1.75,
          color: '#4a4a4f',
          maxWidth: '520px',
          marginBottom: '50px',
          fontStyle: 'italic',
        }}>For bespoke orders, custom design inquiries, bridal consultations, and collaborations, reach out directly via WhatsApp or Instagram.</p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '18px 36px',
              background: '#1d1d1f',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.3s',
            }}
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/arshia.singh.official"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '18px 36px',
              background: 'transparent',
              color: '#1d1d1f',
              border: '1.5px solid rgba(0,0,0,0.18)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            Instagram @arshia.singh.official
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
