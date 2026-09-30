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
      <PageHero title="Contact Us" image={`${mediaRoot}/02/black-and-white-lights-abstract-curves.jpg`} compact showQuote={false} />
      <section className="contact-section section-pad"><div className="section-shell contact-grid"><div><h2>Send a Message</h2><div className="contact-details">
        <div className="contact-detail"><Phone size={24} weight="fill" aria-hidden="true" /><div><h3>Call Us</h3><a href={`tel:${siteConfig.phone}`} data-ga-event="click_to_call">(661) 546-3113</a></div></div>
        <div className="contact-detail"><EnvelopeSimple size={24} weight="fill" aria-hidden="true" /><div><h3>Email</h3><a href={`mailto:${siteConfig.email}`} data-ga-event="click_email">{siteConfig.email}</a></div></div>
        <div className="contact-detail"><MapPin size={24} weight="fill" aria-hidden="true" /><div><h3>Location</h3><span>{siteConfig.location}</span></div></div>
      </div></div><LeadForm type="contact" /></div></section>
    </>
  );
}
