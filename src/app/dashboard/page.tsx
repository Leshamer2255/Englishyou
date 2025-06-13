'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()

  const categories = [
    {
      title: 'Vocabulary',
      description: 'Learn new words and phrases',
      icon: '📚',
      href: '/exercises/vocabulary',
    },
    {
      title: 'Grammar',
      description: 'Practice grammar rules and structures',
      icon: '📝',
      href: '/exercises/grammar',
    },
    {
      title: 'Listening',
      description: 'Improve your listening comprehension',
      icon: '🎧',
      href: '/exercises/listening',
    },
    {
      title: 'Speaking',
      description: 'Practice pronunciation and speaking',
      icon: '🗣️',
      href: '/exercises/speaking',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name || 'Student'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Continue your English learning journey
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Words Learned</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Exercises Completed</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">0%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Streak Days</div>
          </div>
        </div>
      </div>

      {/* Exercise Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {category.title}
            </h3>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">
            No recent activity. Start learning to see your progress!
          </p>
        </div>
      </div>
    </div>
  )
} 