import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: adminPassword,
      progress: {
        create: {
          level: 'Advanced',
          vocabularyWords: 0,
          grammarExercises: 0,
          listeningExercises: 0,
          speakingExercises: 0,
          totalScore: 0,
          streak: 0
        }
      }
    }
  })

  // Create vocabulary exercises
  const vocabularyExercises = [
    {
      title: 'Basic Vocabulary Quiz',
      description: 'Test your knowledge of common English words',
      type: 'vocabulary',
      difficulty: 'beginner',
      content: {
        questions: [
          {
            id: '1',
            question: 'What is the opposite of "hot"?',
            options: ['Cold', 'Warm', 'Cool', 'Freezing'],
            correctAnswer: 'Cold'
          },
          {
            id: '2',
            question: 'Which word means "to move quickly"?',
            options: ['Walk', 'Run', 'Crawl', 'Jump'],
            correctAnswer: 'Run'
          },
          {
            id: '3',
            question: 'What is a synonym for "happy"?',
            options: ['Sad', 'Angry', 'Joyful', 'Tired'],
            correctAnswer: 'Joyful'
          }
        ]
      }
    },
    {
      title: 'Intermediate Vocabulary Challenge',
      description: 'Expand your vocabulary with these intermediate-level words',
      type: 'vocabulary',
      difficulty: 'intermediate',
      content: {
        questions: [
          {
            id: '1',
            question: 'What does "ambiguous" mean?',
            options: ['Clear', 'Uncertain', 'Definite', 'Obvious'],
            correctAnswer: 'Uncertain'
          },
          {
            id: '2',
            question: 'Which word means "to make something better"?',
            options: ['Improve', 'Worsen', 'Maintain', 'Destroy'],
            correctAnswer: 'Improve'
          },
          {
            id: '3',
            question: 'What is the meaning of "perseverance"?',
            options: ['Giving up', 'Persistence', 'Failure', 'Success'],
            correctAnswer: 'Persistence'
          }
        ]
      }
    }
  ]

  // Create grammar exercises
  const grammarExercises = [
    {
      title: 'Basic Grammar Rules',
      description: 'Learn and practice essential English grammar rules',
      type: 'grammar',
      difficulty: 'beginner',
      content: {
        questions: [
          {
            id: '1',
            question: 'Which sentence is grammatically correct?',
            options: [
              'I am going to the store.',
              'I going to the store.',
              'I goes to the store.',
              'I go to the store.'
            ],
            correctAnswer: 'I am going to the store.'
          },
          {
            id: '2',
            question: 'What is the correct plural form of "child"?',
            options: ['Childs', 'Children', 'Childes', 'Child'],
            correctAnswer: 'Children'
          },
          {
            id: '3',
            question: 'Which sentence uses the correct past tense?',
            options: [
              'I walk to school yesterday.',
              'I walked to school yesterday.',
              'I walking to school yesterday.',
              'I walks to school yesterday.'
            ],
            correctAnswer: 'I walked to school yesterday.'
          }
        ]
      }
    },
    {
      title: 'Advanced Grammar Practice',
      description: 'Challenge yourself with complex grammar structures',
      type: 'grammar',
      difficulty: 'advanced',
      content: {
        questions: [
          {
            id: '1',
            question: 'Which sentence uses the subjunctive mood correctly?',
            options: [
              'I wish I was taller.',
              'I wish I were taller.',
              'I wish I am taller.',
              'I wish I be taller.'
            ],
            correctAnswer: 'I wish I were taller.'
          },
          {
            id: '2',
            question: 'What is the correct form of the conditional sentence?',
            options: [
              'If I would have known, I would have helped.',
              'If I had known, I would have helped.',
              'If I knew, I would help.',
              'If I would know, I would help.'
            ],
            correctAnswer: 'If I had known, I would have helped.'
          },
          {
            id: '3',
            question: 'Which sentence uses the passive voice correctly?',
            options: [
              'The book was written by Shakespeare.',
              'Shakespeare wrote the book.',
              'The book wrote by Shakespeare.',
              'The book is writing by Shakespeare.'
            ],
            correctAnswer: 'The book was written by Shakespeare.'
          }
        ]
      }
    }
  ]

  // Create all exercises
  for (const exercise of [...vocabularyExercises, ...grammarExercises]) {
    await prisma.exercise.create({
      data: {
        ...exercise,
        userId: admin.id
      }
    })
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 