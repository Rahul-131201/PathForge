import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get("title") ?? "PathForge Roadmap").slice(0, 90);
  const topics = req.nextUrl.searchParams.get("topics") ?? "0";
  const hours = req.nextUrl.searchParams.get("hours") ?? "0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050510",
          color: "#e5ecf5",
          fontFamily: "Inter, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.28), transparent 50%), linear-gradient(140deg, rgba(15,23,42,0.95), rgba(2,6,23,0.98))",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -110,
            right: -70,
            width: 340,
            height: 340,
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(56,189,248,0.2)",
                border: "1px solid rgba(56,189,248,0.45)",
                color: "#67e8f9",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              P
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              PathForge
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 940 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                padding: "8px 16px",
                fontSize: 20,
                color: "#bfdbfe",
              }}
            >
              Community Learning Roadmap
            </div>

            <div
              style={{
                fontSize: 64,
                lineHeight: 1.08,
                fontWeight: 800,
                background: "linear-gradient(90deg, #22d3ee, #818cf8, #60a5fa)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                padding: "12px 18px",
                minWidth: 140,
              }}
            >
              <span style={{ fontSize: 15, color: "#94a3b8" }}>Topics</span>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{topics}</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                padding: "12px 18px",
                minWidth: 140,
              }}
            >
              <span style={{ fontSize: 15, color: "#94a3b8" }}>Hours</span>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{hours}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
