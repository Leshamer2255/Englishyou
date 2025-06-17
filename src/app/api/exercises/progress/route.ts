import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = session.user as { id: string }
    const { exerciseId, score, completed } = await req.json()

    if (!exerciseId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId
        }
      },
      update: {
        score,
        completed,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        exerciseId,
        score,
        completed,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json(
      { error: "Error saving progress" },
      { status: 500 }
    )
  }
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

    const user = session.user as { id: string }
    const progresses = await prisma.progress.findMany({
      where: {
        userId: user.id
      },
      include: {
        exercise: {
          select: {
            title: true,
            type: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(progresses)
  } catch (error) {
    console.error("Error fetching exercise progress:", error)
    return NextResponse.json(
      { error: "Error fetching exercise progress" },
      { status: 500 }
    )
  }
} 