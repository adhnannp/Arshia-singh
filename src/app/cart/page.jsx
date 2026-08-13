'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function CartPageContent() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to /discover page with openCart=true to display cart drawer seamlessly without redirect loops
    router.replace('/discover?openCart=true');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: '12px',
      letterSpacing: '0.15em',
      color: '#666',
      textTransform: 'uppercase'
    }}>
      Redirecting to collection...
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '12px',
        letterSpacing: '0.15em',
        color: '#666',
        textTransform: 'uppercase'
      }}>
        Loading...
      </div>
    }>
      <CartPageContent />
    </Suspense>
  );
}
