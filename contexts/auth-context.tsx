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
  logout: () => Promise<void>
  isLoading: boolean
  verifyToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()

  // Verify token function
  const verifyToken = async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem("token")

      if (!storedToken) {
        return false
      }

      // Set authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`

      // Verify token with the API
      const response = await axios.get("https://e-pharmacybackend-production.up.railway.app/api/verify-token")

      console.log("Token verification response:", response.data)

      // If verification successful, set user data
      if (response.data.success || response.status === 200) {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
        }
        return true
      } else {
        // Clear invalid token
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return false
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      // Clear invalid token
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return false
    }
  }

  useEffect(() => {
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isValid = await verifyToken();

      if (!isValid && typeof window !== "undefined") {
        // Clear token and user data if invalid
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // Redirect to login only if not already on login or root
        if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://e-pharmacybackend-production.up.railway.app/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      )

      // Handle different response structures
      const token = response.data.data?.token || response.data.token
      const userData = response.data.data?.user || response.data.user

      if (token) {
        // Create user object from response
        const user = userData || {
          id: 1,
          name: "Admin User",
          email: email,
          is_role: 0,
        }

        setUser(user)
        setToken(token)

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)

        // Also set a cookie for the middleware
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

        // Set default authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        // Navigate to dashboard with fallback
        setTimeout(() => {
          try {
            router.push("/dashboard")
            // As a fallback, also use direct navigation
            setTimeout(() => {
              if (window.location.pathname !== "/dashboard") {
                window.location.href = "/dashboard"
              }
            }, 500)
          } catch (error) {
            console.error("Navigation error:", error)
            window.location.href = "/dashboard"
          }
        }, 300)
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

  const logout = async () => {
    try {
      setIsLoading(true)

      // Call the logout API endpoint
      if (token) {
        await axios.post(
          "https://e-pharmacybackend-production.up.railway.app/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }

      // Remove auth header
      delete axios.defaults.headers.common["Authorization"]

      // Clear local storage
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")

      // Clear the cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        status: "info",
        duration: 3000,
        isClosable: true,
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)

      // Even if the API call fails, clear local data
      setUser(null)
      setToken(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      // Redirect to login page
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, verifyToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
