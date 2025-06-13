'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      await handleSignIn(email, password)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      router.push("/")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    session,
    status,
    isLoading,
    handleSignIn,
    handleSignUp,
    handleSignOut,
  }
}