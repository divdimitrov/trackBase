import { mockWorkouts } from '@/lib/mockData';
import { Workout, Exercise } from '@/lib/types';

function ExerciseGroup({ exercise }: { exercise: Exercise }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
      <div className="space-y-1">
        {exercise.sets.map((set, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg px-3 py-2"
          >
            <span className="text-gray-500 font-medium w-8">#{index + 1}</span>
            <span className="text-gray-900">
              {set.reps} reps
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

function WorkoutCard({ workout }: { workout: Workout }) {
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {workout.exercises.map((exercise, index) => (
          <ExerciseGroup key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Workouts</h1>
        <p className="text-gray-600">Your exercise log and history</p>
      </div>

      <div className="space-y-4">
        {mockWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
