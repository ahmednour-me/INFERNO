import React, { createContext, useContext, useEffect, useState } from "react";
import { Lang, Translations, translations } from "./translations";

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

const LANG_KEY = "inferno.lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null;
      if (stored === "en" || stored === "ar") return stored;
    } catch {}
    return "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  // Apply RTL/LTR direction and font to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (lang === "ar") {
      root.setAttribute("dir", "rtl");
      root.setAttribute("lang", "ar");
      root.style.setProperty(
        "--font-body",
        "'Cairo', 'Noto Sans Arabic', 'Segoe UI', sans-serif"
      );
      root.style.setProperty(
        "--font-mono",
        "'Cairo', 'Noto Sans Arabic', 'JetBrains Mono', monospace"
      );
    } else {
      root.setAttribute("dir", "ltr");
      root.setAttribute("lang", "en");
      root.style.removeProperty("--font-body");
      root.style.removeProperty("--font-mono");
    }
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
