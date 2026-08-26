import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { marketingItems, mediaRoot, pageSeo } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.marketing);

export default function MarketingMaterialPage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.marketing, "Marketing Materials Printing")} />
      <PageHero title="Promotional Items" subtitle="Business Cards | Brochures | Banners | Mugs | Pens | Bags | Posters | Signs" image={`${mediaRoot}/02/Business-Card-Printing-Bakersfield-CA.jpg`} />
      <section className="marketing-products section-pad"><div className="section-shell"><div className="marketing-grid">
        {marketingItems.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
      </div></div></section>
    </>
  );
}
