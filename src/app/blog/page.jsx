import Link from 'next/link';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'The Journal | ARSHIA SINGH',
  description: 'Arshia Singh Journal — stories of heritage craft, conscious fashion, and slow living.',
};

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Fashion as a Reflection of Emotion',
    category: 'Philosophy',
    date: 'June 23, 2026',
    img: '/assets/blog1.png',
    excerpt: 'Fashion is often viewed as a form of self expression, but it is also a reflection of emotion. The clothes we choose each day can mirror how we feel, how we want to feel, or even who we are becoming.',
  },
  {
    id: 2,
    title: 'WHY VEGAN FASHION IS THE FUTURE OF LUXURY AND THE RIGHT INVESTMENT FOR YOUR WARDROBE?',
    category: 'Consciousness',
    date: 'June 20, 2026',
    img: '/assets/blog2.png',
    excerpt: 'Today, a new definition of luxury is emerging—one that values conscious choices as much as exquisite design. Vegan fashion represents this evolution, challenging the idea that luxury must come at the expense of animals or the environment.',
  },
  {
    id: 3,
    title: 'A Guide to Luxury Vegan Fabrics',
    category: 'Fabrics',
    date: 'June 18, 2026',
    img: '/assets/blog3.png',
    excerpt: 'Luxury begins with exceptional materials. The fabric of a garment determines not only how it looks but also how it feels, drapes, and endures over time. Today, luxury fashion is embracing innovative vegan fabrics.',
  },
  {
    id: 4,
    title: 'The Art of Phulkari: A Celebration of Heritage and Craftsmanship',
    category: 'Heritage Craft',
    date: 'June 15, 2026',
    img: '/assets/blog4.png',
    excerpt: 'Phulkari, which translates to "flower work," is one of India\'s most cherished embroidery traditions. Originating in Punjab centuries ago, this intricate art form has been passed down through generations.',
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="blog-page">
        <div className="blog-container">
          <header className="blog-header">
            <span className="blog-label">Journal</span>
            <h1 className="blog-title">The Journal</h1>
          </header>

          <div className="blog-rows-container">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="blog-row group"
              >
                <div className="blog-row-img">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="row-img"
                  />
                  <div className="row-img-overlay"></div>
                </div>

                <div className="blog-row-info">
                  <div className="blog-meta-row">
                    <span className="blog-meta-category">{post.category}</span>
                    <span className="blog-meta-dot"></span>
                    <span className="blog-meta-date">{post.date}</span>
                  </div>

                  <h2 className="row-title">{post.title}</h2>
                  <p className="row-excerpt">{post.excerpt}</p>

                  <span className="blog-row-read-more">
                    Read Article
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
