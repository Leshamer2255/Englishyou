'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useProgress } from '@/hooks/useProgress'

// Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeakingExercise {
  id: string
  title: string
  text: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const sampleExercises: SpeakingExercise[] = [
  {
    id: '1',
    title: 'Basic Greetings',
    text: 'Hello, how are you today?',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Daily Activities',
    text: 'I usually wake up at 7 AM and go for a run before breakfast.',
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'Future Plans',
    text: 'I am planning to visit my family next weekend and we will celebrate my mother\'s birthday.',
    difficulty: 'advanced',
  },
]

export default function SpeakingExercise() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { updateProgress } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')
  const [recognition, setRecognition] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setTranscript(transcript)
          checkAccuracy(transcript)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognition)
      }
    }
  }, [])

  const startListening = () => {
    if (recognition) {
      setTranscript('')
      setFeedback('')
      setIsListening(true)
      recognition.start()
    } else {
      setFeedback('Speech recognition is not supported in your browser.')
    }
  }

  const checkAccuracy = (spokenText: string) => {
    const targetText = sampleExercises[currentIndex].text.toLowerCase()
    const spokenTextLower = spokenText.toLowerCase()

    // Simple accuracy check - can be improved with more sophisticated algorithms
    const accuracy = calculateSimilarity(spokenTextLower, targetText)
    const percentage = Math.round(accuracy * 100)

    if (percentage >= 80) {
      setFeedback(`Great job! Accuracy: ${percentage}%`)
      setScore(score + 1)
    } else if (percentage >= 60) {
      setFeedback(`Good effort! Accuracy: ${percentage}%. Try again to improve.`)
    } else {
      setFeedback(`Keep practicing! Accuracy: ${percentage}%. Try to match the text more closely.`)
    }
  }

  const calculateSimilarity = (str1: string, str2: string) => {
    const words1 = str1.split(' ')
    const words2 = str2.split(' ')
    let matches = 0

    words1.forEach(word1 => {
      if (words2.includes(word1)) {
        matches++
      }
    })

    return matches / Math.max(words1.length, words2.length)
  }

  const handleNext = async () => {
    if (currentIndex < sampleExercises.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setTranscript('')
      setFeedback('')
    } else {
      setCompleted(true)
      // Update progress when exercise is completed
      await updateProgress('speaking', score)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setTranscript('')
      setFeedback('')
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
          <p className="text-xl mb-6">Your score: {score} out of {sampleExercises.length}</p>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setTranscript('')
              setFeedback('')
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
          <h2 className="text-2xl font-bold">Speaking Exercise</h2>
          <span className="text-gray-600">
            {currentIndex + 1} of {sampleExercises.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {sampleExercises[currentIndex].title}
            </h3>
            <span className="text-sm text-gray-500">
              {sampleExercises[currentIndex].difficulty}
            </span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-lg text-center text-gray-800">
              {sampleExercises[currentIndex].text}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isListening ? 'Listening...' : 'Start Speaking'}
            </button>
          </div>

          {transcript && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Your Speech:</h4>
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}

          {feedback && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">{feedback}</p>
            </div>
          )}

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
              disabled={!transcript}
              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 