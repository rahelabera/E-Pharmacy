"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(
        "https://epharmacy-backend-production.up.railway.app/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      )

      type LoginResponse = {
        access_token: string
        redirect_url: string
        status: string
        user?: any
      }

      const { access_token, status, user } = response.data as LoginResponse

      if (status === "success" && access_token) {
        // Save token to localStorage
        localStorage.setItem("token", access_token)

        // Also set a cookie for the middleware
        document.cookie = `token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

        // Save user data if available
        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
        }

        // Set authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        // Try both navigation methods for better reliability
        setTimeout(() => {
          try {
            router.push("/dashboard")
            // As a fallback, also use direct navigation
            setTimeout(() => {
              window.location.href = "/dashboard"
            }, 500)
          } catch (error) {
            console.error("Navigation error:", error)
            window.location.href = "/dashboard"
          }
        }, 1000) // Small delay to ensure toast is visible
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials or server error",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Login request failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.50">
      <Card maxW="md" w="full" boxShadow="lg">
        <CardHeader bg="blue.500" color="white" borderTopRadius="lg" textAlign="center" pb={6}>
          <Center mb={4}>
            <Box bg="white" p={2} borderRadius="lg">
              <Logo size="large" showText={false} />
            </Box>
          </Center>
          <Heading size="lg" color="white">
            Admin Dashboard Login
          </Heading>
          <Text color="blue.100" mt={2}>
            Use these credentials to login:
            <br />
            <Text as="span" fontWeight="medium" color="white">
              Email: admin@example.com
            </Text>
            <br />
            <Text as="span" fontWeight="medium" color="white">
              Password: admin123
            </Text>
          </Text>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody pt={6} pb={4}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
            </Stack>
          </CardBody>

          <CardFooter>
            <Button type="submit" colorScheme="blue" w="full" isDisabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" mr={2} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Box>
  )
}
