import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b0d0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#c9dad6",
            letterSpacing: "-2px",
          }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            fontWeight: 500,
            color: "#b5854f",
          }}>
          Your guide to the Land of Fire and Ice.
        </div>
      </div>
    ),
    { ...size }
  );
}
