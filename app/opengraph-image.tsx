import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const alt =
  "Trakmetrik — Calculez vos calories, macros et IMC, planifiez vos séances et suivez votre progression.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONO = "ui-monospace, monospace";

function Metric({
  label,
  value,
  unit,
  delta,
}: {
  label: string;
  value: string;
  unit: string;
  delta: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "22px 26px",
        borderLeft: "1px solid #1f1f23",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 17,
          letterSpacing: 2,
          color: "#71717a",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 10 }}>
        <span style={{ fontFamily: MONO, fontSize: 40, color: "#fafafa", fontWeight: 600 }}>
          {value}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 18, color: "#71717a", paddingBottom: 6 }}>
          {unit}
        </span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 17, color: "#10b981", marginTop: 6 }}>
        {`▲ ${delta}`}
      </div>
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h4l2-6 4 12 2-6h6"
                stroke="#ffffff"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            {SITE_NAME}
          </div>
        </div>

        {/* Titre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 820,
            }}
          >
            Reprenez le sport. Laissez les chiffres à Trakmetrik.
          </div>
          <div style={{ fontSize: 27, color: "#a1a1aa", maxWidth: 760 }}>
            Calories, macros, IMC, séances et progression — un seul tableau de
            bord, précis et gratuit.
          </div>
        </div>

        {/* Bandeau métriques */}
        <div
          style={{
            display: "flex",
            border: "1px solid #1f1f23",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <Metric label="Calories" value="2 180" unit="kcal" delta="4,2 %" />
          <Metric label="Volume" value="4 320" unit="kg" delta="11 %" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              padding: "22px 26px",
              borderLeft: "1px solid #1f1f23",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 18, color: "#71717a" }}>
              {SITE_URL.replace(/^https?:\/\//, "")}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 18, color: "#10b981", marginTop: 6 }}>
              100 % gratuit
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
