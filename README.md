# ARSHIA SINGH — Next.js Website

Official website for the **Arshia Singh** luxury conscious fashion brand.

Built with **Next.js 14 (App Router)** · React 18 · GSAP · Swiper · Lenis

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm run start
```

---

## Project Structure

```
arshia-singh-nextjs/
├── app/                          # Next.js App Router pages
│   ├── layout.jsx                # Root layout (Navbar, Cart, global CSS)
│   ├── page.jsx                  # Home page (cinematic landing)
│   ├── story/
│   │   └── page.jsx              # Our Story page
│   ├── collections/
│   │   └── [category]/
│   │       └── page.jsx          # Dynamic collection listing (all 9 categories)
│   ├── product/
│   │   └── [slug]/
│   │       └── page.jsx          # Dynamic product detail page (all 35 products)
│   └── inquiries/
│       └── page.jsx              # Contact / Inquiries page
│
├── components/                   # Reusable React components
│   ├── Navbar.jsx                # Brand nav + fullscreen menu overlay
│   ├── Footer.jsx                # Site footer
│   ├── CartContext.jsx           # Cart state management (localStorage)
│   ├── CartDrawer.jsx            # Slide-in cart panel
│   └── SmoothScroll.jsx          # Lenis smooth scroll wrapper
│
├── data/
│   └── products-data.js          # All 35 products with metadata
│
├── styles/
│   ├── style-base.css            # Core design system & global styles
│   ├── style-product.css         # Product detail page styles
│   └── style-collection.css      # Collection listing page styles
│
├── public/
│   └── assets/                   # All images, videos, logos
│
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies & scripts
```

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Cinematic home page |
| `/story` | Our Story editorial page |
| `/collections/matching-moods` | Women — Co-ords collection |
| `/collections/flow-state` | Women — Kaftans collection |
| `/collections/power-layers` | Women — Blazers collection |
| `/collections/six-yards-of-good` | Women — Sarees collection |
| `/collections/custom-made-for-moments` | Bespoke / Bridal collection |
| `/collections/natural-luxury` | Men — Hemp & Muslin collection |
| `/collections/printed-stories` | Men — Printed Shirts collection |
| `/collections/modern-classics` | Men — Heritage Jackets collection |
| `/product/[product-name]` | Individual product detail page |
| `/inquiries` | Contact & Inquiry form |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (JSX)
- **Animation**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Sliders**: Swiper
- **3D (Logo)**: Three.js
- **Styling**: Vanilla CSS (custom design system)

---

*ARSHIA SINGH © 2025 — Conscious Luxury*
