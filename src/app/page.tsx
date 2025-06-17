import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Master English with Interactive Learning
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
              Practice vocabulary, grammar, and listening skills with our AI-powered platform.
              Learn at your own pace with personalized exercises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link
                href="/auth/signin"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose EnglishYou?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card p-8 hover:-translate-y-1"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-primary-600">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
            Join thousands of learners who have already improved their English skills with EnglishYou.
          </p>
          <Link
            href="/auth/signup"
            className="btn btn-primary text-lg px-12 py-4"
          >
            Start Learning Now
          </Link>
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