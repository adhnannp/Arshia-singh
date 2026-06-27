'use client';

export const runtime = "edge";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import Footer from '../../../components/Footer';
import { useCart } from '../../../components/CartContext';
import { products } from '../../../data/products-data';

// Scraped image mapping for each product name
const PRODUCT_GALLERY_IMAGES = {
  'RANGREZ BLAZER SET': [
    '/assets/RANGREZ_BLAZER_SET_Page_3_Image_1.jpeg',
    '/assets/RANGREZ_BLAZER_SET_Page_3_Image_2.jpeg',
    '/assets/RANGREZ_BLAZER_SET_Page_3_Image_3.jpeg',
  ],
  'RANGREZ DHOTI BLAZER SET': [
    '/assets/RANGREZ_DHOTI_BLAZER_SET_Page_4_Image_1.jpeg',
    '/assets/RANGREZ_DHOTI_BLAZER_SET_Page_4_Image_2.jpeg',
    '/assets/RANGREZ_DHOTI_BLAZER_SET_Page_4_Image_3.jpeg',
  ],
  'RAAT PRINT SHARARA CAPE SET': [
    '/assets/RAAT_PRINT_SHARARA_CAPE_SET_Page_5_Image_1.png',
    '/assets/RAAT_PRINT_SHARARA_CAPE_SET_Page_5_Image_2.png',
    '/assets/RAAT_PRINT_SHARARA_CAPE_SET_Page_5_Image_3.jpeg',
  ],
  'BLOCK PRINT PALAZZO CO-ORD': [
    '/assets/block_print_palazzo_co-ord_Page_6_Image_1.jpeg',
    '/assets/block_print_palazzo_co-ord_Page_6_Image_2.jpeg',
    '/assets/block_print_palazzo_co-ord_Page_6_Image_3.jpeg',
    '/assets/block_print_palazzo_co-ord_Page_6_Image_4.jpeg',
  ],
  'PASTEL EMBROIDERED COORD SET': [
    '/assets/pastel_embroidered_Page_7_Image_1.jpeg',
    '/assets/pastel_embroidered_Page_7_Image_2.jpeg',
    '/assets/pastel_embroidered_Page_7_Image_3.jpeg',
    '/assets/pastel_embroidered_Page_7_Image_4.jpeg',
  ],
  'MULTI COLORED PHULKARI CAPE CO-ORD SET': [
    '/assets/multi_colored_phulkari_Page_8_Image_1.jpeg',
    '/assets/multi_colored_phulkari_Page_8_Image_2.jpeg',
    '/assets/multi_colored_phulkari_Page_8_Image_3.jpeg',
    '/assets/multi_colored_phulkari_Page_8_Image_4.jpeg',
  ],
  'RAVEL WAIST COAT PANT SET': [
    '/assets/Ravel_Waist_Coat_Pant_Page_9_Image_1.jpeg',
    '/assets/Ravel_Waist_Coat_Pant_Page_9_Image_2.jpeg',
    '/assets/Ravel_Waist_Coat_Pant_Page_9_Image_3.jpeg',
    '/assets/Ravel_Waist_Coat_Pant_Page_9_Image_4.jpeg',
  ],
  'RAVEL PRINT CORSET SKIRT SET': [
    '/assets/RAVEL_PRINT_CORSET_SKIRT_Page_10_Image_1.jpeg',
    '/assets/RAVEL_PRINT_CORSET_SKIRT_Page_10_Image_2.jpeg',
    '/assets/RAVEL_PRINT_CORSET_SKIRT_Page_10_Image_3.jpeg',
  ],
  'RAAT PRINT CAPE SKIRT SET': [
    '/assets/RAAT_PRINT_CAPE_SKIRT_Page_12_Image_1.jpeg',
    '/assets/RAAT_PRINT_CAPE_SKIRT_Page_12_Image_2.jpeg',
    '/assets/RAAT_PRINT_CAPE_SKIRT_Page_12_Image_3.jpeg',
  ],
  'GULZAAR PRINT BLAZER SET': [
    '/assets/GULZAAR_PRINT_BLAZER_Page_22_Image_1.jpeg',
    '/assets/GULZAAR_PRINT_BLAZER_Page_22_Image_2.jpeg',
    '/assets/GULZAAR_PRINT_BLAZER_Page_22_Image_3.jpeg',
  ],
  'LIBAAS PRINT CO-ORD': [
    '/assets/LIBAAS_PRINT_CO-ORD_Page_23_Image_1.png',
    '/assets/LIBAAS_PRINT_CO-ORD_Page_23_Image_2.png',
    '/assets/LIBAAS_PRINT_CO-ORD_Page_25_Image_3.jpeg',
  ],
  'RAAT PRINT KAFTAN': [
    '/assets/RAAT_PRINT_KAFTAN_Page_26_Image_1.jpeg',
    '/assets/RAAT_PRINT_KAFTAN_Page_26_Image_2.jpeg',
    '/assets/RAAT_PRINT_KAFTAN_Page_26_Image_3.jpeg',
    '/assets/RAAT_PRINT_KAFTAN_Page_26_Image_4.jpeg',
  ],
  'LEHER PRINT OVER SIZED JACKET': [
    '/assets/LEHER_PRINT_OVER_Page_28_Image_1.png',
  ],
  'RAVEL PRINT BLAZER DRESS': [
    '/assets/RAVEL_PRINT_BLAZER_DRESS_Page_29_Image_1.jpeg',
  ],
  'WHITE CROPPED BLAZER BLACK EMBROIDERY': [
    '/assets/WHITE_CROPPED_BLAZER_BLACK_Page_30_Image_1.jpeg',
    '/assets/WHITE_CROPPED_BLAZER_BLACK_Page_30_Image_2.jpeg',
  ],
  'BLACK LONG BLAZER': [
    '/assets/BLACK_LONG_BLAZER_Page_31_Image_1.jpeg',
    '/assets/BLACK_LONG_BLAZER_Page_31_Image_2.jpeg',
  ],
  '62 BAGH PHULKARI JACKET': [
    '/assets/62_BAGH_PHULKARI_JACKET_Page_32_Image_1.jpeg',
    '/assets/62_BAGH_PHULKARI_JACKET_Page_32_Image_2.jpeg',
    '/assets/62_BAGH_PHULKARI_JACKET_Page_32_Image_3.jpeg',
  ],
  'WHITE GOLD PHULKARI BLAZER': [
    '/assets/WHITE_GOLD_PHULKARI_BLAZER_Page_33_Image_1.jpeg',
  ],
  'RAVEL PRINT KAFTAN JACKET': [
    '/assets/RAVEL_PRINT_KAFTAN_JACKET_Page_34_Image_1.jpeg',
    '/assets/RAVEL_PRINT_KAFTAN_JACKET_Page_34_Image_2.jpeg',
  ],
  'WHITE GOLD SILVER KAFTAN JACKET': [
    '/assets/WHITE_GOLD_SILVER_Page_35_Image_1.png',
    '/assets/WHITE_GOLD_SILVER_Page_35_Image_2.jpeg',
    '/assets/WHITE_GOLD_SILVER_Page_35_Image_3.jpeg',
  ],
  'LIBAAS SAREE': ['/assets/LIBAAS_SAREE_Page_37_Image_1.png'],
  'RAVEL SAREE': ['/assets/RAVEL_SAREE_Page_38_Image_1.jpeg', '/assets/RAVEL_SAREE_Page_38_Image_2.jpeg'],
  'MARBLE PRINT SAREE': ['/assets/MARBLE_PRINT_SAREE_Page_39_Image_1.jpeg', '/assets/MARBLE_PRINT_SAREE_Page_39_Image_2.jpeg'],
  'RED WHITE EMBROIDERED LENGHA SET': ['/assets/DSC_8216.jpg'],
  'GULBERG PRINT KURTA': [
    '/assets/GULBERG_PRINT_KURTA_Page_45_Image_1.jpeg',
    '/assets/GULBERG_PRINT_KURTA_Page_45_Image_2.jpeg',
    '/assets/GULBERG_PRINT_KURTA_Page_46_Image_4.jpeg',
  ],
  'SAGE GREEN AND IVORY BRIDAL LENGHA': ['/assets/new_coll_6.jpg'],
  "SAGE GREEN AND BEIGE GROOM'S WEDDING OUTFIT": [
    '/assets/SAGE_GREEN_AND_BEIGE_Page_47_Image_1.jpeg',
    '/assets/SAGE_GREEN_AND_BEIGE_Page_47_Image_2.jpeg',
    '/assets/SAGE_GREEN_AND_BEIGE_Page_47_Image_3.jpeg',
  ],
  'DROP SHOULDER HEMP SHIRT': [
    '/assets/DROP_SHOULDER_HEMP_Page_54_Image_1.jpeg',
    '/assets/DROP_SHOULDER_HEMP_Page_55_Image_2.jpeg',
    '/assets/DROP_SHOULDER_HEMP_Page_55_Image_3.jpeg',
  ],
  'DROP SHOULDER EMBROIDERED SHIRT': ['/assets/new_coll_6.jpg'],
  'MARBLE 2.0 DROP SHOULDER SHIRT': [
    '/assets/MARBLE_2_0_DROP_SHOULDER_SHIRT_Page_58_Image_1.jpeg',
    '/assets/MARBLE_2_0_DROP_SHOULDER_SHIRT_Page_58_Image_2.jpeg',
  ],
  'LIBAAS DROP SHOULDER SHIRT': [
    '/assets/LIBAAS_DROP_SHOULDER_SHIRT_Page_59_Image_1.jpeg',
    '/assets/LIBAAS_DROP_SHOULDER_SHIRT_Page_59_Image_2.jpeg',
  ],
  'GULZAAR DROP SHOULDER SHIRT': ['/assets/GULZAAR_DROP_SHOULDER_SHIRT_Page_60_Image_1.jpeg'],
  'MULTI COLORED PHULKARI BUNDI JACKET': [
    '/assets/MULTI_COLORED_PHULKARI_Page_62_Image_1.jpeg',
    '/assets/MULTI_COLORED_PHULKARI_Page_62_Image_2.jpeg',
  ],
  'ALMOND WHITE AND BLUE PHULKARI BUNDI JACKET': [
    '/assets/ALMOND_WHITE_AND_BLUE_Page_63_Image_1.jpeg',
    '/assets/ALMOND_WHITE_AND_BLUE_Page_63_Image_2.jpeg',
    '/assets/ALMOND_WHITE_AND_BLUE_Page_63_Image_3.jpeg',
  ],
  'WHITE PEACH RED FLORAL SHIRT': [
    '/assets/WHITE_PEACH_RED_Page_65_Image_1.jpeg',
    '/assets/WHITE_PEACH_RED_Page_65_Image_2.jpeg',
  ],
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('in');
  const [activeSlide, setActiveSlide] = useState(0);
  const [withBlazer, setWithBlazer] = useState(false);

  // Find product by slug
  const product = products.find((p) => {
    const s = p.name.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/[^a-z0-9-]/g, '');
    return s === slug;
  });

  const isMens = product && (
    product.category?.toLowerCase() === 'natural luxury' ||
    product.category?.toLowerCase() === 'printed stories' ||
    product.category?.toLowerCase() === 'modern classics' ||
    product.name?.toLowerCase().includes("groom")
  );

  const isBlockPrintPalazzo = product?.name === 'BLOCK PRINT PALAZZO CO-ORD';
  const displayPrice = isBlockPrintPalazzo 
    ? (withBlazer ? '10000/-' : '7000/-')
    : product?.price;

  const images = product
    ? (PRODUCT_GALLERY_IMAGES[product.name.toUpperCase()] || PRODUCT_GALLERY_IMAGES[product.name] || [product.img])
    : [];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  useEffect(() => {
    if (!product) return;
    
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
    return `₹${price.replace('/-', '').replace('₹', '').trim()}`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 700);
      return;
    }
    const finalName = isBlockPrintPalazzo 
      ? `${product.name} (${withBlazer ? 'With Blazer' : 'Without Blazer'})` 
      : product.name;
    addToCart(finalName, selectedSize, displayPrice, images[0]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    const optionText = isBlockPrintPalazzo ? ` (${withBlazer ? 'With Blazer' : 'Without Blazer'})` : '';
    const msg = `Hi! I'm interested in ${product.name}${optionText} (Size: ${selectedSize || 'TBD'}) - ${formatPrice(displayPrice)}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
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
              <img src={images[activeSlide]} alt={product.name} />
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

          {/* Product Name */}
          <h1 className="pd-title">{product.name}</h1>

          {/* Pricing */}
          <div className="pd-price">{formatPrice(displayPrice)}</div>

          {/* Editorial Description */}
          <div className="pd-description">{product.details}</div>

          {/* Garment Highlights */}
          <div className="pd-tags">
            {product.fabric && product.fabric !== 'N/A' && (
              <span className="pd-tag">{product.fabric}</span>
            )}
            {product.textile && product.textile !== 'N/A' && (
              <span className="pd-tag">{product.textile}</span>
            )}
            {product.print && product.print !== 'N/A' && (
              <span className="pd-tag">{product.print} Print</span>
            )}
            {product.lining && product.lining !== 'N/A' && product.lining !== 'NO' && (
              <span className="pd-tag">Lined Edition</span>
            )}
          </div>

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

          {/* Size Selection Grid */}
          <div className="pd-size-section">
            <div className="pd-size-header">
              <span className="pd-size-label">Select Silhouette Size</span>
              <button className="pd-size-guide" onClick={() => setShowSizeModal(true)}>Size Chart</button>
            </div>
            <div className={`pd-size-grid ${sizeError ? 'size-error' : ''}`}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && <p className="pd-size-error-msg">Please pick a size to proceed with check out.</p>}
          </div>

          {/* Checkout & Enquire CTAs */}
          <div className="pd-cta-group">
            <button
              className={`pd-btn-primary ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button className="pd-btn-whatsapp" onClick={handleWhatsApp}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
