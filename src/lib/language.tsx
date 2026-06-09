"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Lang = "jp" | "id";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (jp: string | null | undefined, id: string | null | undefined) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "jp",
  setLang: () => {},
  t: (jp) => jp || "",
});

const STORAGE_KEY = "llll-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("jp");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "jp") {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang === "jp" ? "ja" : "id";
  }, []);

  // Sync lang attribute on mount
  useEffect(() => {
    document.documentElement.lang = lang === "jp" ? "ja" : "id";
  }, [lang]);

  const t = useCallback(
    (jp: string | null | undefined, id: string | null | undefined): string => {
      if (lang === "id" && id) return id;
      return jp || id || "";
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Helper ringkas: kembalikan fungsi `tr(jp, id)` yang memilih string sesuai bahasa aktif. */
export function useTr() {
  const { lang } = useContext(LanguageContext);
  return (jp: string, id: string): string => (lang === "id" ? id : jp);
}
