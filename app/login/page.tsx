"use client"

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
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Link,
} from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginPage() {
  // State for login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State for forgot password modal
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  
  // State for reset password modal
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const router = useRouter()
  const toast = useToast()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post(
        "https://e-pharmacybackend-production.up.railway.app/api/auth/login",
        { email: loginEmail, password: loginPassword },
        { headers: { "Content-Type": "application/json" } }
      )

      console.log("Login response:", response.data)

      const { access_token, user } = response.data.data

      if (access_token) {
        localStorage.setItem("token", access_token)
        document.cookie = `token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        })

        setTimeout(() => {
          try {
            router.push("/dashboard")
            console.log("Router push to dashboard")
            setTimeout(() => {
              if (window.location.pathname !== "/dashboard") {
                console.log("Fallback to direct navigation")
                window.location.href = "/dashboard"
              }
            }, 500)
          } catch (err) {
            console.error("Navigation error:", err)
            window.location.href = "/dashboard"
          }
        }, 300)
      } else {
        throw new Error("No access token received")
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message)
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Handle forgot password submission (request OTP)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setIsSubmitting(true)

    try {
      console.log("Requesting reset OTP for email:", resetEmail)
      const response = await axios.post(
        "https://e-pharmacybackend-production.up.railway.app/api/password/reset/otp",
        { email: resetEmail },
        { headers: { "Content-Type": "application/json" } }
      )
      console.log("OTP response:", response.data)

      if (response.data.status === "success") {
        toast({
          title: "Reset token sent",
          description: "Check your email (including spam/junk) for the reset token",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setIsForgotPasswordModalOpen(false)
        setIsResetPasswordModalOpen(true) // Open reset password modal
      } else {
        throw new Error(response.data.message || "Failed to initiate password reset")
      }
    } catch (error: any) {
      console.error("Reset OTP error:", error.response?.data || error.message)
      toast({
        title: "Request failed",
        description: error.response?.data?.message || "Failed to send reset token. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle password reset submission
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail || !resetToken || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setIsSubmitting(true)

    try {
      console.log("Resetting password for email:", resetEmail)
      const response = await axios.post(
        "https://e-pharmacybackend-production.up.railway.app/api/password/reset",
        {
          email: resetEmail,
          token: resetToken,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      console.log("Reset response:", response.data)

      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      setIsResetPasswordModalOpen(false)
      setResetEmail("")
      setResetToken("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Reset error:", error.response?.data || error.message)
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "Failed to reset password",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open forgot password modal
  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true)
  }

  // Close forgot password modal
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false)
    setResetEmail("")
  }

  // Close reset password modal
  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false)
    setResetEmail("")
    setResetToken("")
    setNewPassword("")
    setConfirmPassword("")
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

        <form onSubmit={handleLoginSubmit}>
          <CardBody pt={6} pb={4}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
              <Link
                color="blue.500"
                onClick={openForgotPasswordModal}
                fontSize="sm"
                textAlign="right"
              >
                Forgot Password?
              </Link>
            </Stack>
          </CardBody>

          <CardFooter>
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              isLoading={isSubmitting}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Forgot Password Modal */}
      <Modal isOpen={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleForgotPasswordSubmit}>
            <ModalHeader>Request Password Reset</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeForgotPasswordModal} mr={3}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Send Reset Token
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={isResetPasswordModalOpen} onClose={closeResetPasswordModal}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleResetPasswordSubmit}>
            <ModalHeader>Reset Password</ModalHeader>
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={resetEmail}
                    isDisabled
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Reset Token</FormLabel>
                  <Input
                    type="text"
                    placeholder="Paste token from email"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeResetPasswordModal} mr={3}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Resetting..."
              >
                Reset Password
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}