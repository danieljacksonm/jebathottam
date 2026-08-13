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

const LANGS = [
  { code: "", label: "Select Language" },
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
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "zh-CN", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
  { code: "id", label: "Indonesian" },
  { code: "tr", label: "Turkish" },
];

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setGoogTrans(lang: string) {
  const value = lang ? `/en/${lang}` : "";
  const expires = "expires=Thu, 31 Dec 2099 23:59:59 GMT";
  document.cookie = `googtrans=${value};path=/;${expires}`;
  document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname};${expires}`;
}

/** Google Website Translator chrome — same look as Google Translate. */
export function GoogleTranslateBar() {
  const mountId = useId().replace(/:/g, "");
  const elementId = `google_translate_element_${mountId}`;
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState("");

  useEffect(() => {
    const existing = readCookie("googtrans");
    if (existing?.includes("/")) {
      const parts = existing.split("/");
      setLang(parts[2] || "");
    }

    const prev = window.googleTranslateElementInit;
    window.googleTranslateElementInit = () => {
      prev?.();
      if (!window.google?.translate?.TranslateElement) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGS.filter((l) => l.code)
            .map((l) => l.code)
            .join(","),
          autoDisplay: false,
        },
        elementId
      );
      setReady(true);
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
    <div className="gtranslate-bar" role="region" aria-label="Google Translate">
      <img
        src="https://www.gstatic.com/images/branding/product/1x/translate_24dp.png"
        alt=""
        width={20}
        height={20}
      />
      <span className="gtranslate-brand">Translated by Google</span>
      <span className="gtranslate-dot">·</span>
      <label htmlFor={`gt-select-${mountId}`}>Select Language</label>
      <select
        id={`gt-select-${mountId}`}
        value={lang}
        onChange={(e) => onPick(e.target.value)}
        className="gtranslate-select"
      >
        {LANGS.map((l) => (
          <option key={l.code || "default"} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <button type="button" className="gtranslate-reset" onClick={() => onPick("")}>
        Show original
      </button>
      <span className="gtranslate-status">{ready ? "Google Translate ready" : "Loading translator…"}</span>
      <div id={elementId} className="gtranslate-mount" aria-hidden />
    </div>
  );
}
