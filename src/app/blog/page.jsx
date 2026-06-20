import Link from 'next/link';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'The Journal | ARSHIA SINGH',
  description: 'Arshia Singh Journal — stories of heritage craft, conscious fashion, and slow living.',
};

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Art of Slow Embroidery: Reviving Phulkari',
    category: 'Heritage Craft',
    date: 'June 18, 2026',
    img: '/assets/13.jpg',
    excerpt: 'An in-depth look into the history and modern evolution of Phulkari, Punjab’s traditional embroidery technique, and how our master Karigars preserve this generational art form.',
  },
  {
    id: 2,
    title: 'The Vegan Silk Revolution: Luxury Without Harm',
    category: 'Consciousness',
    date: 'May 24, 2026',
    img: '/assets/14.jpg',
    excerpt: 'Exploring how modern materials and bio-based textiles allow us to create high-end luxury garments with the touch and sheen of silk, entirely PETA-approved and vegan.',
  },
  {
    id: 3,
    title: 'Dressing as Self-Expression: A Conversation with Arshia',
    category: 'Philosophy',
    date: 'April 12, 2026',
    img: '/assets/founder.jpeg',
    excerpt: 'Our founder talks about the philosophy of dressing up as an emotional shift, a quiet form of power, and an intentional act of self-love.',
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
