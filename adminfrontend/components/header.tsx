"use client"

import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiMenu, FiLogOut, FiUser, FiSettings } from "react-icons/fi"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg={useColorModeValue("white", "gray.800")}
      borderBottomWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      h="14"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpenSidebar}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="lg" fontWeight="bold" display={{ base: "none", md: "flex" }}>
        E-Market Pharmacy Admin
      </Text>

      <Box>
        <Menu>
          <MenuButton as={Box} rounded="full" cursor="pointer">
            <Avatar size="sm" />
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  )
}
