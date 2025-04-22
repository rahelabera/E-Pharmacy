"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
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
} from "@chakra-ui/react"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.50">
      <Card maxW="md" w="full" boxShadow="lg">
        <CardHeader bg="blue.500" color="white" borderTopRadius="lg" textAlign="center" pb={6}>
          <Center mb={4}>
            <Box bg="white" p={2} borderRadius="lg">
              <Logo size="large" />
            </Box>
          </Center>
          <Heading size="lg" textAlign="center" color="white">
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
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
