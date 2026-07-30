"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { content, type Dict, type Locale } from "./content";

type Ctx = { locale: Locale; t: Dict; setLocale: (l: Locale) => void; toggle: () => void };

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "ramses-locale";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Arabic is the default language; the exported HTML ships as lang="ar" dir="rtl".
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") setLocaleState(saved);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = locale === "ar" ? "rtl" : "ltr";
    el.dataset.lang = locale;
    document.title = content[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const toggle = useCallback(
    () => setLocale(locale === "ar" ? "en" : "ar"),
    [locale, setLocale],
  );

  return (
    <LangContext.Provider value={{ locale, t: content[locale], setLocale, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
