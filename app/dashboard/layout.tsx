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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <AuthCheck>
      <Flex h="100vh" bg="gray.50">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <Box
          flex="1"
          overflow="auto"
          ml={{ base: 0, md: isSidebarCollapsed ? "60px" : "240px" }}
          transition="margin-left 0.3s ease"
        >
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          <Box as="main" p={4}>
            {children}
          </Box>
        </Box>
      </Flex>
    </AuthCheck>
  )
}
