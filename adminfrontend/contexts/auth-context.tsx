"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@chakra-ui/react"

type User = {
  id: number
  name: string
  email: string
  is_role: number // 0 for admin/pharmacist, 1 for patient
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock credentials for demo purposes
      const validCredentials = [
        { email: "admin@example.com", password: "admin123", name: "Admin User", id: 1, is_role: 0 },
        { email: "pharmacist@example.com", password: "pharma123", name: "John Pharmacist", id: 2, is_role: 0 },
      ]

      // Find matching user
      const matchedUser = validCredentials.find((user) => user.email === email && user.password === password)

      if (!matchedUser) {
        throw new Error("Invalid email or password")
      }

      // Create mock user and token
      const userData = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        is_role: matchedUser.is_role,
      }

      const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      setUser(userData)
      setToken(mockToken)

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", mockToken)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
