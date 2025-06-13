'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/hooks/useProgress'

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { stats, loading, error } = useProgress()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

        {/* Level and Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Current Level</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.level}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Current Streak</h2>
            <p className="text-3xl font-bold text-green-600">{stats.streak} days</p>
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exercise Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Vocabulary</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.vocabularyWords} words</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Grammar</h3>
              <p className="text-2xl font-bold text-green-600">{stats.grammarExercises} exercises</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Listening</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.listeningExercises} exercises</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Speaking</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.speakingExercises} exercises</p>
            </div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Total Score</h2>
          <p className="text-4xl font-bold text-gray-800">{stats.totalScore} points</p>
        </div>

        {/* Achievement Badges */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 