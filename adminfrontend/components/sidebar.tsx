"use client"

import type React from "react"

import { Box, Flex, Text, CloseButton, VStack, Icon, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiHome, FiUsers, FiPackage, FiShoppingCart, FiFileText, FiMessageSquare, FiMap } from "react-icons/fi"
import { Logo } from "./logo"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItemProps {
  icon: any
  children: React.ReactNode
  href: string
  isActive?: boolean
}

function NavItem({ icon, children, href, isActive }: NavItemProps) {
  return (
    <Link href={href} style={{ width: "100%" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "blue.400" : "transparent"}
        color={isActive ? "white" : "inherit"}
        _hover={{
          bg: isActive ? "blue.400" : "blue.50",
          color: isActive ? "white" : "blue.400",
        }}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  )
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Users", icon: FiUsers, path: "/dashboard/users" },
    { name: "Drugs", icon: FiPackage, path: "/dashboard/drugs" },
    { name: "Orders", icon: FiShoppingCart, path: "/dashboard/orders" },
    { name: "Prescriptions", icon: FiFileText, path: "/dashboard/prescriptions" },
    { name: "Messages", icon: FiMessageSquare, path: "/dashboard/messages" },
    { name: "Locations", icon: FiMap, path: "/dashboard/locations" },
  ]

  return (
    <Box
      transition="0.3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: isOpen ? "full" : 0, md: 60 }}
      pos="fixed"
      h="full"
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      zIndex={20}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center">
          <Logo size="small" />
          <Text fontSize="lg" fontWeight="bold" ml="2">
            ePharmacy
          </Text>
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <VStack spacing="1" align="stretch">
        {navItems.map((item) => (
          <NavItem key={item.path} icon={item.icon} href={item.path} isActive={pathname === item.path}>
            {item.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  )
}
