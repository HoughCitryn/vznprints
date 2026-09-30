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
      <PageHero title="LET’S GET YOU A QUOTE!" image={`${mediaRoot}/02/black-and-white-lights-abstract-curves.jpg`} compact showQuote={false} />
      <section className="quote-section section-pad">
        <div className="section-shell quote-grid">
          <div className="quote-intro">
            <h2>Request A Quote</h2>
            <p>Fill out the form below to receive an honest and accurate quote within 24 Hours. Quotes received on Weekends will be sent on Monday.</p>
          </div>
          <section aria-labelledby="quote-details-title">
            <h3 id="quote-details-title">Project Details</h3>
            <LeadForm type="quote" />
          </section>
        </div>
      </section>
    </>
  );
}
