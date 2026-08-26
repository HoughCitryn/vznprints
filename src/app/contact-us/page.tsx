import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { mediaRoot, pageSeo, siteConfig } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.contact);

export default function ContactPage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.contact)} />
      <PageHero title="Contact Us" image={`${mediaRoot}/03/golf_course_40.png`} compact showQuote={false} />
      <section className="contact-section section-pad"><div className="section-shell contact-grid"><div><h2>Send a Message</h2><div className="contact-details">
        <p><Phone size={24} weight="fill" aria-hidden="true" /><span><strong>Call Us</strong><a href={`tel:${siteConfig.phone}`} data-ga-event="click_to_call">(661) 546-3113</a></span></p>
        <p><EnvelopeSimple size={24} weight="fill" aria-hidden="true" /><span><strong>Email Us</strong><a href={`mailto:${siteConfig.email}`} data-ga-event="click_email">{siteConfig.email}</a></span></p>
        <p><MapPin size={24} weight="fill" aria-hidden="true" /><span><strong>Location</strong>{siteConfig.location}</span></p>
      </div></div><LeadForm type="contact" /></div></section>
    </>
  );
}
