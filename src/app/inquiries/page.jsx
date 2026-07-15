import Footer from '../../components/Footer';
import InquiriesClient from './InquiriesClient';

export const metadata = {
  title: 'Inquiries | ARSHIA SINGH',
  description: 'Get in touch with Arshia Singh for bespoke orders, custom design inquiries, and collaborations.',
};

export default function InquiriesPage() {
  return (
    <>
      <main className="pt-[var(--nav-height)]">
        <InquiriesClient />
      </main>
      <Footer />
    </>
  );
}

