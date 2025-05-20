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
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
  IconButton,
} from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Logo } from "@/components/logo"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        "https://e-pharmacybackend-production.up.railway.app/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Response data:", response.data); // Debugging
  
      // Extract the token and user from the response
      const { access_token, user } = response.data.data;
  
      if (access_token) {
        // Save token to localStorage
        localStorage.setItem("token", access_token);
  
        // Also set a cookie for the middleware
        document.cookie = `token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  
        // Save user data if available
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
  
        // Set authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        // Redirect to the dashboard
        setTimeout(() => {
          try {
            router.push("/dashboard");
            console.log("Router push executed");
  
            // Fallback to direct navigation if router.push fails
            setTimeout(() => {
              if (window.location.pathname !== "/dashboard") {
                console.log("Fallback to direct navigation");
                window.location.href = "/dashboard";
              }
            }, 500);
          } catch (err) {
            console.error("Navigation error:", err);
            window.location.href = "/dashboard";
          }
        }, 300);
      } else {
        throw new Error("No access token received from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Login request failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.50">
      <Card maxW="md" w="full" boxShadow="lg">
        <CardHeader bg="blue.500" color="white" borderTopRadius="lg" textAlign="center" pb={6}>
          <Center mb={4}>
            <Box bg="white" p={2} borderRadius="lg">
              <img src="/favicon.ico" alt="Logo" style={{ height: 60, width: 60, objectFit: "contain" }} />
            </Box>
          </Center>
          <Heading size="lg" color="white">
            Admin Dashboard Login
          </Heading>
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
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={togglePasswordVisibility}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
          </CardBody>

          <CardFooter>
            <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading} loadingText="Logging in...">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Box>
  )
}
