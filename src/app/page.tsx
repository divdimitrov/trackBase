import Link from 'next/link';

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
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center pt-10 sm:pt-14 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Your personal tracker
        </h1>
        <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
          Diet, workouts, and shopping — all in one place.
        </p>
      </section>

      {/* Section cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition-all min-h-[80px] active:scale-[0.98]"
          >
            <span className="text-2xl sm:text-3xl">{section.emoji}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

