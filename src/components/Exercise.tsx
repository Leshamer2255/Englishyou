'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ExerciseProps {
  exercise: {
    id: string
    title: string
    description: string
    type: string
    difficulty: string
    content: {
      questions: {
        id: string
        question: string
        options?: string[]
        correctAnswer: string
      }[]
    }
  }
}

export default function Exercise({ exercise }: ExerciseProps) {
  const { data: session } = useSession()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    const correctAnswers = exercise.content.questions.filter(
      question => answers[question.id] === question.correctAnswer
    ).length

    const finalScore = Math.round((correctAnswers / exercise.content.questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)

    try {
      await fetch('/api/exercises/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: exercise.id,
          score: finalScore,
          completed: true
        })
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const handleNext = () => {
    if (currentQuestion < exercise.content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view exercises</p>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exercise Results</h2>
        <div className="text-center">
          <p className="text-4xl font-bold text-primary-600 mb-4">{score}%</p>
          <p className="text-gray-600 mb-6">
            You got {score}% of the questions correct!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const question = exercise.content.questions[currentQuestion]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{exercise.title}</h2>
        <p className="text-gray-600">{exercise.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {exercise.content.questions.length}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${
            exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {exercise.difficulty}
          </span>
        </div>

        <p className="text-lg text-gray-900 mb-4">{question.question}</p>

        {question.options ? (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[question.id] === option
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-600'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        {currentQuestion === exercise.content.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
} 