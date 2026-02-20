'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/diet', label: 'Diet' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/shopping', label: 'Shopping' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* App name / Logo */}
          <Link href="/" className="flex items-center gap-2 text-gray-900">
            <Image
              src="/trackbase-logo.png"
              alt="TrackBase logo"
              width={32}
              height={32}
              priority
              className="rounded-md"
            />
            <span className="text-lg sm:text-xl font-semibold tracking-tight">TrackBase</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-7 h-7 text-gray-700"
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
          <div className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 min-h-[44px] rounded-lg text-lg font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 active:bg-blue-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
