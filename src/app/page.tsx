import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock, CurrencyDollar, Tag } from "@phosphor-icons/react/dist/ssr";
import { StructuredData } from "@/components/StructuredData";
import { homeSellingPoints, homeServices, mediaRoot, occasions, pageSeo, productList, recommendedBrands } from "@/content/site";
import { createMetadata, pageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.home);
const pointIcons = { clock: Clock, tag: Tag, money: CurrencyDollar };

export default function HomePage() {
  return (
    <>
      <StructuredData data={pageJsonLd(pageSeo.home)} />
      <section className="home-hero">
        <Image src={`${mediaRoot}/02/T-Shirt-Printing-Bakersfield-CA.jpg`} alt="VZN Prints custom apparel printing" fill priority sizes="100vw" className="home-hero__image" />
        <div className="home-hero__overlay" />
        <div className="home-hero__content section-shell">
          <h1>Your Ultimate Printing Services Solution</h1>
          <h2>Printing company in Bakersfield, CA</h2>
          <p>Marketing Solutions | Promotional Items | &amp; More!</p>
          <Link href="/quote/" className="button button--blue" data-ga-event="quote_cta">Get a Quote</Link>
        </div>
      </section>

      <section className="selling-points" aria-label="Why choose VZN Prints">
        <div className="section-shell selling-points__grid">
          {homeSellingPoints.map((point) => {
            const Icon = pointIcons[point.icon];
            return <article key={point.title}><Icon size={46} weight="thin" aria-hidden="true" /><div><h2>{point.title}</h2><p>{point.detail}</p></div></article>;
          })}
        </div>
      </section>

      <section className="services-grid" aria-label="Printing services">
        {homeServices.map((service) => (
          <article className="service-card" key={service.title}>
            <Image src={service.image} alt={`${service.title} service from VZN Prints`} fill sizes="(max-width: 980px) 100vw, 50vw" />
            <div className="service-card__overlay" />
            <div className="service-card__content"><h2><Link href={service.href}>{service.title}</Link></h2><p>{service.description}</p><Link href={service.href} className="text-link">Learn More</Link></div>
          </article>
        ))}
      </section>

      <section className="new-you section-pad">
        <div className="section-shell new-you__grid">
          <div><p className="eyebrow">Give Your Business a New Look</p><h2>Say Hello to <span>THE NEW YOU</span></h2><p>VZN Prints is the print shop in Bakersfield of choice when it comes to your printing needs. Our products remain top-quality and are made to look retail ready. Bakersfield printing is now easy and affordable!</p></div>
          <div className="product-list">{productList.map((product) => <p key={product}><Check size={22} weight="bold" aria-hidden="true" />{product}</p>)}</div>
        </div>
      </section>

      <section className="occasions section-pad"><div className="section-shell"><h2 className="section-title">We Print For All Occasions</h2><div className="occasions__grid">
        {occasions.map((occasion, index) => <article key={occasion.title} className={`occasion occasion--${index + 1}`}><span className="occasion__number">0{index + 1}</span><h3>{occasion.title}</h3><p>{occasion.description}</p></article>)}
      </div></div></section>

      <section className="recommended-brands section-pad" aria-labelledby="recommended-brands-title">
        <div className="section-shell">
          <h2 id="recommended-brands-title" className="section-title">BRANDS WE RECOMMEND</h2>
          <ul className="recommended-brands__grid">
            {recommendedBrands.map((brand) => (
              <li key={brand.name}>
                <Image src={brand.src} alt={brand.name} width={brand.width} height={brand.height} sizes="(max-width: 767px) 40vw, 240px" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="clients section-pad"><div className="section-shell clients__grid"><div><p className="eyebrow">Our</p><h2>Clients</h2><p>Our Bakersfield printing services are second-to-none. We’ve worked with sports teams, medical offices, restaurants, and all sorts of other business’.</p></div><div className="clients__art"><Image src={`${mediaRoot}/03/Untitled-design.png`} alt="Businesses and organizations served by VZN Prints" fill sizes="(max-width: 767px) 100vw, 55vw" /></div></div></section>
    </>
  );
}
