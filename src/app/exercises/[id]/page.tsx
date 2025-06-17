import { PrismaClient } from "@prisma/client"
import Exercise from "@/components/Exercise"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

interface ExerciseContent {
  questions: {
    id: string
    question: string
    options?: string[]
    correctAnswer: string
  }[]
}

interface ExercisePageProps {
  params: {
    id: string
  }
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const exercise = await prisma.exercise.findUnique({
    where: {
      id: params.id
    }
  })

  if (!exercise) {
    notFound()
  }

  const typedExercise = {
    ...exercise,
    content: exercise.content as unknown as ExerciseContent
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Exercise exercise={typedExercise} />
      </div>
    </div>
  )
} 