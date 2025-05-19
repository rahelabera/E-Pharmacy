"use client"

import type React from "react"

import { Box, Flex, CloseButton, VStack, Icon, useColorModeValue, Tooltip, IconButton, Text } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiMessageSquare,
  FiMap,
  FiUserCheck,
  FiDollarSign,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { Logo } from "./logo"

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
}

function NavItem({ icon, children, href, isActive, isCollapsed = false }: NavItemProps) {
  return (
    <Tooltip label={isCollapsed ? children : ""} placement="right" hasArrow isDisabled={!isCollapsed}>
      <Link href={href} style={{ width: "100%" }}>
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
        >
          {icon && <Icon fontSize="18" as={icon} />}
          {!isCollapsed && (
            <Text ml={4} display="block">
              {children}
            </Text>
          )}
        </Flex>
      </Link>
    </Tooltip>
  )
}

export function Sidebar({ isOpen, onClose, isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    // { name: "Users", icon: FiUsers, path: "/dashboard/users" },
    { name: "Patients", icon: FiUser, path: "/dashboard/patients" },
    { name: "Pharmacists", icon: FiUserCheck, path: "/dashboard/pharmacists" },
    { name: "Drugs", icon: FiPackage, path: "/dashboard/drugs" },
    { name: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    // { name: "Transactions", icon: FiDollarSign, path: "/dashboard/transactions" },
    // { name: "Prescriptions", icon: FiFileText, path: "/dashboard/prescriptions" },
    // { name: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    // { name: "Locations", icon: FiMap, path: "/dashboard/locations" },
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
        <Logo size="small" showText={!isCollapsed} />
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
