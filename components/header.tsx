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
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react"
import { FiMenu, FiLogOut, FiUser, FiSettings, FiSearch, FiBell, FiMapPin } from "react-icons/fi"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface HeaderProps {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  // Helper function to handle null values
  const formatValue = (value: string | null | undefined): string => {
    return value ? value : "-"
  }

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)

    // Create breadcrumb items
    return paths.map((path, index) => {
      // Build the URL for this breadcrumb
      const url = `/${paths.slice(0, index + 1).join("/")}`

      // Format the breadcrumb text (capitalize first letter)
      const text = path.charAt(0).toUpperCase() + path.slice(1)

      // If this is the last item, don't make it a link
      const isLast = index === paths.length - 1

      return (
        <BreadcrumbItem key={url} isCurrentPage={isLast}>
          {isLast ? (
            <Text>{text}</Text>
          ) : (
            <BreadcrumbLink as={Link} href={url}>
              {text}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      )
    })
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg="transparent" // Make header background transparent
      // borderBottomWidth="1px"
      // borderColor={useColorModeValue("gray.200", "gray.700")}
      h="14"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Flex align="center">
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpenSidebar}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        {/* <Breadcrumb ml={{ base: 2, md: 4 }} fontSize="sm">
          {generateBreadcrumbs()}
        </Breadcrumb> */}
      </Flex>

      {/* <Flex flex={1} justify="center" px={8}>
        <InputGroup maxW="md">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input type="text" placeholder="Search..." borderRadius="full" bg="gray.50" />
        </InputGroup>
      </Flex> */}

      <HStack spacing={4}>
        {/* <IconButton aria-label="Notifications" icon={<FiBell />} variant="ghost" colorScheme="blue" /> */}

        <Menu>
          <MenuButton as={Box} rounded="full" cursor="pointer">
            <HStack spacing={2}>
              <Avatar size="sm" name={user?.name} />
              {/* <Box display={{ base: "none", md: "block" }} textAlign="left">
                <Text fontWeight="medium" fontSize="sm" lineHeight="tight">
                  {user?.name || "-"}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  ADMIN
                </Text>
              </Box> */}
            </HStack>
          </MenuButton>
          <MenuList>
            <Box px={3} py={2} borderBottomWidth="1px">
              <Text fontWeight="medium">{user?.name || "-"}</Text>
              <Text fontSize="xs" color="gray.500">
                E-MARKET PHARMACY ADMIN
              </Text>
              <HStack mt={1} fontSize="xs" color="gray.500">
                <FiMapPin />
                <Text>Addis Ababa, Ethiopia</Text>
              </HStack>
            </Box>
            {/* <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Settings</MenuItem> */}
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  )
}
