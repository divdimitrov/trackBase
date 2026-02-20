import Link from 'next/link';
import Image from 'next/image';

const sections = [
  {
    href: '/diet',
    title: 'Diet',
    description: 'Track your recipes and meals',
    emoji: '🥗',
  },
  {
    href: '/workouts',
    title: 'Workouts',
    description: 'Log your exercise sessions',
    emoji: '💪',
  },
  {
    href: '/shopping',
    title: 'Shopping',
    description: 'Manage your grocery list',
    emoji: '🛒',
  },
  {
    href: '/admin',
    title: 'Admin',
    description: 'Settings and configuration',
    emoji: '⚙️',
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background watermark */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-start justify-center pt-10 sm:pt-0 sm:items-center">
        <div className="relative w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] opacity-[0.06]">
          <Image
            src="/trackbase-logo.png"
            alt=""
            fill
            sizes="(max-width: 640px) 520px, 680px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative space-y-10">
        {/* Hero */}
        <section className="text-center pt-10 sm:pt-14 pb-2">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Track your day with clarity.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            TrackBase keeps diet, workouts, and shopping in one place — designed for fast updates on mobile.
          </p>
        </section>

        {/* Primary cards */}
        <section className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all min-h-[92px] active:scale-[0.98]"
            >
              <span className="text-3xl">{section.emoji}</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
              <span className="hidden sm:inline text-gray-300 group-hover:text-blue-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

