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
}

function NavItem({ icon, children, href, isActive, isCollapsed = false, badge = null, onClick }: NavItemProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
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
          {icon && <Icon fontSize="18" as={icon} />}
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

  useEffect(() => {
    // Fetch pending pharmacists count
    const fetchPendingCount = async () => {
      try {
        const response = await api.get("/admin/pharmacists/all")
        if (response.data.status === "success" && response.data.data) {
          const pendingPharmacists = response.data.data.data.filter(
            (pharmacist: any) => pharmacist.status === "pending",
          )
          setPendingCount(pendingPharmacists.length)
        }
      } catch (error) {
        console.error("Error fetching pending pharmacists count:", error)
        setPendingCount(null)
      }
    }

    fetchPendingCount()
    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchPendingCount, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const navigateToPendingPharmacists = () => {
    // Store the selected tab in localStorage
    localStorage.setItem("pharmacistsTab", "pending")
    router.push("/dashboard/pharmacists")
  }

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Patients", icon: FiUser, path: "/dashboard/patients" },
    {
      name: "Pharmacists",
      icon: FiUserCheck,
      path: "/dashboard/pharmacists",
      badge: pendingCount,
    },
    { name: "Drugs", icon: FiPackage, path: "/dashboard/drugs" },
    { name: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
  ]

  return (
    <Box
      transition="0.3s ease"
      bg={useColorModeValue("blue.500", "blue.900")}
      w={{ base: isOpen ? "full" : 0, md: isCollapsed ? "60px" : "240px" }}
      pos="fixed"
      h="full"
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      zIndex={20}
      color="white"
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
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} color="white" />
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
        />
      </Flex>
    </Box>
  )
}
