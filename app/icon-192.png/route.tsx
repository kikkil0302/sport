import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Icône PWA 192×192 : pastille emerald pleine (compatible maskable). */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#059669",
        }}
      >
        <svg
          width="104"
          height="104"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
