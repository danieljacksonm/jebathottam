"use client";

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      * {
        scroll-behavior: smooth;
      }
      
      html {
        scroll-padding-top: 80px;
      }
      
      body {
        font-family: var(--font-dm-sans);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-syne);
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.45);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.7);
      }
      
      /* Selection styles */
      ::selection {
        background: rgba(16, 185, 129, 0.28);
        color: white;
      }
      
      /* Focus styles */
      :focus-visible {
        outline: 2px solid rgba(16, 185, 129, 0.7);
        outline-offset: 2px;
      }

      /* Hide Google Translate chrome everywhere — we use our own language picker */
      body {
        top: 0 !important;
      }
      .skiptranslate,
      iframe.goog-te-banner-frame,
      .goog-te-banner-frame,
      #goog-gt-tt,
      .goog-te-balloon-frame,
      .goog-tooltip,
      .goog-text-highlight,
      .goog-te-gadget,
      .VIpgJd-ZVi9od-ORHb-OEVmcd,
      .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      .quiet-translate-mount {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
      }
    `}</style>
  );
}
