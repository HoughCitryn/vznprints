import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const attachmentRedirects = [
      ["/favicon3/", "/wp-content/uploads/2019/02/Favicon3.png"],
      ["/vzn-logo/", "/wp-content/uploads/2019/02/VZN-LOGO.png"],
      ["/cropped-favicon3-png/", "/wp-content/uploads/2019/02/cropped-Favicon3.png"],
      ["/cropped-favicon3-1-png/", "/wp-content/uploads/2019/02/cropped-Favicon3-1.png"],
      ["/life-coach-26/", "/wp-content/uploads/2019/02/life-coach-26.jpg"],
      ["/life-coach-03-1/", "/wp-content/uploads/2019/02/life-coach-03-1.jpg"],
      ["/okay-min/", "/wp-content/uploads/2019/02/okay-min.jpg"],
      ["/graphic-design-bakersfield-ca/", "/wp-content/uploads/2019/02/Graphic-Design-Bakersfield-CA.jpg"],
      ["/t-shirt-printing-bakersfield-ca/", "/wp-content/uploads/2019/02/T-Shirt-Printing-Bakersfield-CA.jpg"],
      ["/business-card-printing-bakersfield-ca/", "/wp-content/uploads/2019/02/Business-Card-Printing-Bakersfield-CA.jpg"],
      ["/embroidery-bakersfield-ca/", "/wp-content/uploads/2019/02/Embroidery-Bakersfield-CA.jpg"],
      ["/webp-net-resizeimage-min/", "/wp-content/uploads/2019/02/Webp.net-resizeimage-min.jpg"],
      ["/zvn-logo/", "/wp-content/uploads/2019/02/ZVN-LOGO.png"],
      ["/bella2/", "/wp-content/uploads/2019/02/bella2.png"],
      ["/aa/", "/wp-content/uploads/2019/02/aa.png"],
      ["/logo-ei-lo/", "/wp-content/uploads/2019/02/logo-ei-lo.png"],
      ["/anvil/", "/wp-content/uploads/2019/02/Anvil.png"],
      ["/black-and-white-lights-abstract-curves/", "/wp-content/uploads/2019/02/black-and-white-lights-abstract-curves.jpg"],
      ["/untitled-design-2/", "/wp-content/uploads/2019/03/Untitled-design.png"],
      ["/t-shirt-printing-in-bakersfield/", "/wp-content/uploads/2019/03/T-Shirt-Printing-in-Bakersfield.jpg"],
      ["/golf_course_40/", "/wp-content/uploads/2019/03/golf_course_40.png"],
      ["/hats/", "/wp-content/uploads/2019/03/Hats.png"],
      ["/crewneck1/", "/wp-content/uploads/2019/03/Crewneck1.png"],
      ["/hoodie1/", "/wp-content/uploads/2019/03/Hoodie1.png"],
      ["/jacket1/", "/wp-content/uploads/2019/03/Jacket1.png"],
      ["/long-sleeve1/", "/wp-content/uploads/2019/03/Long-Sleeve1.png"],
      ["/polo1/", "/wp-content/uploads/2019/03/Polo1.png"],
      ["/restaurant1/", "/wp-content/uploads/2019/03/Restaurant1.png"],
      ["/t-shirt1/", "/wp-content/uploads/2019/03/T-Shirt1.png"],
      ["/bottoms1/", "/wp-content/uploads/2019/03/Bottoms1.png"],
      ["/dri/", "/wp-content/uploads/2019/03/Dri.png"],
      ["/poly/", "/wp-content/uploads/2019/03/Poly.png"],
      ["/50-50/", "/wp-content/uploads/2019/03/50-50.png"],
      ["/100/", "/wp-content/uploads/2019/03/100.png"],
      ["/fish-logo/", "/wp-content/uploads/2019/03/Fish-Logo.png"],
      ["/vdsd/", "/wp-content/uploads/2019/03/vdsd.png"],
      ["/render-1d/", "/wp-content/uploads/2019/03/Render-1d.png"],
      ["/webp-net-resizeimage-1-min/", "/wp-content/uploads/2019/03/Webp.net-resizeimage-1-min.jpg"],
    ] as const;

    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vznprints.com" }],
        destination: "https://vznprints.com/:path*",
        permanent: true,
      },
      ...[
        "/wp-sitemap.xml",
        "/sitemap_index.xml",
        "/page-sitemap.xml",
        "/sitemap-1.xml",
        "/news-sitemap.xml",
      ].map((source) => ({
        source,
        destination: "/sitemap.xml",
        permanent: true,
      })),
      {
        source: "/image-sitemap-1.xml",
        destination: "/image-sitemap.xml",
        permanent: true,
      },
      ...attachmentRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
