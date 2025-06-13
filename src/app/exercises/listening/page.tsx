'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/hooks/useProgress'

interface ListeningExercise {
  id: string
  title: string
  audioUrl: string
  transcript: string
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: string
  }[]
}

const sampleExercise: ListeningExercise = {
  id: '1',
  title: 'Daily Conversation',
  audioUrl: '/audio/conversation.mp3',
  transcript: 'A: Hi, how are you doing today?\nB: I\'m doing well, thank you. How about you?\nA: Pretty good. Did you have a chance to look at the project proposal?\nB: Yes, I reviewed it yesterday. I have some suggestions we could discuss.\nA: That would be great. When are you available to meet?\nB: I\'m free tomorrow afternoon after 2 PM.\nA: Perfect, let\'s schedule it for 2:30 PM then.',
  questions: [
    {
      id: '1',
      question: 'What did person B review yesterday?',
      options: [
        'A meeting schedule',
        'A project proposal',
        'A budget report',
        'A client presentation',
      ],
      correctAnswer: 'A project proposal',
    },
    {
      id: '2',
      question: 'When are they planning to meet?',
      options: [
        'Today at 2 PM',
        'Tomorrow at 2 PM',
        'Tomorrow at 2:30 PM',
        'Next week',
      ],
      correctAnswer: 'Tomorrow at 2:30 PM',
    },
  ],
}

export default function ListeningExercise() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { updateProgress } = useProgress()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({})
  const [showTranscript, setShowTranscript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = async () => {
    if (currentQuestionIndex < sampleExercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setCompleted(true)
      // Calculate score based on correct answers
      const score = sampleExercise.questions.reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0)
      }, 0)
      // Update progress when exercise is completed
      await updateProgress('listening', score)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
    // Here you would implement actual audio playback
    // For now, we'll just toggle the state
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (completed) {
    const score = sampleExercise.questions.reduce((acc, question) => {
      return acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0)
    }, 0)

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Exercise Completed!</h2>
          <p className="text-xl mb-6">
            Your score: {score} out of {sampleExercise.questions.length}
          </p>
          <button
            onClick={() => {
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
              setShowTranscript(false)
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
          <h2 className="text-2xl font-bold">Listening Exercise</h2>
          <span className="text-gray-600">
            {currentQuestionIndex + 1} of {sampleExercise.questions.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4">{sampleExercise.title}</h3>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={toggleAudio}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isPlaying ? 'Stop' : 'Play Audio'}
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
            {showTranscript && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
                {sampleExercise.transcript}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold">
              {sampleExercise.questions[currentQuestionIndex].question}
            </h4>
            <div className="space-y-4">
              {sampleExercise.questions[currentQuestionIndex].options.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    handleAnswer(sampleExercise.questions[currentQuestionIndex].id, option)
                  }
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedAnswers[sampleExercise.questions[currentQuestionIndex].id] === option
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[sampleExercise.questions[currentQuestionIndex].id]}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
} 