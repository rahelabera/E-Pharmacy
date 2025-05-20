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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Icon,
  Avatar,
} from "@chakra-ui/react"
import { FiArrowLeft, FiPackage, FiCalendar, FiDollarSign, FiShoppingBag, FiFileText } from "react-icons/fi"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type Creator = {
  id: number
  name: string
  username: string
  email: string
  role: string | null
  profile_image: string | null
  cloudinary_public_id: string | null
  created_at: string
  updated_at: string
}

type Drug = {
  id: number
  name: string
  brand: string
  description: string
  category: string
  price: number
  stock: number
  dosage: string
  image: string | null
  prescription_needed: boolean
  expires_at: string
  creator: Creator
  username: string
}

export default function DrugDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const toast = useToast()
  const { token } = useAuth()
  const [drug, setDrug] = useState<Drug | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDrugDetails = async () => {
      setIsLoading(true)
      try {
        // Fetch drug details
        const response = await api.get(`/drugs/${id}`)
        setDrug(response.data.data)
      } catch (error) {
        console.error("Error fetching drug details:", error)
        toast({
          title: "Error",
          description: "Failed to load drug details. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchDrugDetails()
    }
  }, [id, token, toast])

  // Helper function to handle null values
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "-"
    return String(value)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-"

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const getStockStatusColor = (stock: number) => {
    if (stock <= 5) return "red"
    if (stock <= 20) return "yellow"
    return "green"
  }

  const getDrugImageUrl = (drug: Drug) => {
    if (drug.image) return drug.image

    // Return a placeholder image
    return `/placeholder.svg?text=${encodeURIComponent(drug.name)}`
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(now.getMonth() + 3)

    return expiry <= threeMonthsFromNow
  }

  if (isLoading) {
    return <DrugDetailSkeleton />
  }

  if (!drug) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={6}>
          Drug Not Found
        </Heading>
        <Button leftIcon={<FiArrowLeft />} onClick={() => router.back()}>
          Go Back
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Flex mb={6} align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            aria-label="Go back"
            icon={<FiArrowLeft />}
            variant="ghost"
            mr={4}
            onClick={() => router.back()}
          />
          <Heading size="lg">Drug Details</Heading>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Drug Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="start">
              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Name:</Text>
                <Text>{formatValue(drug.name)}</Text>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Brand:</Text>
                <Text>{formatValue(drug.brand)}</Text>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Category:</Text>
                <Badge colorScheme="blue">{formatValue(drug.category)}</Badge>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Dosage:</Text>
                <Text>{formatValue(drug.dosage)}</Text>
              </HStack>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Prescription Required:</Text>
                <Badge colorScheme={drug.prescription_needed ? "red" : "green"}>
                  {drug.prescription_needed ? "Required" : "Not Required"}
                </Badge>
              </HStack>

              <Divider />

              <Box w="full">
                <Text fontWeight="bold" mb={2}>
                  Description:
                </Text>
                <Text>{formatValue(drug.description)}</Text>
              </Box>

              <Divider />

              <SimpleGrid columns={2} spacing={4} w="full">
                <Stat>
                  <StatLabel>Price</StatLabel>
                  <StatNumber>{formatCurrency(drug.price)}</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Stock</StatLabel>
                  <StatNumber>{formatValue(drug.stock)}</StatNumber>
                  <StatHelpText>
                    <Badge colorScheme={getStockStatusColor(drug.stock)}>
                      {drug.stock <= 5 ? "Low Stock" : drug.stock <= 20 ? "Medium Stock" : "In Stock"}
                    </Badge>
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              <Box w="full">
                <Text fontWeight="bold" mb={2}>
                  Stock Level:
                </Text>
                <Progress
                  value={Math.min(drug.stock, 100)}
                  max={100}
                  colorScheme={getStockStatusColor(drug.stock)}
                  borderRadius="md"
                  size="sm"
                />
              </Box>

              <HStack w="full" justify="space-between">
                <Text fontWeight="bold">Expires On:</Text>
                <Badge colorScheme={isExpiringSoon(drug.expires_at) ? "red" : "green"}>
                  {formatDate(drug.expires_at)}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Drug Image & Details</Heading>
          </CardHeader>
          <CardBody>
            <Box borderRadius="md" overflow="hidden" mb={6}>
              <Image
                src={getDrugImageUrl(drug) || "/placeholder.svg"}
                alt={drug.name}
                w="full"
                maxH="300px"
                objectFit="contain"
                fallbackSrc={`/placeholder.svg?text=${encodeURIComponent(drug.name)}`}
              />
            </Box>

            <Divider mb={6} />

            <VStack align="start" spacing={4}>
              <Heading size="sm">Added By</Heading>
              <Flex
                align="center"
                w="full"
                bg="blue.50"
                p={4}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "blue.100", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                onClick={() => router.push(`/dashboard/pharmacists/${drug.creator?.id}`)}
                role="group"
              >
                <Avatar size="md" name={drug.creator?.name} src={drug.creator?.profile_image || undefined} mr={4} />
                <Box>
                  <Text fontWeight="bold">{formatValue(drug.creator?.name)}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {formatValue(drug.creator?.email)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Added on {formatDate(drug.creator?.created_at)}
                  </Text>
                </Box>
                <Icon
                  ml="auto"
                  as={FiArrowLeft}
                  transform="rotate(180deg)"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="all 0.2s"
                />
              </Flex>
            </VStack>

            <SimpleGrid columns={2} spacing={4} mt={6}>
              <Flex align="center" bg="blue.50" p={4} borderRadius="md">
                <Icon as={FiPackage} boxSize={6} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Category
                  </Text>
                  <Text>{formatValue(drug.category)}</Text>
                </Box>
              </Flex>

              <Flex align="center" bg="green.50" p={4} borderRadius="md">
                <Icon as={FiCalendar} boxSize={6} color="green.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Expiry Date
                  </Text>
                  <Text>{formatDate(drug.expires_at)}</Text>
                </Box>
              </Flex>

              <Flex align="center" bg="purple.50" p={4} borderRadius="md">
                <Icon as={FiDollarSign} boxSize={6} color="purple.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Price
                  </Text>
                  <Text>{formatCurrency(drug.price)}</Text>
                </Box>
              </Flex>

              <Flex align="center" bg="orange.50" p={4} borderRadius="md">
                <Icon as={FiShoppingBag} boxSize={6} color="orange.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Stock
                  </Text>
                  <Text>{formatValue(drug.stock)} units</Text>
                </Box>
              </Flex>

              <Flex
                align="center"
                bg={drug.prescription_needed ? "red.50" : "green.50"}
                p={4}
                borderRadius="md"
                gridColumn="span 2"
              >
                <Icon as={FiFileText} boxSize={6} color={drug.prescription_needed ? "red.500" : "green.500"} mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    Prescription Status
                  </Text>
                  <Text>{drug.prescription_needed ? "Prescription Required" : "No Prescription Required"}</Text>
                </Box>
              </Flex>
            </SimpleGrid>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}

function DrugDetailSkeleton() {
  return (
    <Box>
      <Flex mb={6} align="center" justify="space-between">
        <Flex align="center">
          <Skeleton height="40px" width="40px" mr={4} />
          <Skeleton height="30px" width="250px" />
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Skeleton height="24px" width="200px" />
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Flex key={i} justify="space-between">
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="20px" width="200px" />
                  </Flex>
                ))}
              <Skeleton height="100px" width="full" />
              <SimpleGrid columns={2} spacing={4} w="full">
                <Skeleton height="80px" />
                <Skeleton height="80px" />
              </SimpleGrid>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton height="24px" width="150px" />
          </CardHeader>
          <CardBody>
            <Skeleton height="300px" width="full" borderRadius="md" />
            <Skeleton height="80px" width="full" mt={6} />
            <SimpleGrid columns={2} spacing={4} mt={6}>
              <Skeleton height="80px" />
              <Skeleton height="80px" />
              <Skeleton height="80px" />
              <Skeleton height="80px" />
              <Skeleton height="80px" gridColumn="span 2" />
            </SimpleGrid>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
