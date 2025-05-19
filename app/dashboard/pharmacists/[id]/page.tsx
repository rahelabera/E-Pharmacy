"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  Badge,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  HStack,
  VStack,
  Divider,
  useToast,
  IconButton,
} from "@chakra-ui/react"
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type Pharmacist = {
  id: number
  name: string
  email: string
  is_role: number
  google_id: string | null
  phone: string | null
  address: string | null
  lat: string | null
  lng: string | null
  status: "pending" | "approved" | "rejected"
  license_image: string | null
  pharmacy_name: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export default function PharmacistDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const toast = useToast()
  const { token } = useAuth()
  const [pharmacist, setPharmacist] = useState<Pharmacist | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPharmacistDetails = async () => {
      setIsLoading(true)
      try {
        // Fetch pharmacist details
        const response = await api.get(`/admin/pharmacists/${id}`)

        console.log("Pharmacist details response:", response.data)

        // Extract pharmacist data based on API response structure
        let pharmacistData = null
        if (response.data.data) {
          pharmacistData = response.data.data
        } else if (response.data.pharmacist) {
          pharmacistData = response.data.pharmacist
        } else {
          pharmacistData = response.data
        }

        setPharmacist(pharmacistData)
      } catch (error) {
        console.error("Error fetching pharmacist details:", error)
        toast({
          title: "Error",
          description: "Failed to load pharmacist details. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchPharmacistDetails()
    }
  }, [id, token, toast])

  const handleApprovePharmacist = async () => {
    if (!pharmacist) return

    try {
      // Use the provided API endpoint for approval
      const response = await api.patch(
        `https://e-pharmacybackend-production.up.railway.app/api/approve/${pharmacist.id}`,
        {}, // Assuming no additional payload is required
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Approval response:", response.data)

      // Update the pharmacist status
      setPharmacist({
        ...pharmacist,
        status: "approved",
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "Pharmacist approved",
        description: "The pharmacist has been approved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error("Error approving pharmacist:", error)

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve pharmacist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleRejectPharmacist = async () => {
    if (!pharmacist) return

    try {
      // Use the provided API endpoint for rejection
      const response = await api.patch(
        `https://e-pharmacybackend-production.up.railway.app/api/reject/${pharmacist.id}`,
        { notes: "Rejected by admin" }, // Include a default rejection reason
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Rejection response:", response.data)

      // Update the pharmacist status
      setPharmacist({
        ...pharmacist,
        status: "rejected",
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "Pharmacist rejected",
        description: "The pharmacist has been rejected.",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error("Error rejecting pharmacist:", error)

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject pharmacist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Helper function to handle null values
  const formatValue = (value: string | null | undefined): string => {
    return value ? value : "-"
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getLicenseImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "https://via.placeholder.com/800x600.png?text=No+License+Image"

    // If the image path is a full URL, return it
    if (imagePath.startsWith("http")) return imagePath

    // Otherwise, construct the URL to the backend
    return `https://epharmacy-backend-production.up.railway.app/storage/${imagePath}`
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "approved":
        return "green"
      case "rejected":
        return "red"
      default:
        return "gray"
    }
  }

  if (isLoading) {
    return <PharmacistDetailSkeleton />
  }

  if (!pharmacist) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={6}>
          Pharmacist Not Found
        </Heading>
        <Button leftIcon={<FiArrowLeft />} onClick={() => router.back()}>
          Go Back
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Flex mb={6} align="center">
        <IconButton aria-label="Go back" icon={<FiArrowLeft />} variant="ghost" mr={4} onClick={() => router.back()} />
        <Heading size="lg">Pharmacist Details</Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Personal Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="start">
              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Name:</Text>
                <Text>{formatValue(pharmacist.name)}</Text>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Email:</Text>
                <Flex align="center">
                  <Text>{formatValue(pharmacist.email)}</Text>
                  {pharmacist.email && (
                    <IconButton
                      aria-label="Send email"
                      icon={<FiMail />}
                      variant="ghost"
                      size="sm"
                      ml={2}
                      onClick={() => (window.location.href = `mailto:${pharmacist.email}`)}
                    />
                  )}
                </Flex>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Phone:</Text>
                <Flex align="center">
                  <Text>{formatValue(pharmacist.phone)}</Text>
                  {pharmacist.phone && (
                    <IconButton
                      aria-label="Call"
                      icon={<FiPhone />}
                      variant="ghost"
                      size="sm"
                      ml={2}
                      onClick={() => (window.location.href = `tel:${pharmacist.phone}`)}
                    />
                  )}
                </Flex>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Address:</Text>
                <Flex align="center">
                  <Text>{formatValue(pharmacist.address)}</Text>
                  {pharmacist.address && (
                    <IconButton aria-label="View on map" icon={<FiMapPin />} variant="ghost" size="sm" ml={2} />
                  )}
                </Flex>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Pharmacy Name:</Text>
                <Text>{formatValue(pharmacist.pharmacy_name)}</Text>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Registration Date:</Text>
                <Flex align="center">
                  <FiCalendar />
                  <Text ml={2}>{formatDate(pharmacist.created_at)}</Text>
                </Flex>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Status:</Text>
                <Badge colorScheme={getStatusBadgeColor(pharmacist.status)}>
                  {pharmacist.status.charAt(0).toUpperCase() + pharmacist.status.slice(1)}
                </Badge>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Email Verified:</Text>
                <Badge colorScheme={pharmacist.email_verified_at ? "green" : "red"}>
                  {pharmacist.email_verified_at ? "Yes" : "No"}
                </Badge>
              </HStack>
            </VStack>

            {pharmacist.status === "pending" && (
              <>
                <Divider my={6} />
                <Flex justify="space-between">
                  <Button leftIcon={<FiXCircle />} colorScheme="red" onClick={handleRejectPharmacist}>
                    Reject
                  </Button>
                  <Button leftIcon={<FiCheckCircle />} colorScheme="green" onClick={handleApprovePharmacist}>
                    Approve
                  </Button>
                </Flex>
              </>
            )}

            {pharmacist.status === "rejected" && (
              <>
                <Divider my={6} />
                <Button leftIcon={<FiCheckCircle />} colorScheme="green" w="full" onClick={handleApprovePharmacist}>
                  Approve Pharmacist
                </Button>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">License Image</Heading>
          </CardHeader>
          <CardBody>
            {pharmacist.license_image ? (
              <Box borderRadius="md" overflow="hidden">
                <Image
                  src={getLicenseImageUrl(pharmacist.license_image) || "/placeholder.svg"}
                  alt="License"
                  w="full"
                  maxH="500px"
                  objectFit="contain"
                  fallbackSrc="https://via.placeholder.com/800x600.png?text=License+Image+Not+Available"
                />
              </Box>
            ) : (
              <Flex direction="column" align="center" justify="center" h="300px" bg="gray.100" borderRadius="md">
                <Text color="gray.500">No license image available</Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}

function PharmacistDetailSkeleton() {
  return (
    <Box>
      <Flex mb={6} align="center">
        <Skeleton height="40px" width="40px" mr={4} />
        <Skeleton height="30px" width="250px" />
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Skeleton height="24px" width="200px" />
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Flex key={i} justify="space-between">
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="20px" width="200px" />
                  </Flex>
                ))}
              <Skeleton height="40px" width="full" mt={4} />
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton height="24px" width="150px" />
          </CardHeader>
          <CardBody>
            <Skeleton height="300px" width="full" borderRadius="md" />
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
