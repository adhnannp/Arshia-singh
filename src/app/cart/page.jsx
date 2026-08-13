'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const cartLinkId = searchParams.get('cart_link_id');
    const country = searchParams.get('country');

    if (cartLinkId) {
      // Redirect to Shopify permanent cart link for Buy Again feature
      const shopifyDomain = '1atm4n-tq.myshopify.com';
      let shopifyUrl = `https://${shopifyDomain}/cart?cart_link_id=${encodeURIComponent(cartLinkId)}`;
      if (country) {
        shopifyUrl += `&country=${encodeURIComponent(country)}`;
      }
      window.location.href = shopifyUrl;
    } else {
      // Redirect to /discover page with openCart=true to display cart drawer seamlessly
      router.replace('/discover?openCart=true');
    }
  }, [router, searchParams]);

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
      Redirecting...
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
