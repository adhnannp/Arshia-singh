import Link from 'next/link';
import Footer from '../../../components/Footer';
export const runtime = "edge";

export const metadata = {
  title: 'Journal Article | ARSHIA SINGH',
  description: 'Read the latest editorial stories from Arshia Singh Journal.',
};

const ARTICLES = {
  '1': {
    title: 'The Art of Slow Embroidery: Reviving Phulkari',
    category: 'Heritage Craft',
    date: 'June 18, 2026',
    img: '/assets/13.jpg',
    content: [
      'Phulkari, which literally translates to “flower work,” is more than just an embroidery style; it is Punjab’s historical craft, woven into the fabric of regional culture and ceremony. Traditionally, it was stitched by women on hand-spun khaddar using untwisted silk thread (Pat), creating vibrant floral and geometric motifs from the reverse side of the fabric.',
      'In a modern fast-fashion climate, this slow, meticulous craft faces the threat of dilution. Cheap machine imitations flood the market, lacking the depth, texture, and personal connection of hand-spun threads. At Arshia Singh, we believe in the preservation of the original hand-stitched Phulkari.',
      'Our team works directly with artisan clusters in Punjab, ensuring that our Karigars are compensated ethically for their exceptional skills. By integrating these historic hand-stitched patterns into contemporary silhouettes like structured blazers, trench coats, and modern coord sets, we breathe new life into an ancient tradition, allowing you to wear history as an act of modern self-expression.'
    ]
  },
  '2': {
    title: 'The Vegan Silk Revolution: Luxury Without Harm',
    category: 'Consciousness',
    date: 'May 24, 2026',
    img: '/assets/14.jpg',
    content: [
      'Conventional silk production (sericulture) is a process built on hidden violence. To harvest silk filaments without breaking them, silkworms are boiled alive inside their cocoons. It is a practice that stands directly in opposition to our core values at Arshia Singh.',
      'We set out to prove that luxury does not require cruelty. Our PETA-approved vegan label is committed to using premium, animal-free alternatives that deliver the identical drape, touch, and luxurious sheen of conventional silk.',
      'From advanced bio-based textiles to organic hemp and cotton blends, our fabrics are selected for both their sensory excellence and their environmental footprints. We believe that true luxury is conscious: it respects the life of all sentient beings, offering a sophisticated aesthetic that you can wear with pride and peace of mind.'
    ]
  },
  '3': {
    title: 'Dressing as Self-Expression: A Conversation with Arshia',
    category: 'Philosophy',
    date: 'April 12, 2026',
    img: '/assets/founder.jpeg',
    content: [
      '“Dressing up has never been about vanity for me,” says Arshia Singh. “It is an escape, an empowerment, an emotional shift. It is a quiet form of power.” In a world that constantly attempts to define us, what we choose to wear remains entirely within our control.',
      'At Arshia Singh, we design garments that act as an armor for the soul. We believe that fashion is not about conformity, but about expressing your internal state—your mood, your intentions, and your philosophy.',
      'Whether it’s a bold structured suit adorned with hand embroidery or a flowing organic patiala, every piece is made to support your personal transformation. When you choose to wear Arshia Singh, you are making an active decision to align your style with your consciousness.'
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
