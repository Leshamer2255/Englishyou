'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface UserProgress {
  level: string
  vocabularyWords: number
  grammarExercises: number
  listeningExercises: number
  speakingExercises: number
  totalScore: number
  streak: number
  lastActivity: string
}

interface ExerciseProgress {
  exercise: {
    title: string
    type: string
    difficulty: string
  }
  score: number
  completed: boolean
  updatedAt: string
}

export default function ProgressPage() {
  const { data: session } = useSession()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchProgress()
    }
  }, [session])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const [progressResponse, exercisesResponse] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/exercises/progress')
      ])

      if (!progressResponse.ok || !exercisesResponse.ok) {
        throw new Error('Failed to fetch progress')
      }

      const [progressData, exercisesData] = await Promise.all([
        progressResponse.json(),
        exercisesResponse.json()
      ])

      setUserProgress(progressData)
      setExerciseProgress(exercisesData)
      setError(null)
    } catch (err) {
      setError('Failed to load progress')
      console.error('Error fetching progress:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>
          <div className="text-center py-8">
            <p className="text-gray-600">Please sign in to view your progress</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProgress}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>

        {userProgress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Level</h3>
              <p className="text-3xl font-bold text-primary-600">{userProgress.level}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Score</h3>
              <p className="text-3xl font-bold text-primary-600">{userProgress.totalScore}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-primary-600">{userProgress.streak} days</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Activity</h3>
              <p className="text-gray-600">
                {new Date(userProgress.lastActivity).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Exercise History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exerciseProgress.map((progress, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {progress.exercise.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {progress.exercise.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        progress.exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        progress.exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {progress.exercise.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {progress.score}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {progress.completed ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(progress.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 