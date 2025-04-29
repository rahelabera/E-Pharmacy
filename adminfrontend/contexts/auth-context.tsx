"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@chakra-ui/react"
import axios from "axios"

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
    // This code only runs on the client side
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)

        // Set default authorization header for all axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
      }
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      interface LoginResponse {
        access_token: string
        redirect_url: string
        status: string
        user?: any
      }

      const response = await axios.post<LoginResponse>(
        "https://epharmacy-backend-production.up.railway.app/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      )

      const { access_token, redirect_url, status, user: userData } = response.data

      if (status === "success" && access_token) {
        // Create user object from response
        const user = userData || {
          id: 1,
          name: "Admin User",
          email: email,
          is_role: 0,
        }

        setUser(user)
        setToken(access_token)

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", access_token)

        // Set default authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        // Navigate to the redirect URL from the API
        window.location.href = `/${redirect_url}`
      } else {
        throw new Error("Invalid credentials or server error")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Remove auth header
    delete axios.defaults.headers.common["Authorization"]

    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Redirect to login page
    window.location.href = "/login"

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
