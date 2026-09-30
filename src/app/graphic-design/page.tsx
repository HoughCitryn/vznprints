import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { artworkExamples, mediaRoot, pageSeo } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.graphicDesign);

export default function GraphicDesignPage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.graphicDesign, "Graphic Design")} />
      <PageHero title="In House Graphic Design" subtitle="Artwork Creation & Product Design" image={`${mediaRoot}/02/life-coach-26.jpg`} />
      <section className="graphic-intro section-pad"><div className="section-shell narrow"><p>We provide a team of in-house graphic designers ready to design your artwork for your upcoming project. Need to recreate a logo or piece of old artwork? Possibly have an idea you want to print? We can help bring your artwork to life today! Contact us to ask a rep for pricing and further details.</p></div></section>
      <section className="artwork-section section-pad"><div className="section-shell"><h2 className="section-title">Artwork Examples:</h2><div className="artwork-grid">
        {artworkExamples.map((example) => <article className="artwork-tile" key={example.src}><h3 className="sr-only">{example.alt}</h3><Image src={example.src} alt={example.alt} fill sizes="(max-width: 767px) 100vw, 33vw" /></article>)}
      </div></div></section>
    </>
  );
}
