const adminSections = [
  {
    title: 'Manage Recipes',
    description: 'Add, edit, or delete recipes',
    icon: '📝',
  },
  {
    title: 'Manage Workouts',
    description: 'Create workout templates and exercises',
    icon: '🏋️',
  },
  {
    title: 'Shopping Categories',
    description: 'Organize your shopping list categories',
    icon: '📂',
  },
  {
    title: 'Data Export',
    description: 'Export your data as JSON or CSV',
    icon: '💾',
  },
  {
    title: 'Settings',
    description: 'App preferences and configuration',
    icon: '⚙️',
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Admin</h1>
        <p className="text-sm text-gray-500">Manage your tracker data and settings</p>
      </div>

      {/* Coming soon banner */}
      <div className="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚧</span>
          <div>
            <h2 className="font-semibold text-blue-900">Coming Soon</h2>
            <p className="text-sm text-blue-700/80">
              Admin features are currently under development.
            </p>
          </div>
        </div>
      </div>

      {/* Future admin sections */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Planned Features
        </h2>
        <div className="space-y-2">
          {adminSections.map((section) => (
            <div
              key={section.title}
              className="flex items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/60 opacity-50"
            >
              <span className="text-2xl">{section.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
