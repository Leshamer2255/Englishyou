import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as SessionUser
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')

    const exercises = await prisma.exercise.findMany({
      where: {
        ...(type && { type }),
        ...(difficulty && { difficulty }),
      },
      include: {
        progress: {
          where: {
            userId: user.id
          }
        }
      }
    })

    return NextResponse.json(exercises)
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return NextResponse.json(
      { error: "Error fetching exercises" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as SessionUser
    const { title, description, type, difficulty, content } = await req.json()

    if (!title || !description || !type || !difficulty || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        type,
        difficulty,
        content,
        userId: user.id
      }
    })

    return NextResponse.json(exercise)
  } catch (error) {
    console.error("Error creating exercise:", error)
    return NextResponse.json(
      { error: "Error creating exercise" },
      { status: 500 }
    )
  }
} 