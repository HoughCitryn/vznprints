import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { fabrics, garments, mediaRoot, pageSeo, printMethods } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.apparel);

export default function ApparelPage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.apparel, "Apparel Printing and Embroidery")} />
      <PageHero title="Apparel Printing" subtitle="T-Shirts | Long Sleeve | Hoodies | Hats | Polos | Sportswear | Jerseys | Scrubs" image={`${mediaRoot}/03/Webp.net-resizeimage-1-min.jpg`} />

      <section className="section-pad print-methods"><div className="section-shell"><h2 className="section-title">Types Of Prints:</h2><div className="method-grid">
        {printMethods.map((method) => <article className="method-card" key={method.title}><div className="method-card__image"><Image src={method.image} alt={`${method.title} apparel printing`} fill sizes="(max-width: 767px) 100vw, 33vw" /></div><div className="method-card__body"><h3>{method.title}</h3><p>{method.description}<Link href="/quote/" data-ga-event="quote_cta">quote</Link>!</p></div></article>)}
      </div></div></section>

      <section className="garment-section section-pad"><div className="section-shell"><h2 className="section-title">Types Of Garments:</h2><div className="garment-grid">
        {garments.map((garment) => <article key={garment.title}><div className="garment-image"><Image src={garment.src} alt={`${garment.title} available for custom printing`} fill sizes="(max-width: 600px) 50vw, 25vw" /></div><h3>{garment.title}</h3></article>)}
      </div></div></section>

      <section className="fabric-section section-pad"><div className="section-shell"><h2 className="section-title">Types Of Fabrics:</h2><div className="fabric-grid">
        {fabrics.map((fabric) => <article key={fabric.title}><div className="fabric-image"><Image src={fabric.src} alt={`${fabric.title.replace("\n", " ")} fabric option`} fill sizes="(max-width: 600px) 50vw, 20vw" /></div><h3>{fabric.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3></article>)}
      </div></div></section>

      <section className="local-copy section-pad"><div className="section-shell narrow"><h2>T-Shirt Printing in Bakersfield</h2><p>VZN Prints provides T-shirt Printing in Bakersfield to individuals and large corporations. We take pride in providing a wide range of printing options to press onto your apparel. Bakersfield T-shirt printing is now affordable and quick thanks to VZN Prints awesome customer service! Our T-shirt printing in Bakersfield is fully customizable and our graphic designers are ready to start any design you may have in mind.</p><p>Our catalog currently carries over 500 different types of garments that are available to you to print on. If you’re looking for embroidery in Bakersfield, we can definitely help with your upcoming project. We can print on hoodies, tees, long sleeve, jerseys, medical scrubs, and man more! Lastly, our catalog carries apparel for infants, kids, teens, and adults!</p></div></section>
    </>
  );
}
