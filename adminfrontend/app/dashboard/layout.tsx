"use client"

import type React from "react"

import { Box, Flex } from "@chakra-ui/react"
import { AuthCheck } from "@/components/auth-check"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <AuthCheck>
      <Flex h="100vh">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <Box flex="1" overflow="auto">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          <Box as="main" p={4}>
            {children}
          </Box>
        </Box>
      </Flex>
    </AuthCheck>
  )
}
