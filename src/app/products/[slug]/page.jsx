'use client';

export const runtime = "edge";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../../../components/Footer';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import { useWishlist } from '../../../components/WishlistContext';
import { fetchProductByHandle } from '../../../lib/shopify/queries/products';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

const WOMEN_SIZE_DATA = [
  { brand: 'XS', uk: '6', us: '2', eu: '34', bust_in: '32', waist_in: '25', hip_in: '35', bust_cm: '81', waist_cm: '64', hip_cm: '89' },
  { brand: 'S', uk: '8', us: '4', eu: '36', bust_in: '34', waist_in: '27', hip_in: '37', bust_cm: '86', waist_cm: '69', hip_cm: '94' },
  { brand: 'M', uk: '10', us: '6', eu: '38', bust_in: '36', waist_in: '29', hip_in: '39', bust_cm: '91', waist_cm: '74', hip_cm: '99' },
  { brand: 'L', uk: '12', us: '8', eu: '40', bust_in: '38', waist_in: '31', hip_in: '41', bust_cm: '97', waist_cm: '79', hip_cm: '104' },
  { brand: 'XL', uk: '14', us: '10', eu: '42', bust_in: '40', waist_in: '33', hip_in: '43', bust_cm: '102', waist_cm: '84', hip_cm: '109' },
  { brand: '2XL', uk: '16', us: '12', eu: '44', bust_in: '42', waist_in: '36', hip_in: '46', bust_cm: '107', waist_cm: '91', hip_cm: '117' },
  { brand: '3XL', uk: '18', us: '14', eu: '46', bust_in: '45', waist_in: '39', hip_in: '49', bust_cm: '114', waist_cm: '99', hip_cm: '124' },
  { brand: '4XL', uk: '20', us: '16', eu: '48', bust_in: '48', waist_in: '42', hip_in: '52', bust_cm: '122', waist_cm: '107', hip_cm: '132' }
];

const MEN_SIZE_DATA = [
  { brand: 'XS', uk: '34', us: '34', eu: '44', chest_in: '34', waist_in: '30', hip_in: '35', chest_cm: '86', waist_cm: '76', hip_cm: '89' },
  { brand: 'S', uk: '36', us: '36', eu: '46', chest_in: '36', waist_in: '32', hip_in: '37', chest_cm: '91', waist_cm: '81', hip_cm: '94' },
  { brand: 'M', uk: '38', us: '38', eu: '48', chest_in: '38', waist_in: '34', hip_in: '39', chest_cm: '97', waist_cm: '86', hip_cm: '99' },
  { brand: 'L', uk: '40', us: '40', eu: '50', chest_in: '40', waist_in: '36', hip_in: '41', chest_cm: '102', waist_cm: '91', hip_cm: '104' },
  { brand: 'XL', uk: '42', us: '42', eu: '52', chest_in: '42', waist_in: '38', hip_in: '43', chest_cm: '107', waist_cm: '97', hip_cm: '109' },
  { brand: '2XL', uk: '44', us: '44', eu: '54', chest_in: '44', waist_in: '40', hip_in: '45', chest_cm: '112', waist_cm: '102', hip_cm: '114' },
  { brand: '3XL', uk: '46', us: '46', eu: '56', chest_in: '46', waist_in: '43', hip_in: '48', chest_cm: '117', waist_cm: '109', hip_cm: '122' },
  { brand: '4XL', uk: '48', us: '48', eu: '58', chest_in: '48', waist_in: '46', hip_in: '51', chest_cm: '122', waist_cm: '117', hip_cm: '130' }
];

