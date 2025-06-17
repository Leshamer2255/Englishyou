'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Exercise {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  content: any
  progress: {
    completed: boolean
    score?: number
  }[]
}

export default function ExerciseList() {
  const { data: session } = useSession()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: '',
    difficulty: ''
  })

  useEffect(() => {
    fetchExercises()
  }, [filters])

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.type) queryParams.append('type', filters.type)
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty)

      const response = await fetch(`/api/exercises?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch exercises')
      
      const data = await response.json()
      setExercises(data)
      setError(null)
    } catch (err) {
      setError('Failed to load exercises')
      console.error('Error fetching exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view exercises</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchExercises}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">All Types</option>
          <option value="vocabulary">Vocabulary</option>
          <option value="grammar">Grammar</option>
          <option value="reading">Reading</option>
          <option value="listening">Listening</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{exercise.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {exercise.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{exercise.type}</span>
              {exercise.progress[0]?.completed ? (
                <span className="text-sm text-green-600">
                  Completed {exercise.progress[0].score && `(${exercise.progress[0].score}%)`}
                </span>
              ) : (
                <button
                  onClick={() => {/* TODO: Implement exercise start */}}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Start Exercise
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No exercises found</p>
        </div>
      )}
    </div>
  )
} 