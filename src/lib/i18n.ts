export type Locale = 'en' | 'bg';

export const translations = {
  en: {
    // Nav
    nav: {
      diet: 'Diet',
      workouts: 'Workouts',
      shopping: 'Shopping',
    },

    // Home
    home: {
      heroTitle: 'Your personal tracker',
      heroSubtitle: 'Diet, workouts, and shopping — all in one place.',
      dietTitle: 'Diet',
      dietDesc: 'Track your recipes and meals',
      workoutsTitle: 'Workouts',
      workoutsDesc: 'Log your exercise sessions',
      shoppingTitle: 'Shopping',
      shoppingDesc: 'Manage your grocery list',
      adminTitle: 'Admin',
      adminDesc: 'Settings and configuration',
    },

    // Diet
    diet: {
      title: 'Diet',
      subtitle: 'Your saved recipes and meal ideas',
      ingredients: 'Ingredients',
    },

    // Workouts
    workouts: {
      title: 'Workouts',
      subtitle: 'Your exercise log and history',
      reps: 'reps',
    },

    // Shopping
    shopping: {
      title: 'Shopping',
      subtitle: '{checked} of {total} items checked',
    },

    // Admin
    admin: {
      title: 'Admin',
      subtitle: 'Manage your tracker data and settings',
      comingSoon: 'Coming Soon',
      comingSoonDesc: 'Admin features are currently under development.',
      plannedFeatures: 'Planned Features',
      soon: 'Soon',
      manageRecipes: 'Manage Recipes',
      manageRecipesDesc: 'Add, edit, or delete recipes',
      manageWorkouts: 'Manage Workouts',
      manageWorkoutsDesc: 'Create workout templates and exercises',
      shoppingCategories: 'Shopping Categories',
      shoppingCategoriesDesc: 'Organize your shopping list categories',
      dataExport: 'Data Export',
      dataExportDesc: 'Export your data as JSON or CSV',
      settings: 'Settings',
      settingsDesc: 'App preferences and configuration',
    },

    // Footer
    footer: {
      rights: '© {year} TrackBase. All rights reserved.',
    },
  },

  bg: {
    // Nav
    nav: {
      diet: 'Диета',
      workouts: 'Тренировки',
      shopping: 'Пазаруване',
    },

    // Home
    home: {
      heroTitle: 'Твоят личен тракер',
      heroSubtitle: 'Диета, тренировки и пазаруване — всичко на едно място.',
      dietTitle: 'Диета',
      dietDesc: 'Следи рецептите и храненето си',
      workoutsTitle: 'Тренировки',
      workoutsDesc: 'Записвай упражненията си',
      shoppingTitle: 'Пазаруване',
      shoppingDesc: 'Управлявай списъка за пазаруване',
      adminTitle: 'Админ',
      adminDesc: 'Настройки и конфигурация',
    },

    // Diet
    diet: {
      title: 'Диета',
      subtitle: 'Твоите запазени рецепти и идеи за хранене',
      ingredients: 'Съставки',
    },

    // Workouts
    workouts: {
      title: 'Тренировки',
      subtitle: 'Дневник с упражнения и история',
      reps: 'повт.',
    },

    // Shopping
    shopping: {
      title: 'Пазаруване',
      subtitle: '{checked} от {total} артикула отбелязани',
    },

    // Admin
    admin: {
      title: 'Админ',
      subtitle: 'Управление на данни и настройки',
      comingSoon: 'Очаквайте скоро',
      comingSoonDesc: 'Административните функции са в процес на разработка.',
      plannedFeatures: 'Планирани функции',
      soon: 'Скоро',
      manageRecipes: 'Управление на рецепти',
      manageRecipesDesc: 'Добави, редактирай или изтрий рецепти',
      manageWorkouts: 'Управление на тренировки',
      manageWorkoutsDesc: 'Създавай шаблони за тренировки и упражнения',
      shoppingCategories: 'Категории за пазаруване',
      shoppingCategoriesDesc: 'Организирай категориите в списъка за пазаруване',
      dataExport: 'Експорт на данни',
      dataExportDesc: 'Експортирай данните като JSON или CSV',
      settings: 'Настройки',
      settingsDesc: 'Предпочитания и конфигурация на приложението',
    },

    // Footer
    footer: {
      rights: '© {year} TrackBase. Всички права запазени.',
    },
  },
};

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Translations = DeepStringRecord<typeof translations['en']>;
