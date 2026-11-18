import { ImageResponse } from "next/og";
import { loadOgFonts, ogFontOptions } from "@/lib/og-fonts";

// Dynamic OG image factory — /og?title=<text>&eyebrow=<text>
//
// Crimson / gold system (same palette + radial gradient as the site's heroes):
// deep maroon base, hot upper-right core, white Fraunces headline, gold accents.
//
// 1200 × 630. Returns PNG.
//
// Runtime: nodejs (OpenNext on AWS Lambda doesn't ship edge entrypoints
// reliably for ImageResponse). Cache headers tuned for CDN reuse —
// a given title+eyebrow combo is hashed into the URL so dedupe is
// automatic per unique query.

export const runtime = "nodejs";
// IMPORTANT: this route reads searchParams (title + eyebrow), so it MUST
// be force-dynamic. `force-static` would bake a single response at build
// time and ignore query params — every blog post + case study would share
// the same default OG card. The CloudFront cache compensates: the cache-
// control headers below mark each unique URL as immutable for a year, so
// each (title, eyebrow) combo is cached forever after first generation.
export const dynamic = "force-dynamic";

const INK = "#0B0C0B"; // near-black base (matches the site palette)
const PAPER = "#FFFFFF";
const ORANGE = "#4BE38F"; // green accent (kept the legacy const name)
const PAPER_MUTED = "rgba(255,255,255,0.72)";
const PAPER_FAINT = "rgba(255,255,255,0.55)";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = (url.searchParams.get("title") || "Bangladesh's 360° digital marketing & political PR agency.").slice(0, 160);
  const eyebrow = (url.searchParams.get("eyebrow") || "DHAKA · SINCE 2024").slice(0, 60).toUpperCase();

  // Headline auto-sizes to balance long/short titles.
  const headlineSize = title.length > 110 ? 56 : title.length > 80 ? 68 : title.length > 50 ? 84 : 100;

  const fonts = await loadOgFonts();
  const serif = fonts.length ? "Fraunces, sans-serif" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(60% 60% at 92% 4%, rgba(222,42,34,0.55) 0%, transparent 64%), radial-gradient(50% 50% at 4% 110%, rgba(75,227,143,0.16) 0%, transparent 66%), linear-gradient(160deg, #1A1D1A 0%, #0B0C0B 70%)",
          backgroundColor: INK,
          color: PAPER,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >

        {/* Top eyebrow chip — orange border, white text, mono spacing. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              border: `1.5px solid ${ORANGE}`,
              borderRadius: 9999,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: PAPER,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: ORANGE,
              }}
            />
            {eyebrow}
          </div>
        </div>

        {/* Mega headline + orange accent stripe under it. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              fontSize: headlineSize,
              fontFamily: serif,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              color: PAPER,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              width: 128,
              height: 6,
              background: ORANGE,
              borderRadius: 3,
              display: "flex",
            }}
          />
        </div>

        {/* Bottom row: wordmark left, URL right. */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              fontSize: 40,
              fontFamily: serif,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            <span style={{ color: PAPER }}>Public</span>
            <span style={{ color: ORANGE }}>Pulse</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: ORANGE,
                marginLeft: 4,
                alignSelf: "center",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: PAPER_FAINT,
                textTransform: "uppercase",
              }}
            >
              Bangladesh · Digital Marketing & PR
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: PAPER_MUTED,
                letterSpacing: "-0.005em",
              }}
            >
              publicpulse.com.bd
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogFontOptions(fonts),
      width: 1200,
      height: 630,
      headers: {
        "cache-control": fonts.length
          ? "public, max-age=86400, s-maxage=31536000, immutable"
          : "public, max-age=60, s-maxage=300", // fallback font: re-render soon
      },
    }
  );
}
