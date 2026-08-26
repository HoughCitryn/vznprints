import Image from "next/image";
import Link from "next/link";
import { mediaRoot } from "@/content/site";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Link className="brand-logo" href="/" aria-label="VZN Prints home">
      <Image
        src={`${mediaRoot}/02/VZN-LOGO.png`}
        alt="VZN Prints"
        width={708}
        height={338}
        priority={priority}
        sizes="(max-width: 767px) 150px, 174px"
      />
    </Link>
  );
}
