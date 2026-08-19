"use client";

import { useEffect, useId, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export const READER_LANGS = [
  { code: "", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
  { code: "bn", label: "Bengali" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "pa", label: "Punjabi" },
  { code: "ur", label: "Urdu" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
];

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setGoogTrans(lang: string) {
  const value = lang ? `/en/${lang}` : "/en/en";
  const expires = "expires=Thu, 31 Dec 2099 23:59:59 GMT";
  const host = window.location.hostname;
  document.cookie = `googtrans=${value};path=/;${expires}`;
  document.cookie = `googtrans=${value};path=/;domain=${host};${expires}`;
  if (host.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${host};${expires}`;
  }
}

/** Quiet language picker. Google Translate runs hidden so the header stays on-brand. */
export function QuietTranslate({ variant = "journal" }: { variant?: "journal" | "news" }) {
  const mountId = useId().replace(/:/g, "");
  const elementId = `google_translate_element_${mountId}`;
  const [lang, setLang] = useState("");

  useEffect(() => {
    const existing = readCookie("googtrans");
    if (existing?.includes("/")) {
      const parts = existing.split("/");
      const code = parts[2] || "";
      setLang(code === "en" ? "" : code);
    }

    const prev = window.googleTranslateElementInit;
    window.googleTranslateElementInit = () => {
      prev?.();
      if (!window.google?.translate?.TranslateElement) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: READER_LANGS.filter((l) => l.code)
            .map((l) => l.code)
            .join(","),
          autoDisplay: false,
        },
        elementId
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, [elementId]);

  const onPick = (code: string) => {
    setLang(code);
    setGoogTrans(code);
    window.location.reload();
  };

  return (
    <div className={variant === "news" ? "news-lang" : "journal-lang"}>
      <label htmlFor={`quiet-lang-${mountId}`} className="sr-only">
        Language
      </label>
      <select
        id={`quiet-lang-${mountId}`}
        value={lang}
        onChange={(e) => onPick(e.target.value)}
        className={variant === "news" ? "news-lang-select" : "journal-lang-select"}
        aria-label="Read this page in another language"
      >
        {READER_LANGS.map((l) => (
          <option key={l.code || "en"} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <div id={elementId} className="quiet-translate-mount" aria-hidden />
    </div>
  );
}
