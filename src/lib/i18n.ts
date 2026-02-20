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
      // Gate
      gate: {
        title: 'Admin Access',
        subtitle: 'Enter your API key to continue',
        placeholder: 'API key',
        submit: 'Unlock',
        errorEmpty: 'Please enter an API key',
      },
      // Dashboard
      dashboard: {
        recipes: 'Recipes',
        workouts: 'Workout Sessions',
        shopping: 'Shopping Items',
        media: 'Media',
        logout: 'Logout',
      },
      // Shared CRUD labels
      crud: {
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        confirmDelete: 'Are you sure you want to delete this?',
        confirmDeleteDesc: 'This action cannot be undone.',
        confirm: 'Confirm',
        noFieldsToUpdate: 'No changes to save',
        created: 'Created successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
        errorLoad: 'Failed to load data',
        errorSave: 'Failed to save',
        errorDelete: 'Failed to delete',
        loading: 'Loading…',
        noResults: 'Nothing here yet',
        addFirst: 'Create one to get started',
        search: 'Search…',
        actions: 'Actions',
        back: 'Back',
      },
      // Recipes
      recipes: {
        title: 'Recipes',
        newRecipe: 'New Recipe',
        editRecipe: 'Edit Recipe',
        recipeName: 'Title',
        recipeNotes: 'Notes',
        ingredients: 'Ingredients',
        newIngredient: 'New Ingredient',
        editIngredient: 'Edit Ingredient',
        ingredientName: 'Ingredient name',
        ingredientQty: 'Quantity (e.g. 200g)',
        linkedMedia: 'Linked Media',
        linkMedia: 'Link Media',
        unlinkMedia: 'Unlink',
        noIngredients: 'No ingredients yet',
        noMedia: 'No media linked',
      },
      // Workouts
      workouts: {
        title: 'Workouts',
        newSession: 'New Session',
        editSession: 'Edit Session',
        sessionDate: 'Date',
        sessionTitle: 'Title',
        sessionNotes: 'Notes',
        sets: 'Sets',
        newSet: 'New Set',
        editSet: 'Edit Set',
        exercise: 'Exercise',
        reps: 'Reps',
        weight: 'Weight',
        setNotes: 'Notes',
        noSets: 'No sets yet',
      },
      // Shopping
      shopping: {
        title: 'Shopping',
        newItem: 'New Item',
        editItem: 'Edit Item',
        itemName: 'Item name',
        itemQty: 'Quantity',
        checked: 'Checked',
      },
      // Media
      media: {
        title: 'Media',
        newMedia: 'New Media',
        editMedia: 'Edit Media',
        url: 'URL',
        mediaType: 'Type (video / image)',
        mediaTitle: 'Title',
        mediaNotes: 'Notes',
      },
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
      // Gate
      gate: {
        title: 'Админ достъп',
        subtitle: 'Въведете API ключа за да продължите',
        placeholder: 'API ключ',
        submit: 'Отключи',
        errorEmpty: 'Моля въведете API ключ',
      },
      // Dashboard
      dashboard: {
        recipes: 'Рецепти',
        workouts: 'Тренировки',
        shopping: 'Пазаруване',
        media: 'Медия',
        logout: 'Изход',
      },
      // Shared CRUD labels
      crud: {
        create: 'Създай',
        edit: 'Редактирай',
        delete: 'Изтрий',
        save: 'Запази',
        cancel: 'Отказ',
        confirmDelete: 'Сигурни ли сте, че искате да изтриете?',
        confirmDeleteDesc: 'Това действие не може да бъде отменено.',
        confirm: 'Потвърди',
        noFieldsToUpdate: 'Няма промени за запазване',
        created: 'Създадено успешно',
        updated: 'Обновено успешно',
        deleted: 'Изтрито успешно',
        errorLoad: 'Зареждането не успя',
        errorSave: 'Записът не успя',
        errorDelete: 'Изтриването не успя',
        loading: 'Зареждане…',
        noResults: 'Все още няма нищо',
        addFirst: 'Създайте първия запис',
        search: 'Търси…',
        actions: 'Действия',
        back: 'Назад',
      },
      // Recipes
      recipes: {
        title: 'Рецепти',
        newRecipe: 'Нова рецепта',
        editRecipe: 'Редактирай рецепта',
        recipeName: 'Заглавие',
        recipeNotes: 'Бележки',
        ingredients: 'Съставки',
        newIngredient: 'Нова съставка',
        editIngredient: 'Редактирай съставка',
        ingredientName: 'Име на съставка',
        ingredientQty: 'Количество (напр. 200г)',
        linkedMedia: 'Свързана медия',
        linkMedia: 'Свържи медия',
        unlinkMedia: 'Премахни',
        noIngredients: 'Все още няма съставки',
        noMedia: 'Няма свързана медия',
      },
      // Workouts
      workouts: {
        title: 'Тренировки',
        newSession: 'Нова сесия',
        editSession: 'Редактирай сесия',
        sessionDate: 'Дата',
        sessionTitle: 'Заглавие',
        sessionNotes: 'Бележки',
        sets: 'Серии',
        newSet: 'Нова серия',
        editSet: 'Редактирай серия',
        exercise: 'Упражнение',
        reps: 'Повторения',
        weight: 'Тежест',
        setNotes: 'Бележки',
        noSets: 'Все още няма серии',
      },
      // Shopping
      shopping: {
        title: 'Пазаруване',
        newItem: 'Нов артикул',
        editItem: 'Редактирай артикул',
        itemName: 'Име на артикул',
        itemQty: 'Количество',
        checked: 'Отбелязан',
      },
      // Media
      media: {
        title: 'Медия',
        newMedia: 'Нова медия',
        editMedia: 'Редактирай медия',
        url: 'URL',
        mediaType: 'Тип (видео / снимка)',
        mediaTitle: 'Заглавие',
        mediaNotes: 'Бележки',
      },
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
