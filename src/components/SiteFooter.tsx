import Link from "next/link";
import { FacebookLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid section-shell">
        <div>
          <h2>CALL US</h2>
          <a href={`tel:${siteConfig.phone}`} data-ga-event="click_to_call">
            {siteConfig.phoneDisplay}
          </a>
        </div>
        <div>
          <h2>EMAIL US</h2>
          <a href={`mailto:${siteConfig.email}`} data-ga-event="click_email">
            {siteConfig.email}
          </a>
        </div>
        <div>
          <h2>REQUEST A QUOTE</h2>
          <Link href="/quote/" data-ga-event="quote_cta">
            Request A Quote Here
          </Link>
        </div>
        <div>
          <h2>FOLLOW US</h2>
          <div className="social-links">
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Follow VZN Prints on Instagram">
              <InstagramLogo size={25} weight="fill" />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Follow VZN Prints on Facebook">
              <FacebookLogo size={25} weight="fill" />
            </a>
          </div>
        </div>
        <div className="footer-menu">
          <h2>MENU</h2>
          {siteConfig.navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="site-footer__bottom">
        © {new Date().getFullYear()} VZN Prints All Rights Reserved. | Powered &amp; Designed by Citryn, LLC
      </div>
    </footer>
  );
}
