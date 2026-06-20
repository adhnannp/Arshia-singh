import Footer from '../../components/Footer';

export const metadata = {
  title: 'Exchange Policy | ARSHIA SINGH',
  description: 'Exchange Policy and details for Arshia Singh.',
};

export default function ExchangePolicyPage() {
  return (
    <>
      <section className="policy-page">
        <div className="policy-container">
          <span className="policy-label">Policies</span>
          <h1 className="policy-title">Exchange Policy</h1>
          <div className="policy-body">
            <p>
              We want you to feel confident and empowered in your Arshia Singh purchase. If a garment does not fit as desired, we offer size exchanges in accordance with this policy.
            </p>
            <h2>Size Exchanges</h2>
            <p>
              You can request a size exchange within 7 days of receiving your order. The garment must be unworn, unwashed, unaltered, and with all original tags and packaging intact.
            </p>
            <h2>Custom & Bespoke Orders</h2>
            <p>
              Please note that custom-sized or bespoke items tailored specifically to your measurements are final sale and cannot be exchanged. However, we offer complimentary alterations to ensure a perfect fit.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
