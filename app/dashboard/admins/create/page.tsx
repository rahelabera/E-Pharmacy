"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  FormErrorMessage,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi"
import api from "@/lib/api"

export default function CreateAdminPage() {
  const router = useRouter()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setIsConfirmOpen(true)
  }

  const handleConfirmCreate = async () => {
    setIsConfirmOpen(false)
    setIsSubmitting(true)
    try {
      // Prepare data for API
      const adminData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        is_role: 0, // Set role to admin automatically
      }

      // Send create request
      const response = await api.post("https://e-pharmacybackend-production.up.railway.app/api/admin/create", adminData)

      if (response.data.status === "success") {
        toast({
          title: "Success",
          description: "Admin created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create admin",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error: any) {
      console.error("Error creating admin:", error)

      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const formattedErrors: Record<string, string> = {}

        Object.entries(apiErrors).forEach(([key, value]) => {
          formattedErrors[key] = Array.isArray(value) ? value[0] : (value as string)
        })

        setErrors(formattedErrors)
      }

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create admin",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxW="container.md" py={6}>
      <Card>
        <CardHeader>
          <Heading size="md">Create Admin</Heading>
          <Text color="gray.600" mt={2}>
            Create a new admin who will have access to the pharmacy management system.
          </Text>
        </CardHeader>
        <CardBody>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password_confirmation} isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
              </FormControl>

              <Flex justify="space-between" mt={4}>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                  Create Admin
                </Button>
              </Flex>
            </VStack>
          </form>
        </CardBody>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog isOpen={isConfirmOpen} leastDestructiveRef={cancelRef} onClose={() => setIsConfirmOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Admin Creation
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to create this admin account?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmCreate} ml={3} isLoading={isSubmitting}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}
