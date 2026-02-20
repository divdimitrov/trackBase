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
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Welcome to TrackBase
        </h1>
        <p className="text-sm text-gray-500">
          Your personal tracker for diet, workouts, and shopping
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all min-h-[80px] active:scale-[0.98]"
          >
            <span className="text-3xl">{section.emoji}</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

