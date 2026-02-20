export interface Media {
  type: 'image' | 'video';
  imageUrl?: string;
  videoUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  notes?: string;
  ingredients: string[];
  media?: Media;
}

export interface WorkoutSet {
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  exercises: Exercise[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category?: string;
}
