import Footer from '../../components/Footer';

export const metadata = {
  title: 'Shipping Policy | ARSHIA SINGH',
  description: 'Shipping Policy and details for Arshia Singh orders.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="policy-page">
        <div className="policy-container">
          <span className="policy-label">Policies</span>
          <h1 className="policy-title">Shipping Policy</h1>
          <div className="policy-body">
            <p>
              At Arshia Singh, each garment is crafted with extreme care and precision. Because many of our pieces are hand-embroidered, custom-made, or produced in limited runs, shipping timelines vary depending on the item.
            </p>
            <h2>Domestic Shipping (India)</h2>
            <p>
              Standard domestic shipping within India is complimentary. Ready-to-ship items are dispatched within 3-5 business days. Bespoke, hand-embroidered, or pre-order pieces may take 3-6 weeks to process and ship. Once shipped, delivery takes 2-5 business days.
            </p>
            <h2>International Shipping</h2>
            <p>
              We offer worldwide international shipping. Shipping charges and import duties are calculated at checkout. Delivery timelines typically range from 7-14 business days from the dispatch date. Any custom duties or import taxes levied by the destination country are the responsibility of the customer.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
