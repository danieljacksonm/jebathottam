import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Default favicon for all hosts (Next injects into every page). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          borderRadius: 8,
          border: "1px solid rgba(16,185,129,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: 18,
          }}
        >
          <div style={{ height: 2, background: "#F3EFE6", borderRadius: 1 }} />
          <div style={{ height: 2, width: 12, background: "#F3EFE6", borderRadius: 1 }} />
          <div style={{ height: 2, background: "#F3EFE6", borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
