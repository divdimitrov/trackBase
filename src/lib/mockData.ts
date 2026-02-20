import { Recipe, Workout, ShoppingItem, Media } from './types';

export const mockMedia: Media[] = [
  {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
  {
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    type: 'video',
    videoUrl: 'https://example.com/workout-demo.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Overnight Oats',
    notes: 'Prep the night before for a quick breakfast. Great for busy mornings!',
    ingredients: [
      '1/2 cup rolled oats',
      '1/2 cup milk',
      '1/4 cup Greek yogurt',
      '1 tbsp honey',
      '1/4 cup mixed berries',
      '1 tbsp chia seeds',
    ],
    media: {
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400',
    },
  },
  {
    id: '2',
    title: 'Grilled Chicken Salad',
    notes: 'High protein lunch option. Use leftover chicken for quick prep.',
    ingredients: [
      '200g chicken breast',
      '2 cups mixed greens',
      '1/2 cucumber, sliced',
      '1/4 red onion, sliced',
      '10 cherry tomatoes',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      'Salt and pepper to taste',
    ],
    media: {
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    },
  },
  {
    id: '3',
    title: 'Protein Smoothie',
    notes: 'Post-workout recovery drink. Can substitute any protein powder.',
    ingredients: [
      '1 scoop protein powder',
      '1 banana',
      '1 cup almond milk',
      '1 tbsp peanut butter',
      '1/2 cup ice',
    ],
  },
  {
    id: '4',
    title: 'Salmon with Vegetables',
    notes: 'Omega-3 rich dinner. Bake everything on one sheet pan.',
    ingredients: [
      '150g salmon fillet',
      '1 cup broccoli florets',
      '1/2 cup asparagus',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      'Lemon wedges',
      'Fresh dill',
    ],
    media: {
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    },
  },
];

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    date: '2026-02-20',
    title: 'Push Day',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135, notes: 'Warm-up' },
          { reps: 8, weight: 155 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 165 },
        ],
      },
      {
        name: 'Overhead Press',
        sets: [
          { reps: 10, weight: 65 },
          { reps: 8, weight: 75 },
          { reps: 8, weight: 75 },
        ],
      },
      {
        name: 'Tricep Pushdowns',
        sets: [
          { reps: 12, weight: 40 },
          { reps: 12, weight: 40 },
          { reps: 10, weight: 45 },
        ],
      },
    ],
  },
  {
    id: '2',
    date: '2026-02-18',
    title: 'Pull Day',
    exercises: [
      {
        name: 'Deadlift',
        sets: [
          { reps: 8, weight: 185 },
          { reps: 6, weight: 205 },
          { reps: 6, weight: 225 },
        ],
      },
      {
        name: 'Barbell Rows',
        sets: [
          { reps: 10, weight: 95 },
          { reps: 8, weight: 115 },
          { reps: 8, weight: 115 },
        ],
      },
      {
        name: 'Bicep Curls',
        sets: [
          { reps: 12, weight: 25 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
      },
    ],
  },
  {
    id: '3',
    date: '2026-02-16',
    title: 'Leg Day',
    exercises: [
      {
        name: 'Squats',
        sets: [
          { reps: 10, weight: 135, notes: 'Warm-up' },
          { reps: 8, weight: 185 },
          { reps: 6, weight: 205 },
          { reps: 6, weight: 205 },
        ],
      },
      {
        name: 'Romanian Deadlift',
        sets: [
          { reps: 10, weight: 115 },
          { reps: 10, weight: 135 },
          { reps: 8, weight: 135 },
        ],
      },
      {
        name: 'Leg Press',
        sets: [
          { reps: 12, weight: 270 },
          { reps: 10, weight: 320 },
          { reps: 10, weight: 320 },
        ],
      },
    ],
  },
];

export const mockShoppingItems: ShoppingItem[] = [
  { id: '1', name: 'Chicken breast (2 lbs)', checked: false, category: 'Protein' },
  { id: '2', name: 'Salmon fillets', checked: false, category: 'Protein' },
  { id: '3', name: 'Greek yogurt', checked: true, category: 'Dairy' },
  { id: '4', name: 'Eggs (dozen)', checked: false, category: 'Dairy' },
  { id: '5', name: 'Almond milk', checked: true, category: 'Dairy' },
  { id: '6', name: 'Mixed greens', checked: false, category: 'Produce' },
  { id: '7', name: 'Broccoli', checked: false, category: 'Produce' },
  { id: '8', name: 'Bananas', checked: true, category: 'Produce' },
  { id: '9', name: 'Cherry tomatoes', checked: false, category: 'Produce' },
  { id: '10', name: 'Rolled oats', checked: false, category: 'Pantry' },
  { id: '11', name: 'Protein powder', checked: false, category: 'Supplements' },
  { id: '12', name: 'Olive oil', checked: true, category: 'Pantry' },
];