// Helper: Normalize Shopify GraphQL product node to UI product structure
const normalizeProductDetail = (node) => {
  if (!node) return null;

  const metafieldMap = {};
  if (Array.isArray(node.metafields)) {
    node.metafields.forEach(m => {
      if (m && m.key) {
        metafieldMap[m.key] = m.value;
      }
    });
  }

  const rawPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const formattedPrice = rawPrice > 0
    ? `₹${Math.round(rawPrice).toLocaleString('en-IN')}/-`
    : 'Price on Request';

  const shopifyImages = (node.images?.nodes || []).map(img => img.url);
  const images = shopifyImages.length > 0 ? shopifyImages : ['/assets/placeholder.jpg'];

  // Dynamic sizes from Shopify options if available
  const sizeOption = (node.options || []).find(o => o.name?.toLowerCase() === 'size');
  const sizes = sizeOption && sizeOption.values?.length > 0
    ? sizeOption.values
    : DEFAULT_SIZES;

  return {
    id: node.id,
    name: node.title,
    title: node.title,
    handle: node.handle,
    description: node.description,
    details: metafieldMap.details || node.description || 'Consciously constructed luxury garment edit.',
    price: formattedPrice,
    rawPrice: rawPrice,
    currencyCode: node.priceRange?.minVariantPrice?.currencyCode || 'INR',
    img: images[0] || '/assets/placeholder.jpg',
    images: images,
    availableForSale: node.availableForSale,
    sizes: sizes,
    category: metafieldMap.category || 'Luxury Edit',
    fabric: metafieldMap.fabric || 'PETA Approved Vegan',
    components: metafieldMap.components || '',
    print: metafieldMap.category2 || metafieldMap.category || '',
    fit: metafieldMap.fit || '',
    lining: metafieldMap.lining || '',
    pockets: metafieldMap.pockets || '',
    styling_tip: metafieldMap.styling_tip || '',
    wash_care: metafieldMap.wash_care || 'Dry clean recommended.',
    delivery: metafieldMap.delivery || '7 - 10 Business Days',
    textile: metafieldMap.textile || '',
    variants: node.variants?.nodes || [],
    metafields: metafieldMap,
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Dynamic Product State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI Interactive States
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [stockMessage, setStockMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('in');
  const [activeSlide, setActiveSlide] = useState(0);
  const [withBlazer, setWithBlazer] = useState(false);
  const [couplesOption, setCouplesOption] = useState('jacket'); // 'jacket', 'saree'

  // Fetch product dynamically from Shopify
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductByHandle(slug).then(data => {
      const norm = normalizeProductDetail(data);
      setProduct(norm);
      setLoading(false);
    });
  }, [slug]);

  // Helper: Find variant corresponding to a specific size
  const getSizeVariant = (size) => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(v =>
      v.selectedOptions?.some(
        opt => opt.name?.toLowerCase() === 'size' && opt.value?.toUpperCase() === size.toUpperCase()
      )
    );
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSizeError(false);

    const variant = getSizeVariant(size);
    if (variant && !variant.availableForSale) {
      setStockMessage(`⚠️ Size ${size} is currently out of stock. Inquire via WhatsApp for custom tailoring.`);
    } else {
      setStockMessage('');
    }
  };

  const selectedVariant = selectedSize ? getSizeVariant(selectedSize) : null;
  const isSelectedSizeOutOfStock = selectedSize && selectedVariant && !selectedVariant.availableForSale;

  // Dynamic values
  const isMens = product && (
    product.category?.toLowerCase() === 'natural luxury' ||
    product.category?.toLowerCase() === 'printed stories' ||
    product.category?.toLowerCase() === 'modern classics' ||
    product.name?.toLowerCase().includes("groom")
  );

  const isBlockPrintPalazzo = product?.name === 'BLOCK PRINT PALAZZO CO-ORD';
  const isRaatCouplesSet = product?.name === 'RAAT PRINT COUPLES SET';
  const displayPrice = isBlockPrintPalazzo
    ? (withBlazer ? '₹10,000/-' : '₹7,000/-')
    : isRaatCouplesSet
      ? (couplesOption === 'jacket' ? '₹7,000/-' : '₹16,500/-')
      : product?.price;

  const images = product?.images || ['/assets/placeholder.jpg'];

  useEffect(() => {
    setActiveSlide(0);
  }, [withBlazer, product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name.toUpperCase()} | ARSHIA SINGH`;

    // Page load entrance animations
    gsap.fromTo('.pd-left img',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
    );
    gsap.fromTo('.pd-right > *',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
    );
  }, [product]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] font-mono text-[13px] uppercase tracking-[0.2em] color-[#666]">
        <p>Loading Silhouette Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] font-mono text-[14px] uppercase tracking-[0.2em]">
        <p>Product not found.</p>
        <Link href="/" className="mt-5 underline">← Back to Home</Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price || price === 'N/A' || price === 'Price on Request') return 'Price on Request';
    return price.startsWith('₹') ? price : `₹${price.replace('/-', '').replace('₹', '').trim()}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 700);
      return;
    }

    if (isSelectedSizeOutOfStock) {
      setStockMessage(`⚠️ Size ${selectedSize} is out of stock and cannot be added to cart.`);
      return;
    }

    const finalName = isBlockPrintPalazzo
      ? `${product.name} (${withBlazer ? 'With Blazer' : 'Without Blazer'})`
      : isRaatCouplesSet
        ? `${product.name} (${couplesOption === 'jacket' ? 'Nehru Jacket' : 'Saree'})`
        : product.name;

    addToCart({
      name: finalName,
      size: selectedSize,
      price: displayPrice,
      img: images[0],
      handle: product.handle,
      variantId: selectedVariant?.id || null,
      availableForSale: product.availableForSale !== false && !isSelectedSizeOutOfStock
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    const optionText = isBlockPrintPalazzo
      ? ` (${withBlazer ? 'With Blazer' : 'Without Blazer'})`
      : isRaatCouplesSet
        ? ` (${couplesOption === 'jacket' ? 'Nehru Jacket' : 'Saree'})`
        : '';
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const msg = `Hi! I'm interested in ${product.name}${optionText}\n(Size: ${selectedSize || 'TBD'}) - ${formatPrice(displayPrice)}.\nProduct link: ${productUrl}`;
    window.open(`https://wa.me/919953275142?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      setActiveSlide(index);
    }
  };

  return (
    <>
      <div className="pd-wrapper">
        {/* ─── LEFT: IMAGE GALLERY (SLIDER ON MOBILE, STACK ON DESKTOP) ─── */}
        <div className="pd-left-wrapper">
          {/* Desktop/Carousel View */}
          <div className="pd-left-desktop-container">
            <div
              className="pd-main-image-zoom pd-zoom-container"
              onMouseMove={handleMouseMove}
            >
              <img src={images[activeSlide] || images[0]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbnails-desktop">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pd-thumbnail-item ${i === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(i)}
                  >
                    <img src={img} alt="thumbnail" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Swipe View */}
          <div className="pd-left-mobile-container">
            <div className="pd-left" onScroll={handleScroll}>
              {images.map((img, i) => (
                <div key={i} className="pd-image-slide">
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="pd-slide-dots">
                {images.map((_, i) => (
                  <span key={i} className={`pd-dot ${i === activeSlide ? 'active' : ''}`}></span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: STICKY INFO PANEL ─── */}
        <div className="pd-right">
          {/* Category Tag */}
          <div className="pd-badge">{product.category.toUpperCase()}</div>

          {/* Product Name & Wishlist Heart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <h1 className="pd-title" style={{ margin: 0 }}>{product.name}</h1>
            <button
              className={`wishlist-heart-btn-large ${isInWishlist(product.name) ? 'active' : ''}`}
              onClick={() => {
                requireAuth(() => {
                  toggleWishlist(product);
                });
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isInWishlist(product.name) ? '#b00' : '#888',
                transition: 'color 0.2s, transform 0.2s',
              }}
              title="Add to Wishlist"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(product.name) ? '#b00' : 'none'} stroke={isInWishlist(product.name) ? '#b00' : 'currentColor'} strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* Pricing */}
          <div className="pd-price">{formatPrice(displayPrice)}</div>

          {/* Editorial Description */}
          <div className="pd-description">{product.details}</div>

          {/* Blazer Option Selection (Only for Block Print Palazzo Co-ord) */}
          {isBlockPrintPalazzo && (
            <div className="pd-size-section mb-[30px]">
              <div className="pd-size-header">
                <span className="pd-size-label">Select Blazer Option</span>
              </div>
              <div className="pd-option-grid">
                <button
                  className={`pd-option-btn ${!withBlazer ? 'active' : ''}`}
                  onClick={() => setWithBlazer(false)}
                >
                  Without Blazer (₹7,000)
                </button>
                <button
                  className={`pd-option-btn ${withBlazer ? 'active' : ''}`}
                  onClick={() => setWithBlazer(true)}
                >
                  With Blazer (₹10,000)
                </button>
              </div>
            </div>
          )}

          {/* Option Selection for Raat Print Couples Set */}
          {isRaatCouplesSet && (
            <div className="pd-size-section mb-[30px]">
              <div className="pd-size-header">
                <span className="pd-size-label">Select Outfit Option</span>
              </div>
              <div className="pd-option-grid">
                <button
                  className={`pd-option-btn ${couplesOption === 'jacket' ? 'active' : ''}`}
                  onClick={() => setCouplesOption('jacket')}
                >
                  Nehru Jacket (₹7,000)
                </button>
                <button
                  className={`pd-option-btn ${couplesOption === 'saree' ? 'active' : ''}`}
                  onClick={() => setCouplesOption('saree')}
                >
                  Saree (₹16,500)
                </button>
              </div>
            </div>
          )}

          {/* Size Selection Grid */}
          <div className="pd-size-section">
            <div className="pd-size-header">
              <span className="pd-size-label">Select Silhouette Size</span>
              <button className="pd-size-guide" onClick={() => setShowSizeModal(true)}>Size Chart</button>
            </div>
            <div className={`pd-size-grid ${sizeError ? 'size-error' : ''}`}>
              {(product.sizes || DEFAULT_SIZES).map((size) => {
                const variant = getSizeVariant(size);
                const isAvailable = variant ? variant.availableForSale : true;
                return (
                  <button
                    key={size}
                    className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => handleSelectSize(size)}
                    style={{
                      opacity: !isAvailable ? 0.45 : 1,
                      textDecoration: !isAvailable ? 'line-through' : 'none',
                    }}
                    title={!isAvailable ? `Size ${size} - Out of Stock` : `Size ${size}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {sizeError && <p className="pd-size-error-msg">Please pick a size to proceed with check out.</p>}
            {stockMessage && <p className="pd-size-error-msg" style={{ color: '#b00', marginTop: '8px' }}>{stockMessage}</p>}
          </div>

          {/* Checkout & Enquire CTAs */}
          <div className="pd-cta-group">
            <button
              className={`pd-btn-primary ${addedToCart ? 'added' : ''} ${isSelectedSizeOutOfStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              style={isSelectedSizeOutOfStock ? { background: '#999', cursor: 'not-allowed' } : {}}
            >
              {addedToCart ? '✓ Added to Cart' : isSelectedSizeOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="pd-btn-whatsapp" onClick={handleWhatsApp}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Custom Order
            </button>
          </div>

          {/* Delivery Note */}
          {product.delivery && product.delivery !== 'N/A' && (
            <div className="pd-delivery-note">
              🚚 Delivery Timeline: <strong>{product.delivery}</strong>
            </div>
          )}

          {/* Editorial Specification Accordions */}
          <div className="pd-accordion">
            <div className={`pd-accordion-item ${openAccordion === 'details' ? 'active' : ''}`}>
              <button className="pd-accordion-header" onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}>
                <span>Garment Specifications</span>
                <span className="pd-accordion-icon">+</span>
              </button>
              <div className="pd-accordion-content">
                <div className="pd-spec-grid">
                  {product.fit && product.fit !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Silhouette Fit</span><span className="pd-spec-val">{product.fit}</span></div>}
                  {product.fabric && product.fabric !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">PETA Vegan</span><span className="pd-spec-val">{product.fabric}</span></div>}
                  {product.textile && product.textile !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Textile Craft</span><span className="pd-spec-val">{product.textile}</span></div>}
                  {product.print && product.print !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Applied Print</span><span className="pd-spec-val">{product.print}</span></div>}
                  {product.components && product.components !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Pieces Included</span><span className="pd-spec-val">{product.components} Set</span></div>}
                  {product.lining && product.lining !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Lining Support</span><span className="pd-spec-val">{product.lining}</span></div>}
                  {product.pockets && product.pockets !== 'N/A' && <div className="pd-spec"><span className="pd-spec-label">Pockets detailing</span><span className="pd-spec-val">{product.pockets}</span></div>}
                </div>
              </div>
            </div>

            {product.styling_tip && product.styling_tip !== 'N/A' && (
              <div className={`pd-accordion-item ${openAccordion === 'styling' ? 'active' : ''}`}>
                <button className="pd-accordion-header" onClick={() => setOpenAccordion(openAccordion === 'styling' ? null : 'styling')}>
                  <span>Styling Recommendation</span>
                  <span className="pd-accordion-icon">+</span>
                </button>
                <div className="pd-accordion-content">
                  <p className="pd-accordion-text">{product.styling_tip}</p>
                </div>
              </div>
            )}

            <div className={`pd-accordion-item ${openAccordion === 'care' ? 'active' : ''}`}>
              <button className="pd-accordion-header" onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}>
                <span>Care Instructions</span>
                <span className="pd-accordion-icon">+</span>
              </button>
              <div className="pd-accordion-content">
                <p className="pd-accordion-text">{product.wash_care || 'Dry clean recommended.'}</p>
              </div>
            </div>
          </div>

          <div className="pd-peta-note">PETA APPROVED VEGAN — 100% conscious design.</div>
        </div>
      </div>

      {/* ─── SIZE GUIDE CHART MODAL ─── */}
      {showSizeModal && (
        <div className="pd-modal-overlay" onClick={() => setShowSizeModal(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pd-modal-close" onClick={() => setShowSizeModal(false)}>&times;</button>
            <h3 className="pd-modal-title">{isMens ? "Men's Size Guide" : "Women's Size Guide"}</h3>

            <div className="pd-modal-content-wrapper">
              {/* Column 1: How to Measure Image */}
              <div className="pd-modal-col-left">
                <h4 className="pd-modal-subtitle">{isMens ? "MEN HOW TO MEASURE" : "WOMEN HOW TO MEASURE"}</h4>
                <div className="pd-measure-img-wrap">
                  <img
                    src={isMens ? "/assets/size-chart/men-measure.jpg" : "/assets/size-chart/women-measure.jpg"}
                    alt="How to measure diagram"
                  />
                </div>
              </div>

              {/* Column 2: Size Table & Details */}
              <div className="pd-modal-col-middle">
                <div className="pd-modal-table-header">
                  <h4 className="pd-modal-subtitle">Size Conversion</h4>
                  <div className="pd-unit-toggle">
                    <button
                      className={`pd-unit-btn ${sizeUnit === 'in' ? 'active' : ''}`}
                      onClick={() => setSizeUnit('in')}
                    >
                      IN
                    </button>
                    <span className="pd-unit-divider">/</span>
                    <button
                      className={`pd-unit-btn ${sizeUnit === 'cm' ? 'active' : ''}`}
                      onClick={() => setSizeUnit('cm')}
                    >
                      CM
                    </button>
                  </div>
                </div>

                <div className="pd-size-table-container">
                  <table className="pd-size-table">
                    <thead>
                      <tr>
                        <th>Brand</th>
                        <th>UK</th>
                        <th>US</th>
                        <th>EU</th>
                        <th>{isMens ? "Chest" : "Bust"}</th>
                        <th>Waist</th>
                        <th>Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isMens ? MEN_SIZE_DATA : WOMEN_SIZE_DATA).map((row) => (
                        <tr key={row.brand}>
                          <td><strong>{row.brand}</strong></td>
                          <td>{row.uk}</td>
                          <td>{row.us}</td>
                          <td>{row.eu}</td>
                          <td>{sizeUnit === 'in' ? (isMens ? row.chest_in : row.bust_in) : (isMens ? row.chest_cm : row.bust_cm)}</td>
                          <td>{sizeUnit === 'in' ? row.waist_in : row.waist_cm}</td>
                          <td>{sizeUnit === 'in' ? row.hip_in : row.hip_cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Column 3: Fit Guide, Website Note, and How to Measure */}
              <div className="pd-modal-col-right">
                <h4 className="pd-modal-subtitle">FIT & NOTES</h4>
                <div className="pd-fit-guide-clean" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                  <h5>Fit Guide</h5>
                  <p><strong>Tailored Fit:</strong> Choose your regular size.</p>
                  <p><strong>Relaxed Fit:</strong> Choose your regular size.</p>
                  <p><strong>Oversized Fit:</strong> Designed with extra ease; choose your regular size.</p>
                  <p><strong>Fitted/Corset Styles:</strong> If between sizes, size up.</p>
                </div>
                <div className="pd-fit-guide-clean">
                  <h5>Website Note</h5>
                  <p>
                    Our size chart is based on body measurements, not garment measurements. Individual
                    garments may vary depending on silhouette, fabric and intended fit. Refer to each
                    product page for style-specific sizing. If between sizes, choose the larger size or
                    contact our styling team.
                  </p>
                </div>
                <div className="pd-fit-guide-clean">
                  <h5>How to Measure</h5>
                  {isMens ? (
                    <p><strong>Men:</strong> Chest: fullest chest. Waist: natural waist. Hip: fullest part of seat.</p>
                  ) : (
                    <p><strong>Women:</strong> Bust: fullest part. Waist: natural waist. Hip: fullest part of hips.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
