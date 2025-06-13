import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ProgressStats {
  vocabularyWords: number
  grammarExercises: number
  listeningExercises: number
  speakingExercises: number
  totalScore: number
  streak: number
  level: string
  achievements: Achievement[]
}

interface Achievement {
  id: string
  type: string
  title: string
  description: string
  icon: string
  unlockedAt: string
}

export function useProgress() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<ProgressStats>({
    vocabularyWords: 0,
    grammarExercises: 0,
    listeningExercises: 0,
    speakingExercises: 0,
    totalScore: 0,
    streak: 0,
    level: 'Beginner',
    achievements: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchProgress()
    }
  }, [session])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/progress')
      if (!response.ok) {
        throw new Error('Failed to fetch progress')
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (exerciseType: string, score: number) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseType, score }),
      })

      if (!response.ok) {
        throw new Error('Failed to update progress')
      }

      const updatedStats = await response.json()
      setStats(prevStats => ({
        ...prevStats,
        ...updatedStats,
      }))

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  return {
    stats,
    loading,
    error,
    updateProgress,
    refreshProgress: fetchProgress,
  }
} 