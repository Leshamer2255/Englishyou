'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/hooks/useProgress'

interface Word {
  id: string
  word: string
  translation: string
  example: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const sampleWords: Word[] = [
  {
    id: '1',
    word: 'perseverance',
    translation: 'настойчивість',
    example: 'Success comes through perseverance.',
    difficulty: 'intermediate',
  },
  {
    id: '2',
    word: 'eloquent',
    translation: 'красномовний',
    example: 'She gave an eloquent speech at the conference.',
    difficulty: 'advanced',
  },
  {
    id: '3',
    word: 'serendipity',
    translation: 'щасливий випадок',
    example: 'Finding this book was pure serendipity.',
    difficulty: 'advanced',
  },
]

export default function VocabularyExercise() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { updateProgress } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleNext = async () => {
    if (currentIndex < sampleWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowTranslation(false)
    } else {
      setCompleted(true)
      // Update progress when exercise is completed
      await updateProgress('vocabulary', score)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowTranslation(false)
    }
  }

  const handleShowTranslation = () => {
    setShowTranslation(true)
    setScore(score + 1)
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Exercise Completed!</h2>
          <p className="text-xl mb-6">Your score: {score} out of {sampleWords.length}</p>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setShowTranslation(false)
              setScore(0)
              setCompleted(false)
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Vocabulary Exercise</h2>
          <span className="text-gray-600">
            {currentIndex + 1} of {sampleWords.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold mb-4">{sampleWords[currentIndex].word}</h3>
            <span className="text-sm text-gray-500">
              {sampleWords[currentIndex].difficulty}
            </span>
          </div>

          {showTranslation ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-xl text-center text-gray-800">
                  {sampleWords[currentIndex].translation}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg text-center text-blue-800">
                  {sampleWords[currentIndex].example}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleShowTranslation}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Show Translation
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!showTranslation}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
} 