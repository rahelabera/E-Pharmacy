"use client"

import type React from "react"

import {
  Box,
  Flex,
  CloseButton,
  VStack,
  Icon,
  useColorModeValue,
  Tooltip,
  IconButton,
  Text,
  Badge,
  useDisclosure,
} from "@chakra-ui/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUserCheck,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiUserPlus,
} from "react-icons/fi"
import { Logo } from "./logo"
import { useState, useEffect } from "react"
import api from "@/lib/api"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  toggleSidebar: () => void
}

interface NavItemProps {
  icon: any
  children: React.ReactNode
  href: string
  isActive?: boolean
  isCollapsed?: boolean
  badge?: number | null
  onClick?: () => void
  onClose?: () => void
}

function NavItem({
  icon,
  children,
  href,
  isActive,
  isCollapsed = false,
  badge = null,
  onClick,
  onClose,
}: NavItemProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    } else if (onClose && window.innerWidth < 768) {
      // Close sidebar on mobile when clicking a nav item
      onClose()
    }
  }

  return (
    <Tooltip label={isCollapsed ? children : ""} placement="right" hasArrow isDisabled={!isCollapsed}>
      <Link href={href} style={{ width: "100%" }} onClick={handleClick}>
        <Flex
          align="center"
          p="3"
          mx="2"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? "blue.400" : "transparent"}
          color={isActive ? "white" : "inherit"}
          _hover={{
            bg: isActive ? "blue.400" : "blue.50",
            color: isActive ? "white" : "blue.400",
          }}
          justifyContent={isCollapsed ? "center" : "flex-start"}
          position="relative"
        >
          {icon && (
            <Icon fontSize="18" as={icon} color="white.400" _groupHover={{ color: isActive ? "white" : "blue.500" }} />
          )}
          {!isCollapsed && (
            <Flex flex="1" ml={4} align="center" justify="space-between">
              <Text display="block">{children}</Text>
              {badge !== null && badge > 0 && (
                <Badge colorScheme="red" borderRadius="full" px={2}>
                  {badge}
                </Badge>
              )}
            </Flex>
          )}
          {isCollapsed && badge !== null && badge > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="1"
              right="1"
              transform="translate(50%, -50%)"
              px={1.5}
              py={0.5}
              fontSize="xs"
            >
              {badge}
            </Badge>
          )}
        </Flex>
      </Link>
    </Tooltip>
  )
}

export function Sidebar({ isOpen, onClose, isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const { isOpen: mobileOpen, onOpen: openMobile, onClose: closeMobile } = useDisclosure({ defaultIsOpen: false })

  // Function to fetch pending pharmacists count
  const fetchPendingCount = async () => {
    try {
      const response = await api.get("/admin/pharmacists/all?page=1?page=1&per_page=10")
      if (response.data.status === "success" && response.data.data) {
        const pendingPharmacists = response.data.data.data.filter((pharmacist: any) => pharmacist.status === "pending")
        setPendingCount(pendingPharmacists.length)
      }
    } catch (error) {
      console.error("Error fetching pending pharmacies count:", error)
      setPendingCount(null)
    }
  }

  useEffect(() => {
    fetchPendingCount()
    // Set up a refresh interval (every 2 minutes)
    const intervalId = setInterval(fetchPendingCount, 2 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Add event listener to update count when a pharmacist is approved
  useEffect(() => {
    // Create a custom event for pharmacist approval
    const handlePharmacistApproval = () => {
      fetchPendingCount()
    }

    // Listen for the custom event
    window.addEventListener("pharmacistApproved", handlePharmacistApproval)

    return () => {
      window.removeEventListener("pharmacistApproved", handlePharmacistApproval)
    }
  }, [])

  const navigateToPendingPharmacists = () => {
    // Store the selected tab in localStorage
    localStorage.setItem("pharmacistsTab", "pending")
    router.push("/dashboard/pharmacists")
    if (window.innerWidth < 768) {
      onClose() // Close sidebar on mobile
    }
  }

  // Remove badge if pendingCount is 0 or null
  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Users", icon: FiUser, path: "/dashboard/patients" },
    {
      name: "Pharmacies",
      icon: FiUserCheck,
      path: "/dashboard/pharmacists",
      badge: pendingCount !== null && pendingCount > 0 ? pendingCount : null, // Only show badge if > 0
    },
    { name: "Drugs", icon: FiPackage, path: "/dashboard/drugs" },
    { name: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    { name: "Create Admin", icon: FiUserPlus, path: "/dashboard/admins/create" },
  ]

  // Overlay for mobile to close sidebar on click outside
  const MobileSidebarOverlay = () => (
    <Box
      display={{ base: mobileOpen ? "block" : "none", md: "none" }}
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="blackAlpha.400"
      zIndex={19}
      onClick={closeMobile}
    />
  )

  return (
    <>
      {/* Mobile open button */}
      <IconButton
        aria-label="Open sidebar"
        icon={<FiChevronRight />}
        display={{ base: mobileOpen ? "none" : "inline-flex", md: "none" }}
        position="fixed"
        top={4}
        left={4}
        zIndex={30}
        colorScheme="blue"
        onClick={openMobile}
        size="lg"
        bg="white"
        color="blue.500"
        boxShadow="md"
      />

      {/* Overlay for mobile */}
      <MobileSidebarOverlay />

      <Box
        transition="0.3s ease"
        bg={useColorModeValue("blue.500", "blue.900")}
        // Set mobile width to 60vw for a smaller sidebar on mobile
        w={{ base: mobileOpen ? "40vw" : 0, md: isCollapsed ? "60px" : "240px" }}
        pos="fixed"
        h="full"
        display={{ base: mobileOpen ? "block" : "none", md: "block" }}
        zIndex={20}
        color="white"
        boxShadow={{ base: mobileOpen ? "2xl" : "none", md: "none" }}
        overflow="auto"
      >
        <Flex
          h="20"
          alignItems="center"
          mx={isCollapsed ? "0" : "4"}
          justifyContent={isCollapsed ? "center" : "space-between"}
        >
          <Flex align="center">
            <Box bg="white" p={2} borderRadius="lg">
              <img src="/favicon.ico" alt="Logo" style={{ height: 40, width: 40, objectFit: "contain" }} />
            </Box>
            {!isCollapsed && (
              <Flex direction="column" ml={2}>
                <Text fontWeight="bold" color="white" fontSize="lg" lineHeight="1">
                  E-Pharmacy
                </Text>
                <Text fontSize="xs" color="white" lineHeight="1" mt={1}>
                  Admin Portal
                </Text>
              </Flex>
            )}
          </Flex>
          <CloseButton display={{ base: "flex", md: "none" }} onClick={closeMobile} color="white" />
        </Flex>

        <VStack spacing="1" align="stretch">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              href={item.path}
              isActive={pathname === item.path}
              isCollapsed={isCollapsed}
              badge={item.badge}
              onClose={closeMobile}
            >
              {item.name}
            </NavItem>
          ))}
        </VStack>

        {/* Collapse/Expand button */}
        <Flex position="absolute" bottom="5" width="100%" justifyContent="center" alignItems="center">
          <IconButton
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            onClick={toggleSidebar}
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.400" }}
            size="sm"
            display={{ base: "none", md: "flex" }}
          />
        </Flex>
      </Box>
    </>
  )
}
