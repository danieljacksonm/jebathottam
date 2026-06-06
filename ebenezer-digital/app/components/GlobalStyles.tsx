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
        background: rgba(59, 130, 246, 0.5);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
      }
      
      /* Selection styles */
      ::selection {
        background: rgba(59, 130, 246, 0.3);
        color: white;
      }
      
      /* Focus styles */
      :focus-visible {
        outline: 2px solid rgba(59, 130, 246, 0.5);
        outline-offset: 2px;
      }
    `}</style>
  );
}
