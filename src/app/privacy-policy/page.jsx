import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy | ARSHIA SINGH',
  description: 'Privacy Policy and details for Arshia Singh.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="policy-page">
        <div className="policy-container">
          <span className="policy-label">Policies</span>
          <h1 className="policy-title">Privacy Policy</h1>
          <div className="policy-body">
            <p>
              Your privacy is of utmost importance to us. This Privacy Policy details how we collect, use, and protect your personal information when you visit or make a purchase from the Arshia Singh website.
            </p>
            <h2>Data Collection</h2>
            <p>
              When you purchase products or browse our store, we collect personal information such as your name, contact details, shipping address, and payment information. This information is used strictly to process orders and improve your shopping experience.
            </p>
            <h2>Security</h2>
            <p>
              We take reasonable precautions and follow industry best practices to protect your personal information and ensure it is not lost, misused, accessed, disclosed, altered, or destroyed.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
