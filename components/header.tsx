"use client"

import { useEffect, useState } from "react"
import {
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  Spinner,
  MenuDivider,
  Box,
} from "@chakra-ui/react"
import { FiUser, FiSettings, FiLogOut, FiEdit2 } from "react-icons/fi"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

interface HeaderProps {
  onOpenSidebar: () => void
}

interface ProfileData {
  id: number
  name: string
  username: string
  email: string
  profile_image: string | null
  address: string | null
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileImageKey, setProfileImageKey] = useState(Date.now())

  // Fetch profile data including profile image
  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/profile")
      if (response.data.status === "success") {
        setProfileData(response.data.data)
        setProfileImageKey(Date.now())
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
    const handleProfileUpdate = () => {
      fetchProfileData()
    }
    window.addEventListener("profileUpdated", handleProfileUpdate)
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="flex-end"
      w="full"
      px={{ base: 2, md: 4 }}
      py={2}
      bg="transparent"
      borderBottom="none"
      h="16"
      position="sticky"
      top="0"
      zIndex="10"
      boxShadow="none"
    >
      <Menu>
        <MenuButton as={Box} rounded="full" cursor="pointer" _hover={{ opacity: 0.8 }}>
          <HStack spacing={2}>
            {isLoading ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Avatar
                key={profileImageKey}
                size="sm"
                name={profileData?.name || user?.name}
                src={profileData?.profile_image || undefined}
                borderWidth={2}
                borderColor="blue.400"
              />
            )}
            {/* Remove name and role display */}
            {/* <Box display={{ base: "none", md: "block" }}>
              <Text fontWeight="medium" fontSize="sm" lineHeight="tight">
                {profileData?.name || user?.name || "-"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                ADMIN
              </Text>
            </Box> */}
          </HStack>
        </MenuButton>
        <MenuList shadow="lg" borderColor="gray.200" p={0}>
          <Box px={4} py={3} borderBottomWidth="1px" borderColor="gray.200" bg="blue.50">
            <HStack align="center" mb={2}>
              <Avatar
                key={profileImageKey}
                size="md"
                name={profileData?.name || user?.name}
                src={profileData?.profile_image || undefined}
                mr={3}
                borderWidth={2}
                borderColor="blue.400"
              />
              <Box>
                <Text fontWeight="medium">
                  {profileData?.name || user?.name || "-"}
                </Text>
              </Box>
            </HStack>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {profileData?.email || user?.email || "-"}
            </Text>
          </Box>
          <MenuItem
            icon={<FiUser color="#3182CE" />}
            onClick={() => router.push("/dashboard/profile")}
            _hover={{ bg: "blue.50" }}
          >
            View Profile
          </MenuItem>
          <MenuItem
            icon={<FiEdit2 color="#3182CE" />}
            onClick={() => router.push("/dashboard/profile/edit")}
            _hover={{ bg: "blue.50" }}
          >
            Edit Profile
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<FiLogOut color="#E53E3E" />}
            onClick={handleLogout}
            _hover={{ bg: "red.50" }}
            color="red.500"
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
