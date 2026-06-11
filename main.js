import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import Swiper from 'swiper'
import { EffectCards, Autoplay } from 'swiper/modules'
import { products } from './products-data.js'
import 'swiper/css'
import 'swiper/css/effect-cards'

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // --- Lenis Smooth Scroll ---
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  const lenis = isTouchDevice ? null : new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  if (lenis) {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => {
      ScrollTrigger.update();
    });
  }

  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  const preloaderCounter = document.querySelector('.preloader-counter');
  const words = document.querySelectorAll('.preloader-words span');

  let loadProgress = { value: 0 };
  let wordTimeline = gsap.timeline({ repeat: -1 });

  words.forEach((word) => {
    wordTimeline
      .to(word, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
      .to(word, { y: -20, opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.5 });
  });

  if (preloader && preloaderCounter) {
    gsap.to(loadProgress, {
      value: 100,
      duration: 2.5,
      ease: "power1.inOut",
      onUpdate: () => {
        preloaderCounter.textContent = Math.round(loadProgress.value) + '%';
      },
      onComplete: () => {
        wordTimeline.kill();
        gsap.to(preloader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: () => {
            preloader.style.display = 'none';
            initScrollAnimations();
          }
        });
        gsap.set('.media-consent', { display: 'block' });
        gsap.from('.media-consent', { y: 20, opacity: 0, duration: 0.5, delay: 0.5 });
      }
    });
  } else {
    initScrollAnimations();
    gsap.set('.media-consent', { display: 'block' });
  }

  function initScrollAnimations() {
    gsap.config({ force3D: true });
    initHeroAnimations();
    
    // Set will-change for performance
    gsap.set('.cinematic-bg, .cinematic-content, .grid-item, .founder-img, .floating-illustration, .fade-up', { willChange: 'transform, opacity' });

    ScrollTrigger.refresh();

    // Hero Parallax
    gsap.to('.cinematic-bg', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    gsap.to('.cinematic-content', {
      yPercent: -30,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    // WEAR YOUR MOOD — Skiper30-style parallax columns
    // Columns are absolutely positioned; GSAP animates Y from 0 → travel distance
    // Travel amounts match Skiper30's y = height*2, y2 = height*3.3, y3 = height*1.25, y4 = height*3
    if (window.innerWidth >= 1024) {
      const galleryTrigger = {
        trigger: '.parallax-gallery',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5, // Smooth Lenis-quality drag
      };

      // Col 1: y = height*2 ≈ 200vh travel
      gsap.fromTo('#pcol1', { y: 0 }, {
        y: '200vh',
        ease: 'none',
        scrollTrigger: galleryTrigger,
      });
      // Col 2: y2 = height*3.3 ≈ 330vh travel (fastest, starts highest)
      gsap.fromTo('#pcol2', { y: 0 }, {
        y: '330vh',
        ease: 'none',
        scrollTrigger: galleryTrigger,
      });
      // Col 3: y3 = height*1.25 ≈ 125vh travel (slowest)
      gsap.fromTo('#pcol3', { y: 0 }, {
        y: '125vh',
        ease: 'none',
        scrollTrigger: galleryTrigger,
      });
      // Col 4: y4 = height*3 ≈ 300vh travel
      gsap.fromTo('#pcol4', { y: 0 }, {
        y: '300vh',
        ease: 'none',
        scrollTrigger: galleryTrigger,
      });
    }

    // Swiper Card Effect Carousel for Mobile (Skiper48 effect)
    const moodSwiperEl = document.querySelector('.mood-mobile-swiper');
    if (moodSwiperEl) {
      new Swiper('.mood-mobile-swiper', {
        modules: [EffectCards, Autoplay],
        effect: 'cards',
        grabCursor: true,
        loop: true,
        autoplay: false,
        cardsEffect: {
          slideShadows: true,
          perSlideRotate: 2,
          perSlideOffset: 8,
        }
      });
    }

    // Old marquee calls kept for other sections
    setupMarquee('.atelier-marquee.row-1 .track', 40, -1);
    setupMarquee('.atelier-marquee.row-2 .track', 45, 1);
    setupMarquee('.keyword-marquee .marquee-track', 35, -1);
    setupMarquee('.collection-ticker .ticker-track', 25, -1);

    // The Craft
    gsap.from('.craft-img', {
      opacity: 0,
      x: 50,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.the-craft',
        start: 'top 70%'
      }
    });

    // Founder Quote
    const quote = document.querySelector('.quote-text');
    if(quote) {
        const wordsText = quote.innerText.split(' ');
        quote.innerHTML = '';
        wordsText.forEach(word => {
          const span = document.createElement('span');
          span.innerText = word;
          span.style.opacity = 0;
          span.style.display = 'inline-block';
          span.style.marginRight = '0.25em';
          span.style.transform = 'translateY(10px)';
          quote.appendChild(span);
        });
        gsap.to('.quote-text span', {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.founder-quote', start: 'top 70%' }
        });
    }

    // Consciousness
    const labels = document.querySelectorAll('.label-float');
    labels.forEach((label, i) => {
      gsap.to(label, {
        opacity: 1, scale: 1, duration: 1.2, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.consciousness', start: 'top 50%' },
        onComplete: () => {
          gsap.to(label, { y: '+=15', x: '+=10', duration: 3 + Math.random() * 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() });
        }
      });
    });

    gsap.to('.grass-1', { y: -50, ease: 'none', scrollTrigger: { trigger: '.consciousness', start: 'top bottom', end: 'bottom top', scrub: 0.5 }});
    gsap.to('.grass-2', { y: -100, ease: 'none', scrollTrigger: { trigger: '.consciousness', start: 'top bottom', end: 'bottom top', scrub: 0.5 }});
    gsap.to('.grass-3', { y: -70, ease: 'none', scrollTrigger: { trigger: '.consciousness', start: 'top bottom', end: 'bottom top', scrub: 0.5 }});
    gsap.to('.brand-lockup', { y: 30, ease: 'none', scrollTrigger: { trigger: '.consciousness', start: 'top bottom', end: 'bottom top', scrub: 0.5 }});

    // Editorial Grid
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 1;
      gsap.fromTo(item, { y: 30 * speed }, { 
        y: -30 * speed, 
        ease: 'none', 
        scrollTrigger: { 
          trigger: '.editorial-grid', 
          start: 'top bottom', 
          end: 'bottom top', 
          scrub: 0.5 // Add slight smoothing to scrub
        }
      });
    });

    // Founder Note
    gsap.to('.founder-img', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: '.founder-note', start: 'top bottom', end: 'bottom top', scrub: 0.5 }});

    // General Fade Ups
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }});
    });

    // Floating Illustrations Parallax
    document.querySelectorAll('.floating-illustration').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 1;
      gsap.to(el, {
        y: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });

    ScrollTrigger.refresh();
  }

  // --- Magnetic elements ---
  document.querySelectorAll('.nav button, .brand-logo, .footer-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // --- Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuCloseBtn = document.querySelector('.menu-close-btn');
  let menuOpen = false;

  const closeMenu = () => {
    menuOpen = false;
    menuOverlay.classList.remove('open');
    menuToggle.textContent = 'MENU';
  };

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuToggle.textContent = menuOpen ? 'CLOSE' : 'MENU';
      
      if (menuOpen) {
        // Prepare starting states for dynamic reveal
        gsap.set('.nav-section-title, .nav-section-num, .nav-section-links li a, .connect-links li a', { opacity: 0, y: 30 });
        
        menuOverlay.classList.add('open');
        
        // Staggered reveal of headers
        gsap.to('.nav-section-title, .nav-section-num', { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.05, 
          ease: 'power3.out', 
          delay: 0.25 
        });
        
        // Staggered reveal of individual links
        gsap.to('.nav-section-links li a, .connect-links li a', { 
          y: 0, 
          opacity: 1, 
          duration: 1.0, 
          stagger: 0.02, 
          ease: 'power4.out', 
          delay: 0.35 
        });
      } else {
        closeMenu();
      }
    });

    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

    // Interactive Showcase Image Hover with Ken Burns dynamic feel
    const showcaseImg = document.getElementById('menu-showcase-img');
    const hoverLinks = document.querySelectorAll('.menu-navigation-grid a[data-img]');
    
    hoverLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const newImgSrc = link.getAttribute('data-img');
        if (showcaseImg && newImgSrc && showcaseImg.getAttribute('src') !== newImgSrc) {
          showcaseImg.classList.add('fade-out');
          setTimeout(() => {
            showcaseImg.setAttribute('src', newImgSrc);
            showcaseImg.classList.remove('fade-out');
          }, 250);
        }
      });
    });

    // Close menu when clicking normal links
    document.querySelectorAll('.menu-navigation-grid a:not([target="_blank"])').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // --- Hero Animations ---
  function initHeroAnimations() {
    if (document.querySelector('.cinematic-title')) {
      const tl = gsap.timeline();
      gsap.set('.cinematic-title', { clearProps: 'transform' });
      tl.from('.cinematic-overlay', { opacity: 0, duration: 2, ease: 'power2.inOut' })
        .fromTo('.cinematic-title', { y: 150, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out' }, '-=1')
        .from('.cinematic-meta', { y: 20, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.2')
        .from('.cinematic-subtitle', { y: 20, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')
        .from('.cinematic-ctas', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
    }
  }

  // --- Marquee Logic ---
  function setupMarquee(selector, duration, direction = -1) {
    const tracks = document.querySelectorAll(selector);
    tracks.forEach(track => {
      const content = track.innerHTML;
      track.innerHTML = content + content;
      const animation = direction === -1 
        ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: duration, ease: "none", repeat: -1 })
        : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: duration, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: track, start: "top bottom", end: "bottom top",
        onEnter: () => animation.play(), onLeave: () => animation.pause(),
        onEnterBack: () => animation.play(), onLeaveBack: () => animation.pause()
      });
    });
  }



  // Monogram Parallax
  gsap.to('.philosophy-monogram', {
    y: -100, scrollTrigger: { trigger: '.founder-note', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });

  // Collection Progress
  const grid = document.querySelector('.editorial-grid');
  const progressBar = document.querySelector('.progress-bar');
  if (grid && progressBar) {
    grid.addEventListener('scroll', () => {
      const progress = (grid.scrollLeft / (grid.scrollWidth - grid.clientWidth)) * 100;
      progressBar.style.width = `${progress}%`;
    });
  }

  // ==========================================================================
  // E-COMMERCE CORE & SLIDING CART DRAWER INTEGRATION
  // ==========================================================================

  // 1. Inject Cart Drawer HTML & Overlay
  if (!document.querySelector('.cart-drawer')) {
    const drawerHTML = `
      <div class="cart-drawer">
        <div class="cart-drawer-header">
          <h3>Your Drawer</h3>
          <button class="cart-drawer-close">&times;</button>
        </div>
        <div class="cart-drawer-items"></div>
        <div class="cart-drawer-footer">
          <div class="cart-total">Total: <span class="cart-total-price">₹0</span></div>
          <button class="cart-checkout-btn">Book Entire Order</button>
        </div>
      </div>
      <div class="cart-overlay-bg"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }

  // 2. Inject Cart Button in Nav
  const navRight = document.querySelector('.nav-right');
  if (navRight && !document.querySelector('.cart-toggle')) {
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-toggle';
    cartBtn.innerHTML = `CART <span class="cart-count-badge" style="display: none;">0</span>`;
    navRight.insertBefore(cartBtn, navRight.firstChild);
  }

  // 3. Cart State Management
  let cartItems = JSON.parse(localStorage.getItem('as_cart_items')) || [];

  const updateCartUI = () => {
    const countBadge = document.querySelector('.cart-count-badge');
    const drawerItems = document.querySelector('.cart-drawer-items');
    const totalPriceEl = document.querySelector('.cart-total-price');

    if (countBadge) {
      if (cartItems.length === 0) {
        countBadge.style.display = 'none';
      } else {
        countBadge.style.display = 'inline-block';
        countBadge.textContent = cartItems.length;
        countBadge.classList.add('bump');
        setTimeout(() => countBadge.classList.remove('bump'), 300);
      }
    }

    if (drawerItems) {
      if (cartItems.length === 0) {
        drawerItems.innerHTML = '<div class="cart-empty-msg">Your collection is empty.</div>';
      } else {
        drawerItems.innerHTML = cartItems.map((item, index) => {
          const priceStr = item.price.replace('/-', '').replace('₹', '').trim();
          return `
            <div class="cart-item">
              <img src="${item.img}" alt="${item.name}" class="cart-item-img">
              <div class="cart-item-details">
                <div>
                  <h4 class="cart-item-name">${item.name}</h4>
                  <div class="cart-item-meta">Size: ${item.size}</div>
                </div>
                <div class="cart-item-price-row">
                  <span class="cart-item-price">₹${priceStr}</span>
                  <button class="cart-item-remove" data-index="${index}">Remove</button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Wire up remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
          });
        });
      }
    }

    if (totalPriceEl) {
      const total = cartItems.reduce((acc, item) => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return acc + priceNum;
      }, 0);
      totalPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
  };

  const saveCart = () => {
    localStorage.setItem('as_cart_items', JSON.stringify(cartItems));
    updateCartUI();
  };

  const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    saveCart();
  };

  // Expose global dynamic function to add items to cart
  window.addToASCart = (name, size, price, img) => {
    cartItems.push({ name, size, price, img });
    saveCart();
    openCartDrawer();
  };

  // 4. Cart Drawer Toggle Controls
  const cartToggle = document.querySelector('.cart-toggle');
  const cartClose = document.querySelector('.cart-drawer-close');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay-bg');
  const checkoutBtn = document.querySelector('.cart-checkout-btn');

  const openCartDrawer = () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  };

  const closeCartDrawer = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  };

  if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
  if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) return;
      // Redirect to Shopify backend checkout flow integration
      const itemsPayload = encodeURIComponent(JSON.stringify(cartItems));
      window.location.href = `https://arshia-singh-website.myshopify.com/cart?checkout=true&items=${itemsPayload}`;
    });
  }

  // Initialize UI
  updateCartUI();

  // ==========================================================================
  // DYNAMIC CATEGORY PRODUCT RENDERING
  // ==========================================================================
  const pageTitleEl = document.querySelector('.subpage-hero-title');
  const gridContainer = document.querySelector('.masterclass-grid');

  if (pageTitleEl && gridContainer) {
    const pageTitle = pageTitleEl.textContent.trim().toLowerCase();
    
    // Normalize categories to match the structure in products-data.js
    let matchedCategory = pageTitle;
    if (pageTitle === 'six yards of good') {
      matchedCategory = '6 yards of good';
    } else if (pageTitle === 'custom made for moments') {
      matchedCategory = 'custom made';
    }

    let displayProducts = [];
    
    if (pageTitle === 'top tier') {
      // Filter out products belonging to tops/dresses/shirts
      displayProducts = products.filter(p => 
        p.name.toLowerCase().includes('dress') || 
        p.name.toLowerCase().includes('shirt') || 
        p.name.toLowerCase().includes('kurta') ||
        p.category.toLowerCase() === 'power layers'
      ).slice(0, 6);
    } else {
      displayProducts = products.filter(p => p.category && p.category.toLowerCase() === matchedCategory);
    }

    if (displayProducts.length > 0) {
      gridContainer.innerHTML = displayProducts.map(p => {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
        const cleanPrice = p.price !== 'N/A' ? `₹${p.price.replace('/-', '')}` : 'Price on Request';
        return `
          <a href="product-detail.html?product=${slug}" class="masterclass-item fade-up" style="color: inherit; display: block; text-decoration: none;">
            <div class="luxury-card">
              <img src="${p.img}" alt="${p.name.toUpperCase()}">
              <div class="luxury-card-overlay">
                <h3 class="luxury-card-title">${p.name.toUpperCase()}</h3>
                <p class="luxury-card-meta">${p.fabric.toUpperCase()} // ${cleanPrice}</p>
              </div>
            </div>
          </a>
        `;
      }).join('');

      // Stagger animations for dynamic elements via GSAP
      document.querySelectorAll('.masterclass-item.fade-up').forEach((el) => {
        gsap.from(el, { 
          y: 40, 
          opacity: 0, 
          duration: 1.2, 
          ease: 'power3.out', 
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });
    }
  }

  // Inject luxury menu clock & branding info dynamically
  const menuGrid = document.querySelector('.menu-navigation-grid');
  if (menuGrid && !document.querySelector('.menu-footer-info')) {
    const footerHTML = `
      <div class="menu-footer-info">
        <div class="m-footer-left">ARSHIA SINGH © 2026 / CONSCIOUS LUXURY</div>
        <div class="m-footer-right">NEW DELHI, IN // LOCAL TIME <span class="menu-local-time">00:00:00</span></div>
      </div>
    `;
    menuGrid.parentElement.insertAdjacentHTML('beforeend', footerHTML);
    
    const timeSpan = document.querySelector('.menu-local-time');
    const updateMenuClock = () => {
      if (timeSpan) {
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      }
    };
    updateMenuClock();
    setInterval(updateMenuClock, 1000);
  }
});
