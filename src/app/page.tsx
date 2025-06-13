import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Master English with Interactive Learning
            </h1>
            <p className="text-xl mb-8">
              Practice vocabulary, grammar, and listening skills with our AI-powered platform.
              Learn at your own pace with personalized exercises.
            </p>
            <div className="space-x-4">
              <Link
                href="/auth/signin"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EnglishYou?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition">
                <div className="text-blue-600 text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: '🎯',
    title: 'Interactive Exercises',
    description: 'Practice with various types of exercises including grammar, vocabulary, and listening comprehension.',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    description: 'Learn efficiently with our scientifically-proven spaced repetition system.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Learning',
    description: 'Get personalized feedback and explanations powered by advanced AI technology.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed statistics and insights.',
  },
  {
    icon: '🎧',
    title: 'Listening Practice',
    description: 'Improve your listening skills with authentic audio content and exercises.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Learn on the go with our responsive design that works on any device.',
  },
] 