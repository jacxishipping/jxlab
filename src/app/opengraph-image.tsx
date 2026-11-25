import { ImageResponse } from "next/og";

export const alt = "JXLab — Agentic AI & Software Engineering Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "64px 72px",
          background:
            "linear-gradient(160deg, #35234A 0%, #6E395B 35%, #C7685B 70%, #F2A86E 100%)",
          color: "#FBF5E8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "rgba(27, 19, 16, 0.55)",
              border: "1px solid rgba(251, 245, 232, 0.28)",
              fontSize: "20px",
              letterSpacing: "0.08em",
            }}
          >
            AGENTIC AI &amp; SOFTWARE ENGINEERING STUDIO
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "#E88B2E",
              color: "#1B120A",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            SHIPPING 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "136px",
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            JXLab
          </div>
          <div
            style={{
              fontSize: "34px",
              color: "#FBF5E8",
              maxWidth: "880px",
              lineHeight: 1.3,
            }}
          >
            Autonomous AI Agents, Native C++ Inference, React 19 Design Systems
            &amp; Production SaaS Platforms.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "20px",
            color: "#1E1712",
          }}
        >
          {["AI Bridge", "JXAI", "JXUI React", "Bidnix"].map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "999px",
                background: "#FBF5E8",
                fontWeight: 700,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
