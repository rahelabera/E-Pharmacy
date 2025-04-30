"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Center, Spinner } from "@chakra-ui/react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to login page first
    router.push("/login")
  }, [router])

  return (
    <Center h="100vh">
      <Spinner size="xl" color="blue.500" />
    </Center>
  )
}
