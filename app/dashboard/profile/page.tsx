"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  Avatar,
  HStack,
  Text,
  Icon,
  Skeleton,
} from "@chakra-ui/react"
import { FiEdit2, FiInfo, FiMapPin, FiHome } from "react-icons/fi"
import api from "@/lib/api"

type ProfileData = {
  id: number
  name: string
  username: string
  email: string
  profile_image: string | null
  is_role: number
  phone: string | null
  address: string | null
  pharmacy_name: string | null
  account_number: string | null
  bank_name: string | null
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Flex w="full" align="center" gap={2} mb={2}>
      <Text fontWeight="bold" minW="100px">
        {label}:
      </Text>
      <Text flex="1">{value || "-"}</Text>
    </Flex>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("https://e-pharmacybackend-production.up.railway.app/api/profile")
        if (response.data.status === "success") {
          setProfile(response.data.data)
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card boxShadow="lg" borderRadius="xl">
        <CardHeader bg="blue.500" borderTopRadius="xl" color="white" px={6} py={6}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Avatar
                size="xl"
                name={profile?.name}
                src={profile?.profile_image || undefined}
                borderWidth={2}
                borderColor="white"
                bg="blue.100"
              />
              <Box>
                <Heading size="lg">{profile?.name || "-"}</Heading>
                <Text fontSize="sm" color="whiteAlpha.800">{profile?.email || "-"}</Text>
              </Box>
            </HStack>
            <Button
              colorScheme="white"
              variant="outline"
              leftIcon={<FiEdit2 />}
              onClick={() => router.push("/dashboard/profile/edit")}
            >
              Edit Profile
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading size="md" mb={4} color="blue.700" display="flex" alignItems="center">
                <Icon as={FiInfo} mr={2} />
                Basic Information
              </Heading>
              <VStack align="stretch" spacing={0}>
                <InfoRow label="Name" value={profile?.name} />
                <InfoRow label="Username" value={profile?.username} />
                <InfoRow label="Email" value={profile?.email} />
                <InfoRow label="Phone" value={profile?.phone} />
                <InfoRow label="Address" value={profile?.address} />
              </VStack>
            </Box>
            <Divider />
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}

function ProfileSkeleton() {
  return (
    <Container maxW="container.md" py={8}>
      <Card boxShadow="lg" borderRadius="xl">
        <CardHeader bg="blue.500" borderTopRadius="xl" color="white" px={6} py={6}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Skeleton height="80px" width="80px" borderRadius="full" />
              <Box>
                <Skeleton height="28px" width="180px" mb={2} />
                <Skeleton height="16px" width="120px" />
              </Box>
            </HStack>
            <Skeleton height="40px" width="120px" borderRadius="md" />
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={8} align="stretch">
            <Box>
              <Skeleton height="24px" width="180px" mb={4} />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </SimpleGrid>
            </Box>
            <Divider />
            <Box>
              <Skeleton height="24px" width="180px" mb={4} />
              <Skeleton height="20px" />
            </Box>
            <Divider />
            <Box>
              <Skeleton height="24px" width="180px" mb={4} />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </SimpleGrid>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
