import Link from 'next/link';
import Footer from '../../../components/Footer';
export const runtime = "edge";

export const metadata = {
  title: 'Journal Article | ARSHIA SINGH',
  description: 'Read the latest editorial stories from Arshia Singh Journal.',
};

const ARTICLES = {
  '1': {
    title: 'Fashion as a Reflection of Emotion',
    category: 'Philosophy',
    date: 'June 23, 2026',
    img: '/assets/blog1.png',
    content: [
      'Fashion is often viewed as a form of self expression, but it is also a reflection of emotion. The clothes we choose each day can mirror how we feel, how we want to feel, or even who we are becoming.',
      'Some days call for structured silhouettes that make us feel confident and powerful. Others invite soft fabrics, flowing shapes, and comfort. Whether consciously or unconsciously, we dress according to our moods, experiences, and aspirations. Clothing becomes an extension of our emotional landscape.',
      'Research in psychology refers to this as "enclothed cognition", the idea that what we wear can influence how we think, feel, and behave. A well-loved garment can evoke confidence, nostalgia, joy, or a sense of belonging. Fashion is not simply about appearance; it is deeply connected to identity and emotion.',
      'At ARSHIA SINGH, we believe clothing should move with the wearer through different moods, moments, and stages of life. Our collections are designed not only to be beautiful but also to create a feeling whether that feeling is strength, ease, celebration, or self-assurance.',
      'Because fashion is at its most meaningful when it helps us feel more like ourselves'
    ]
  },
  '2': {
    title: 'WHY VEGAN FASHION IS THE FUTURE OF LUXURY AND THE RIGHT INVESTMENT FOR YOUR WARDROBE?',
    category: 'Consciousness',
    date: 'June 20, 2026',
    img: '/assets/blog2.png',
    content: [
      'Luxury has long been associated with rarity, craftsmanship, and exceptional quality. Traditionally, this often meant materials such as silk, leather, fur, and wool. Today, however, a new definition of luxury is emerging one that values conscious choices as much as exquisite design.',
      'Vegan fashion represents this evolution. It challenges the idea that luxury must come at the expense of animals or the environment. Modern innovations in textiles have introduced fabrics that are not only beautiful and durable but also kinder to the planet. Materials such as hemp, Tencel™, and modal offer the softness, drape, and refinement expected from luxury garments while significantly reducing environmental impact.',
      'Consumers are also becoming more mindful of how their clothing is made. They seek transparency, ethical production, and products that align with their values. This shift has transformed sustainability from a niche concern into a defining characteristic of modern luxury.',
      'At ARSHIA SINGH, we believe true luxury lies in thoughtful craftsmanship. By combining premium vegan fabrics with traditional Indian artistry, we create garments that celebrate both style and responsibility. Luxury is no longer about excess it is about intention, quality, and a deeper connection to what we wear.',
      'As fashion continues to evolve, vegan luxury is proving that elegance and ethics can coexist beautifully. The future of luxury is not only about looking good; it is about feeling good about the choices we make.'
    ]
  },
  '3': {
    title: 'A Guide to Luxury Vegan Fabrics',
    category: 'Fabrics',
    date: 'June 18, 2026',
    img: '/assets/blog3.png',
    content: [
      'Luxury begins with exceptional materials. The fabric of a garment determines not only how it looks but also how it feels, drapes, and endures over time. Today, luxury fashion is embracing innovative vegan fabrics that deliver sophistication without relying on animal-derived materials.',
      'Hemp: Nature\'s Luxury Fibre\nHemp is one of the most sustainable fibres available. Known for its durability, breathability, and natural texture, it becomes softer with every wear while maintaining its strength. Hemp requires significantly less water than conventional crops and offers a timeless, effortless elegance.',
      'Tencel™: Softness with Purpose\nDerived from responsibly sourced wood pulp, Tencel™ is celebrated for its silky touch and fluid drape. Lightweight and breathable, it offers exceptional comfort while being produced through environmentally conscious processes. It is an ideal choice for modern luxury garments.',
      'Modal: Everyday Refinement\nModal is prized for its smooth texture, softness, and ability to retain colour beautifully. Comfortable against the skin and naturally breathable, it combines practicality with sophistication, making it a versatile fabric for contemporary wardrobes.',
      'Vegan Silk Alternatives\nLuxury does not require traditional silk. Modern vegan alternatives offer the same elegant sheen and graceful movement while eliminating the need for animal-derived fibres. These innovative fabrics provide the beauty of silk with a more conscious approach.',
      'Choosing Quality Over Quantity\nThe essence of luxury lies not in abundance but in thoughtful craftsmanship and enduring quality. Investing in garments made from premium vegan fabrics means choosing pieces designed to be worn, loved, and cherished for years to come.',
      'At ARSHIA SINGH, our commitment to luxury begins with carefully selected vegan materials. By combining vegan fabrics with expert craftsmanship, we create garments that embody elegance, comfort, and conscious living. Because true luxury is not only about how a garment looks—it is about the story it tells and the values it represents'
    ]
  },
  '4': {
    title: 'The Art of Phulkari: A Celebration of Heritage and Craftsmanship',
    category: 'Heritage Craft',
    date: 'June 15, 2026',
    img: '/assets/blog4.png',
    content: [
      'Phulkari, which translates to "flower work," is one of India\'s most cherished embroidery traditions. Originating in Punjab centuries ago, this intricate art form has been passed down through generations, carrying stories of culture, celebration, and identity within every stitch.',
      'Traditionally, Phulkari was embroidered by women on handwoven fabrics for weddings, festivals, and special occasions. Each piece was unique, featuring vibrant geometric patterns, floral motifs, and symbolic designs that reflected personal experiences and community traditions. More than decoration, Phulkari represented love, patience, and the artistry of skilled hands.',
      'In a world increasingly dominated by mass production, Phulkari stands as a reminder of the value of slow craftsmanship. Every embroidered motif requires time, precision, and an intimate understanding of the craft. The beauty of Phulkari lies not only in its visual richness but also in the stories woven into its creation.',
      'At ARSHIA SINGH, we honour this heritage by reimagining Phulkari for the contemporary wardrobe. By integrating traditional embroidery into modern silhouettes, we create pieces that bridge the past and the present. Our designs celebrate the artistry of Indian craftsmanship while ensuring that these cultural traditions continue to thrive in a modern context.',
      'Phulkari is more than an embellishment it is a living legacy. Every stitch connects us to generations of artisans who transformed fabric into storytelling, creating works of art that remain timeless.'
    ]
  }
};

export default function ArticlePage({ params }) {
  const article = ARTICLES[params.id];

  if (!article) {
    return (
      <section className="article-not-found">
        <div className="article-container text-center">
          <h1 className="article-not-found-title">Article Not Found</h1>
          <Link href="/blog" className="article-back-link">
            Back to Journal
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <article className="article-page">
        <div className="article-container">
          
          <Link href="/blog" className="article-back-link">
            &lt; Back to Journal
          </Link>
          
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Published</span>
              <span className="meta-value">{article.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Written By</span>
              <span className="meta-value">Arshia Singh Editorial</span>
            </div>
          </div>
          
          <div className="article-hero-image-wrapper">
            <img 
              src={article.img} 
              alt={article.title} 
              className="article-hero-image"
            />
          </div>
          
          <div className="article-content font-body">
            {article.content.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "article-lead" : "article-paragraph"}>
                {paragraph}
              </p>
            ))}
          </div>
          
        </div>
      </article>
      <Footer />
    </>
  );
}
