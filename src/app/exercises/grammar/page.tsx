'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/hooks/useProgress'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'Choose the correct form of the verb: She _____ to the store yesterday.',
    options: ['go', 'goes', 'went', 'gone'],
    correctAnswer: 'went',
    explanation: 'We use the past simple form "went" for actions that happened in the past.',
  },
  {
    id: '2',
    question: 'Select the correct article: I saw _____ interesting movie last night.',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 'an',
    explanation: 'We use "an" before words that begin with a vowel sound.',
  },
  {
    id: '3',
    question: 'Choose the correct preposition: The book is _____ the table.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 'on',
    explanation: 'We use "on" to indicate that something is in contact with a surface.',
  },
]

export default function GrammarExercise() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { updateProgress } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowExplanation(true)
    if (answer === sampleQuestions[currentIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = async () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
      // Update progress when exercise is completed
      await updateProgress('grammar', score)
    }
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
          <p className="text-xl mb-6">Your score: {score} out of {sampleQuestions.length}</p>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setSelectedAnswer(null)
              setShowExplanation(false)
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
          <h2 className="text-2xl font-bold">Grammar Exercise</h2>
          <span className="text-gray-600">
            {currentIndex + 1} of {sampleQuestions.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {sampleQuestions[currentIndex].question}
            </h3>
          </div>

          <div className="space-y-4">
            {sampleQuestions[currentIndex].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border ${
                  selectedAnswer === option
                    ? option === sampleQuestions[currentIndex].correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-white border-gray-200 hover:border-blue-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                {sampleQuestions[currentIndex].explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1)
                setSelectedAnswer(null)
                setShowExplanation(false)
              }
            }}
            disabled={currentIndex === 0}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!showExplanation}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
} 