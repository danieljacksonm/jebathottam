"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#070708", color: "#f4f1ea", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div>
            <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, opacity: 0.7 }}>
              Ebenezer Digital
            </p>
            <h1 style={{ fontSize: 28, marginTop: 12 }}>Something went wrong</h1>
            <p style={{ marginTop: 12, opacity: 0.6, maxWidth: 420 }}>
              Please try again. If this keeps happening, contact support from our website.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 24,
                padding: "10px 18px",
                border: "1px solid #10b981",
                background: "transparent",
                color: "#34d399",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {error.digest ? (
              <p style={{ marginTop: 24, fontSize: 12, opacity: 0.35 }}>Reference: {error.digest}</p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
