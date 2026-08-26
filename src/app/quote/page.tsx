import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { mediaRoot, pageSeo } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.quote);

export default function QuotePage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.quote, "Printing Quote")} />
      <PageHero title="Request A Quote" subtitle="Tell us about your project" image={`${mediaRoot}/02/black-and-white-lights-abstract-curves.jpg`} compact showQuote={false} />
      <section className="quote-section section-pad"><div className="section-shell quote-grid"><div><p className="eyebrow">Your Project Starts Here</p><h2>Get a Printing Quote</h2><p>Share your project details and we’ll follow up with the right options for your budget and timeline.</p><ul><li>Apparel printing and embroidery</li><li>Banners and marketing material</li><li>Graphic design and artwork recreation</li></ul></div><LeadForm type="quote" /></div></section>
    </>
  );
}
