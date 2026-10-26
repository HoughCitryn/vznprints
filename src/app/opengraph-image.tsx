import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = "VZN Prints | Printing Services in Bakersfield, CA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: "72px 86px", color: "#050505", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={`${siteConfig.url}/wp-content/uploads/2019/02/VZN-LOGO.png`} alt="" width={300} height={143} style={{ objectFit: "contain" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 66, lineHeight: 1.05, fontWeight: 800, maxWidth: 900 }}>Your Ultimate Printing Services Solution</div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#4b4b4b" }}>Printing company in Bakersfield, CA</div>
      </div>
      <div style={{ display: "flex", height: 16, width: "100%" }}><div style={{ background: "#0093d3", flex: 1 }} /><div style={{ background: "#cc016b", flex: 1 }} /><div style={{ background: "#fff10d", flex: 1 }} /><div style={{ background: "#050505", flex: 1 }} /></div>
    </div>,
    size,
  );
}
