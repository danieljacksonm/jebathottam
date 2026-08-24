import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 40,
          border: "4px solid rgba(16,185,129,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 96,
          }}
        >
          <div style={{ height: 10, background: "#F3EFE6", borderRadius: 4 }} />
          <div style={{ height: 10, width: 64, background: "#F3EFE6", borderRadius: 4 }} />
          <div
            style={{
              height: 10,
              background: "#F3EFE6",
              borderRadius: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#10B981",
                marginTop: -2,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
