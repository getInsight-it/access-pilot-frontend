import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { enUS, ptBR } from "date-fns/locale";
import { STORAGE_KEYS } from "@common/constants/storage.ts";
import { AppLanguage, DEFAULT_LANGUAGE, translations } from "./translations.ts";

type TranslationValues = Record<string, string | number | null | undefined>;

interface I18nContextType {
  language: AppLanguage;
  changeLanguage: (language: AppLanguage) => void;
  t: (key: string, values?: TranslationValues) => string;
  dateFnsLocale: typeof ptBR;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const dateFnsLocales = {
  "pt-BR": ptBR,
  "en-US": enUS
} satisfies Record<AppLanguage, typeof ptBR>;

const interpolate = (template: string, values: TranslationValues = {}): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
};

const isSupportedLanguage = (value: string | null): value is AppLanguage => {
  return value === "pt-BR" || value === "en-US";
};

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return isSupportedLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextType>(() => ({
    language,
    changeLanguage: setLanguage,
    t: (key, values) => {
      const translated = translations[language][key] ?? key;
      return interpolate(translated, values);
    },
    dateFnsLocale: dateFnsLocales[language]
  }), [language]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
};
