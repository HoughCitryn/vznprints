"use client";

import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { siteConfig } from "@/content/site";
import { BrandLogo } from "@/components/BrandLogo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandLogo priority />
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
        </button>
        <nav
          id="primary-navigation"
          className={`primary-navigation${open ? " is-open" : ""}`}
          aria-label="Primary navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          {siteConfig.navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="nav-quote" href="/quote/" data-ga-event="quote_cta" onClick={() => setOpen(false)}>
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
