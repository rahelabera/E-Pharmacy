"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  PillIcon,
  ShoppingCart,
  FileText,
  MessageSquare,
  MapPin,
  LogOut,
  Menu,
} from "lucide-react"
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Logo } from "@/components/logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/drugs", label: "Drugs", icon: PillIcon },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  ]

  const SidebarContent = (
    <VStack spacing="1" align="stretch" py="4">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button
            as="a"
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<item.icon size={20} />}
            bg={pathname === item.href ? "blue.50" : "transparent"}
            color={pathname === item.href ? "blue.600" : "gray.600"}
            _hover={{ bg: "gray.100" }}
            w="full"
            onClick={isMobile ? onClose : undefined}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </VStack>
  )

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Mobile menu button */}
      <Box position="fixed" top="4" left="4" zIndex="50" display={{ base: "block", lg: "none" }}>
        <IconButton
          aria-label="Open Menu"
          icon={<Menu size={24} />}
          onClick={onOpen}
          variant="outline"
          colorScheme="blue"
        />
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Logo />
          </DrawerHeader>
          <DrawerBody p="0">
            {SidebarContent}
            <Box p="4" borderTopWidth="1px" mt="auto">
              <HStack mb="4" spacing="3">
                <Flex h="10" w="10" borderRadius="full" bg="blue.100" alignItems="center" justifyContent="center">
                  <Text color="blue.500" fontWeight="medium">
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </Flex>
                <Box>
                  <Text fontWeight="medium">{user.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.email}
                  </Text>
                </Box>
              </HStack>
              <Button
                variant="outline"
                w="full"
                justifyContent="flex-start"
                leftIcon={<LogOut size={16} />}
                colorScheme="red"
                onClick={() => {
                  logout()
                  onClose()
                }}
              >
                Logout
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop sidebar */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        w="64"
        bg="white"
        borderRightWidth="1px"
        position="fixed"
        h="full"
        zIndex="10"
      >
        <Flex h="16" alignItems="center" borderBottomWidth="1px" px="6">
          <Logo />
        </Flex>
        <Box flex="1" overflowY="auto">
          {SidebarContent}
        </Box>
        <Box borderTopWidth="1px" p="4">
          <HStack mb="4" spacing="3">
            <Flex h="10" w="10" borderRadius="full" bg="blue.100" alignItems="center" justifyContent="center">
              <Text color="blue.500" fontWeight="medium">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </Flex>
            <Box>
              <Text fontWeight="medium">{user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {user.email}
              </Text>
            </Box>
          </HStack>
          <Button
            variant="outline"
            w="full"
            justifyContent="flex-start"
            leftIcon={<LogOut size={16} />}
            colorScheme="red"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box
        flex="1"
        ml={{ base: 0, lg: "64" }}
        pt={{ base: "16", lg: "0" }}
        transition="margin-left 300ms ease-in-out"
        display="flex"
        flexDir="column"
        overflow="hidden"
      >
        <Box flex="1" overflowY="auto" bg="blue.50" p="6">
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

function LoadingSkeleton() {
  return (
    <Flex h="100vh">
      {/* Sidebar skeleton */}
      <Box w="64" flexShrink="0" borderRightWidth="1px" bg="white" display={{ base: "none", lg: "block" }}>
        <Flex h="16" alignItems="center" borderBottomWidth="1px" px="6">
          <Skeleton h="8" w="40" />
        </Flex>
        <Box p="4">
          <VStack spacing="4" align="stretch">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} h="10" w="full" />
              ))}
          </VStack>
        </Box>
      </Box>

      {/* Main content skeleton */}
      <Box flex="1" bg="blue.50" p="6">
        <VStack spacing="4" align="stretch">
          <Skeleton h="8" w="64" />
          <Flex gap="4" flexWrap="wrap">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} h="32" w={{ base: "full", md: "calc(33.333% - 16px)" }} />
              ))}
          </Flex>
          <Skeleton h="64" w="full" />
        </VStack>
      </Box>
    </Flex>
  )
}
