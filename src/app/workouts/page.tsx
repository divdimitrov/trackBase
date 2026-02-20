'use client';

import { mockWorkouts } from '@/lib/mockData';
import { Workout, Exercise } from '@/lib/types';
import { useLanguage } from '@/components/LanguageProvider';

function ExerciseGroup({ exercise, repsLabel }: { exercise: Exercise; repsLabel: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-800">{exercise.name}</h4>
      <div className="space-y-1.5">
        {exercise.sets.map((set, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm bg-gray-50/80 rounded-xl px-3.5 py-2.5"
          >
            <span className="text-gray-400 font-mono text-xs w-6">#{index + 1}</span>
            <span className="text-gray-900">
              {set.reps} {repsLabel}
              {set.weight && <span className="text-gray-600"> @ {set.weight} lbs</span>}
            </span>
            {set.notes && (
              <span className="text-gray-500 text-xs ml-auto">{set.notes}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutCard({ workout, repsLabel, locale }: { workout: Workout; repsLabel: string; locale: string }) {
  const formattedDate = new Date(workout.date).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{workout.title}</h3>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{formattedDate}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        {workout.exercises.map((exercise, index) => (
          <ExerciseGroup key={index} exercise={exercise} repsLabel={repsLabel} />
        ))}
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t.workouts.title}</h1>
        <p className="text-sm text-gray-500">{t.workouts.subtitle}</p>
      </div>

      <div className="space-y-4">
        {mockWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} repsLabel={t.workouts.reps} locale={locale} />
        ))}
      </div>
    </div>
  );
}
