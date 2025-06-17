import ExerciseList from '@/components/ExerciseList'

export default function ExercisesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">English Exercises</h1>
        <ExerciseList />
      </div>
    </div>
  )
} 