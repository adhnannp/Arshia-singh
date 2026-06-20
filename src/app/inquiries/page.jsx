import Footer from '../../components/Footer';

export const metadata = {
  title: 'Inquiries | ARSHIA SINGH',
  description: 'Get in touch with Arshia Singh for bespoke orders, custom design inquiries, and collaborations.',
};

export default function InquiriesPage() {
  return (
    <>
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-10 pt-[120px] pb-[60px] text-center">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8a8a8f] block mb-5">
          Connect
        </span>

        <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-normal uppercase tracking-[0.02em] text-[#1d1d1f] leading-none mb-[30px]">
          Let&apos;s Create Together
        </h1>

        <p className="font-body text-base leading-[1.75] text-[#4a4a4f] max-w-[520px] mb-[50px] italic">
          For bespoke orders, custom design inquiries, bridal consultations, and collaborations, reach out directly via WhatsApp or Instagram.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="px-9 py-[18px] bg-[#1d1d1f] hover:bg-[#3a3a3f] text-white font-mono text-[10px] tracking-[0.2em] uppercase no-underline rounded-[3px] inline-flex items-center gap-2.5 transition-colors duration-300"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/arshia.singh.official"
            target="_blank"
            rel="noopener noreferrer"
            className="px-9 py-[18px] bg-transparent text-[#1d1d1f] border-[1.5px] border-black/18 font-mono text-[10px] tracking-[0.2em] uppercase no-underline rounded-[3px] inline-flex items-center gap-2.5 hover:bg-black/5 transition-colors duration-300"
          >
            Instagram @arshia.singh.official
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
