import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as { id: string }
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId: user.id
      }
    })

    if (!progress) {
      return NextResponse.json(
        { error: "Progress not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Error fetching progress" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { exerciseType, score } = body

    if (!exerciseType || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { progress: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update progress based on exercise type
    const progress = user.progress || {}
    const updates: any = {
      totalScore: (progress.totalScore || 0) + score,
    }

    switch (exerciseType) {
      case 'vocabulary':
        updates.vocabularyWords = (progress.vocabularyWords || 0) + 1
        break
      case 'grammar':
        updates.grammarExercises = (progress.grammarExercises || 0) + 1
        break
      case 'listening':
        updates.listeningExercises = (progress.listeningExercises || 0) + 1
        break
      case 'speaking':
        updates.speakingExercises = (progress.speakingExercises || 0) + 1
        break
    }

    // Update user's level based on total score
    const newTotalScore = updates.totalScore
    if (newTotalScore >= 1000) {
      updates.level = 'Advanced'
    } else if (newTotalScore >= 500) {
      updates.level = 'Intermediate'
    } else {
      updates.level = 'Beginner'
    }

    // Update streak
    const lastActivity = progress.lastActivity
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (!lastActivity || new Date(lastActivity).toDateString() === yesterday.toDateString()) {
      updates.streak = (progress.streak || 0) + 1
    } else if (new Date(lastActivity).toDateString() !== today.toDateString()) {
      updates.streak = 0
    }

    updates.lastActivity = today

    // Update progress in database
    const updatedProgress = await prisma.userProgress.upsert({
      where: { userId: user.id },
      update: updates,
      create: {
        userId: user.id,
        ...updates,
      },
    })

    return NextResponse.json(updatedProgress)
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 