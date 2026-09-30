import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  subtitleAs?: "p" | "h2";
  image: string;
  compact?: boolean;
  showQuote?: boolean;
};

export function PageHero({ title, subtitle, subtitleAs: Subtitle = "p", image, compact = false, showQuote = true }: PageHeroProps) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="page-hero__image" />
      <div className="page-hero__overlay" />
      <div className="page-hero__content section-shell">
        <h1>{title}</h1>
        {subtitle ? <Subtitle className="page-hero__subtitle">{subtitle}</Subtitle> : null}
        {showQuote ? (
          <Link className="button button--blue" href="/quote/" data-ga-event="quote_cta">
            Get a Quote
          </Link>
        ) : null}
      </div>
    </section>
  );
}
