import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VZN Prints",
    short_name: "VZN Prints",
    description: "Printing services in Bakersfield, CA",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0093d3",
    icons: [{ src: "/wp-content/uploads/2019/02/cropped-Favicon3-1.png", sizes: "512x512", type: "image/png" }],
  };
}
