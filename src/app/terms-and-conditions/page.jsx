import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms & Conditions | ARSHIA SINGH',
  description: 'Terms and Conditions for Arshia Singh website.',
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <section className="policy-page">
        <div className="policy-container">
          <span className="policy-label">Policies</span>
          <h1 className="policy-title">Terms & Conditions</h1>
          <div className="policy-body">
            <p>
              Welcome to the Arshia Singh website. By accessing or using our website, store, or services, you agree to comply with and be bound by the following Terms and Conditions.
            </p>
            <h2>Intellectual Property</h2>
            <p>
              All content on this site, including images, design elements, logo, text, graphics, and code, is the property of Arshia Singh and is protected by copyright laws. You may not copy, reproduce, or distribute any part of this site without our prior written consent.
            </p>
            <h2>Limitation of Liability</h2>
            <p>
              Arshia Singh shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services, or from products purchased through our store.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
