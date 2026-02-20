'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Locale, Translations } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <LanguageContext.Provider
      value={{
        locale,
        t: translations[locale],
        setLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
