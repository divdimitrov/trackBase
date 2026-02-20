'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  const navItems = [
    { href: '/diet', label: t.nav.diet },
    { href: '/recipes', label: t.nav.recipes },
    { href: '/workouts', label: t.nav.workouts },
    { href: '/shopping', label: t.nav.shopping },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* App name / Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-gray-900 group">
            <Image
              src="/trackbase-logo.png"
              alt="TrackBase logo"
              width={36}
              height={36}
              priority
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight">TrackBase</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'bg' : 'en')}
              className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Switch language"
            >
              {locale === 'en' ? '🇧🇬 BG' : '🇬🇧 EN'}
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile slide-down navigation */}
        <nav
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3.5 min-h-[48px] rounded-xl text-base font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile language toggle */}
            <button
              onClick={() => { setLocale(locale === 'en' ? 'bg' : 'en'); setIsOpen(false); }}
              className="flex items-center px-4 py-3.5 min-h-[48px] rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all"
            >
              {locale === 'en' ? '🇧🇬 Български' : '🇬🇧 English'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
