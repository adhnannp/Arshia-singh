import Footer from '../../components/Footer';

export const metadata = {
  title: 'Returns & Refunds | ARSHIA SINGH',
  description: 'Returns and Refunds Policy for Arshia Singh.',
};

export default function ReturnsAndRefundsPage() {
  return (
    <>
      <section className="policy-page">
        <div className="policy-container">
          <span className="policy-label">Policies</span>
          <h1 className="policy-title">Returns & Refunds</h1>
          <div className="policy-body">
            <p>
              Because we are a slow fashion label dedicated to reducing waste, each item is made to order or crafted in very limited quantities. We encourage conscious shopping to minimize returns.
            </p>
            <h2>Return Conditions</h2>
            <p>
              Standard sized orders are eligible for return within 7 days of delivery. To be eligible, your item must be in the same condition that you received it: unworn, unused, unwashed, and with tags attached.
            </p>
            <h2>Refund Processing</h2>
            <p>
              Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds will be credited back as store credit or to the original payment method within 7-10 business days. Custom or bespoke orders are non-refundable.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
