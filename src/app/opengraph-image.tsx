import { ImageResponse } from "next/og";

export const alt = "Adnan Naous — Computer Science Student, projects, and Personal OS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#050607",
        color: "#f5f5f7",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", width: 1010, flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", color: "#9da0a8", fontSize: 23, letterSpacing: 5 }}>
          ADNAN NAOUS · PORTFOLIO / PERSONAL OS
        </div>
        <div style={{ display: "flex", maxWidth: 950, fontSize: 70, lineHeight: 1.05, letterSpacing: -4 }}>
          Evidence-led software projects and practical systems.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#c7c9ce", fontSize: 25 }}>
          <span>Computer Science Student</span><span style={{ color: "#61646c" }}>·</span><span>Developer</span><span style={{ color: "#61646c" }}>·</span><span>Technology Builder</span>
        </div>
      </div>
    </div>,
    size,
  );
}
