import { CartProvider } from '../components/CartContext';
import CartDrawer from '../components/CartDrawer';
import Navbar from '../components/Navbar';
import '../styles/style-base.css';
import '../styles/style-product.css';
import '../styles/style-collection.css';

export const metadata = {
  title: 'ARSHIA SINGH | Where Craftsmanship Meets Consciousness',
  description: 'Arshia Singh — PETA Vegan™ conscious luxury fashion brand from New Delhi. Phulkari, block print, hand embroidery — wearable art that honours Indian craft.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          async
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main id="smooth-wrapper">
            <div id="smooth-content">
              {children}
            </div>
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
