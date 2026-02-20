'use client';

import { useLanguage } from './LanguageProvider';

export function FooterInner({ year }: { year: number }) {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white/60 backdrop-blur">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>{t.footer.rights.replace('{year}', String(year))}</span>
        <span className="font-mono">v0.1.0</span>
      </div>
    </footer>
  );
}
