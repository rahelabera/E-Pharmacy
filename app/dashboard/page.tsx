"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Progress,
  Badge,
  Image,
  Divider,
  Avatar,
  HStack,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react"
import {
  FiShoppingBag,
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

// Define types for our data
type DashboardStats = {
  totalUsers: number
  totalOrders: number
  pendingPrescriptions: number
  totalRevenue: number
  drugsCount: number
  pharmacistsCount: number
  patientsCount: number
  transactionsCount: number
  pendingPharmacists: number
}

type RecentOrder = {
  id: number
  user_name: string
  total_amount: string | number
  status: string
  created_at: string
}

type LowStockDrug = {
  id: number
  name: string
  stock: number
  category: string
}

type PharmacistData = {
  id: number
  name: string
  email: string
  pharmacy_name: string | null
  status: string
  created_at: string
  license_image: string | null
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingPrescriptions: 0,
    totalRevenue: 0,
    drugsCount: 0,
    pharmacistsCount: 0,
    patientsCount: 0,
    transactionsCount: 0,
    pendingPharmacists: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockDrugs, setLowStockDrugs] = useState<LowStockDrug[]>([])
  const [pendingPharmacists, setPendingPharmacists] = useState<PharmacistData[]>([])
  const [currentDate] = useState(new Date())
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({})

  // Helper function to handle null values
  const formatValue = (value: string | null | undefined): string => {
    return value ? value : "-"
  }

  // Helper to get greeting based on current hour
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Use Promise.allSettled to fetch data from multiple endpoints concurrently
        // This ensures that if one request fails, the others will still complete
        const [drugsRes, pharmacistsRes, patientsRes, ordersRes, prescriptionsRes] = await Promise.allSettled([
          api.get("/drugs"),
          api.get("/admin/pharmacists/all"),
          api.get("/admin/patients"),
          api.get("/admin/orders"),
          api.get("/admin/prescriptions"), // Assuming there's a prescriptions endpoint
        ])

        console.log("API responses:", {
          drugs: drugsRes.status === "fulfilled" ? drugsRes.value?.data : "Failed",
          pharmacists: pharmacistsRes.status === "fulfilled" ? pharmacistsRes.value?.data : "Failed",
          patients: patientsRes.status === "fulfilled" ? patientsRes.value?.data : "Failed",
          orders: ordersRes.status === "fulfilled" ? ordersRes.value?.data : "Failed",
          prescriptions: prescriptionsRes.status === "fulfilled" ? prescriptionsRes.value?.data : "Failed",
        })

        // Extract data from responses based on the actual API response structure
        // Handle both fulfilled and rejected promises

        // Process drugs data
        let drugs = []
        if (drugsRes.status === "fulfilled") {
          const drugsData = drugsRes.value.data
          drugs = drugsData.data || drugsData || []
        }

        // Process pharmacists data
        let pharmacists = []
        if (pharmacistsRes.status === "fulfilled") {
          const pharmacistsData = pharmacistsRes.value.data
          pharmacists = pharmacistsData.data?.data || pharmacistsData.data || pharmacistsData.pharmacists || []
        }
        // Process patients data
        let patients = []
        if (patientsRes.status === "fulfilled") {
          const patientsData = patientsRes.value.data
          patients = patientsData.data?.data || []
        }
        // Process orders data
        let orders = []
        if (ordersRes.status === "fulfilled") {
          const ordersData = ordersRes.value.data
          orders = ordersData.data || ordersData || []
        }

        // Process prescriptions data
        let prescriptions = []
        if (prescriptionsRes.status === "fulfilled") {
          const prescriptionsData = prescriptionsRes.value.data
          prescriptions = prescriptionsData.data || prescriptionsData || []
        }

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          return sum + (Number.parseFloat(order.total_amount) || 0)
        }, 0)

        // Find drugs with low stock (less than 20)
        const lowStock = drugs
          .filter((drug: any) => drug.stock < 20)
          .slice(0, 5)
          .map((drug: any) => ({
            id: drug.id,
            name: drug.name,
            stock: drug.stock,
            category: drug.category,
          }))

        // Get recent orders
        const recent = orders.slice(0, 5).map((order: any) => ({
          id: order.id,
          user_name: order.user_name || `User ${order.user_id}`,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
        }))

        // Count pending prescriptions
        const pendingPrescriptionsCount = prescriptions.filter(
          (prescription: any) => prescription.status === "pending",
        ).length

        // Get pending pharmacist applications
        const pendingPharmacistsList = pharmacists
          .filter((pharmacist: any) => pharmacist.status === "pending")
          .slice(0, 5)
          .map((pharmacist: any) => ({
            id: pharmacist.id,
            name: pharmacist.name,
            email: pharmacist.email,
            pharmacy_name: pharmacist.pharmacy_name,
            status: pharmacist.status,
            created_at: pharmacist.created_at,
            license_image: pharmacist.license_image,
          }))

        // Count pending pharmacists
        const pendingPharmacistsCount = pharmacists.filter((pharmacist: any) => pharmacist.status === "pending").length

        // Update stats
        setStats({
          totalUsers: patients.length + pharmacists.length,
          totalOrders: orders.length,
          pendingPrescriptions: pendingPrescriptionsCount,
          totalRevenue: totalRevenue,
          drugsCount: drugs.length,
          pharmacistsCount: pharmacists.length,
          patientsCount: patients.length,
          transactionsCount: orders.length, // Using orders as transactions
          pendingPharmacists: pendingPharmacistsCount,
        })

        setRecentOrders(recent)
        setLowStockDrugs(lowStock)
        setPendingPharmacists(pendingPharmacistsList)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  const handleApprovePharmacist = async (pharmacistId: number) => {
    setIsProcessing((prev) => ({ ...prev, [pharmacistId]: true }))
    try {
      // Use the provided API endpoint for approval
      const response = await api.patch(
        `https://e-pharmacybackend-production.up.railway.app/api/approve/${pharmacistId}`,
        {}, // Assuming no additional payload is required
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Approval response:", response.data)

      // Update the pharmacist in the list
      setPendingPharmacists((prev) => prev.filter((pharmacist) => pharmacist.id !== pharmacistId))

      // Update the stats
      setStats((prev) => ({
        ...prev,
        pendingPharmacists: prev.pendingPharmacists - 1,
      }))

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
    } finally {
      setIsProcessing((prev) => ({ ...prev, [pharmacistId]: false }))
    }
  }

  const handleRejectPharmacist = async (pharmacistId: number) => {
    setIsProcessing((prev) => ({ ...prev, [pharmacistId]: true }))
    try {
      // Use the provided API endpoint for rejection
      const response = await api.patch(
        `https://e-pharmacybackend-production.up.railway.app/api/reject/${pharmacistId}`,
        { notes: "Rejected from dashboard" }, // Include a default rejection reason
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Rejection response:", response.data)

      // Update the pharmacist in the list
      setPendingPharmacists((prev) => prev.filter((pharmacist) => pharmacist.id !== pharmacistId))

      // Update the stats
      setStats((prev) => ({
        ...prev,
        pendingPharmacists: prev.pendingPharmacists - 1,
      }))

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
    } finally {
      setIsProcessing((prev) => ({ ...prev, [pharmacistId]: false }))
    }
  }

  const viewPharmacistDetails = (pharmacistId: number) => {
    router.push(`/dashboard/pharmacists/${pharmacistId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format date for header
  const formatHeaderDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time for header
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
        return "green"
      case "pending":
        return "yellow"
      case "failed":
      case "rejected":
        return "red"
      default:
        return "gray"
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <Box>
      {/* Top section with greeting and profile */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6} mb={6}>
        {/* Greeting card */}
        <Card bg="blue.500" color="white" position="relative" overflow="hidden">
          <CardBody p={6}>
            <Flex direction="column" justify="space-between" h="full">
              <Text fontSize="sm" mb={1}>
                {formatHeaderDate(currentDate)} · {formatTime(currentDate)}
              </Text>

              <Box my={4}>
                <Heading size="lg" mb={1}>
                  {getGreeting()}, {formatValue(user?.name)}!
                </Heading>
                <Text>Welcome to E-Market Pharmacy Admin Dashboard</Text>
              </Box>
            </Flex>

            {/* Decorative elements */}
            <Box position="absolute" right="5%" top="20%" opacity={0.9}>
              <Image src="/pharmacist.png" alt="Pharmacist illustration" height="120px" />
            </Box>
            <Box position="absolute" right="30%" top="10%" opacity={0.3}>
              <Icon as={FiFileText} boxSize={8} />
            </Box>
            <Box position="absolute" right="20%" bottom="20%" opacity={0.3}>
              <Icon as={FiDollarSign} boxSize={6} />
            </Box>
            <Box position="absolute" right="40%" top="60%" opacity={0.3}>
              <Icon as={FiShoppingBag} boxSize={10} />
            </Box>
          </CardBody>
        </Card>

        {/* Profile card */}
        <Card>
          <CardBody p={4}>
            <VStack spacing={4} align="center">
              <Heading size="md" color="blue.500">
                MY PROFILE
              </Heading>

              <Avatar size="xl" name={user?.name} />

              <VStack spacing={1}>
                <Heading size="md">{formatValue(user?.name)}</Heading>
                <Text color="gray.500" fontSize="sm">
                  E-MARKET PHARMACY ADMIN
                </Text>
                <HStack>
                  <Icon as={FiMapPin} color="blue.500" />
                  <Text fontSize="sm">Addis Ababa, Ethiopia</Text>
                </HStack>
              </VStack>

              <Divider />
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Analytics section */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
        {/* Total Patients */}
        <Card
          as="button"
          onClick={() => router.push("/dashboard/patients")}
          _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <CardBody p={4}>
            <Flex align="center" mb={3}>
              <Box bg="blue.50" p={2} borderRadius="md" mr={3}>
                <Icon as={FiUsers} color="blue.500" boxSize={5} />
              </Box>
              <Text fontWeight="bold">Total Patients</Text>
            </Flex>
            <Heading size="2xl" mb={2}>
              {stats.patientsCount}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Registered patients
            </Text>
          </CardBody>
        </Card>

        {/* Pharmacists */}
        <Card
          as="button"
          onClick={() => router.push("/dashboard/pharmacists")}
          _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <CardBody p={4}>
            <Flex align="center" mb={3}>
              <Box bg="green.50" p={2} borderRadius="md" mr={3}>
                <Icon as={FiUserCheck} color="green.500" boxSize={5} />
              </Box>
              <Text fontWeight="bold">Pharmacists</Text>
            </Flex>
            <Heading size="2xl" mb={2}>
              {stats.pharmacistsCount}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {stats.pharmacistsCount - stats.pendingPharmacists} approved, {stats.pendingPharmacists} pending
            </Text>
          </CardBody>
        </Card>

        {/* Pending Approvals */}
        <Card
          as="button"
          onClick={() => router.push("/dashboard/pharmacists/pending")}
          _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <CardBody p={4}>
            <Flex align="center" mb={3}>
              <Box bg="yellow.50" p={2} borderRadius="md" mr={3}>
                <Icon as={FiUserX} color="yellow.500" boxSize={5} />
              </Box>
              <Text fontWeight="bold">Pending Approvals</Text>
            </Flex>
            <Heading size="2xl" mb={2}>
              {stats.pendingPharmacists}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Pharmacists awaiting verification
            </Text>
          </CardBody>
        </Card>

        {/* Drugs */}
        <Card
          as="button"
          onClick={() => router.push("/dashboard/drugs")}
          _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <CardBody p={4}>
            <Flex align="center" mb={3}>
              <Box bg="purple.50" p={2} borderRadius="md" mr={3}>
                <Icon as={FiFileText} color="purple.500" boxSize={5} />
              </Box>
              <Text fontWeight="bold">Medications</Text>
            </Flex>
            <Heading size="2xl" mb={2}>
              {stats.drugsCount}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {lowStockDrugs.length} items low in stock
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Pending Pharmacist Approvals */}
      <Card mb={6}>
        <CardHeader pb={2}>
          <Heading size="md">Pending Pharmacist Approvals</Heading>
        </CardHeader>
        <CardBody>
          {pendingPharmacists.length === 0 ? (
            <Text textAlign="center" py={4} color="gray.500">
              No pending pharmacist approvals
            </Text>
          ) : (
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Pharmacy</Th>
                  <Th>Date Applied</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingPharmacists.map((pharmacist) => (
                  <Tr key={pharmacist.id}>
                    <Td fontWeight="medium">{formatValue(pharmacist.name)}</Td>
                    <Td>{formatValue(pharmacist.email)}</Td>
                    <Td>{formatValue(pharmacist.pharmacy_name)}</Td>
                    <Td>{formatDate(pharmacist.created_at)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          leftIcon={<FiEye />}
                          size="sm"
                          variant="outline"
                          onClick={() => viewPharmacistDetails(pharmacist.id)}
                        >
                          View
                        </Button>
                        <Button
                          leftIcon={<FiCheckCircle />}
                          size="sm"
                          colorScheme="green"
                          isLoading={isProcessing[pharmacist.id]}
                          onClick={() => handleApprovePharmacist(pharmacist.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          leftIcon={<FiXCircle />}
                          size="sm"
                          colorScheme="red"
                          isLoading={isProcessing[pharmacist.id]}
                          onClick={() => handleRejectPharmacist(pharmacist.id)}
                        >
                          Reject
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          {pendingPharmacists.length > 0 && (
            <Flex justify="flex-end" mt={4}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={() => router.push("/dashboard/pharmacists?tab=pending")}
              >
                View All Pending Approvals
              </Button>
            </Flex>
          )}
        </CardBody>
      </Card>

      {/* Bottom section with inventory and orders */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Low Stock Items */}
        <Card>
          <CardHeader pb={2}>
            <Heading size="md">Low Stock Items</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {lowStockDrugs.length === 0 ? (
                <Text textAlign="center" py={4} color="gray.500">
                  No low stock items
                </Text>
              ) : (
                lowStockDrugs.map((drug) => (
                  <Box key={drug.id}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        {drug.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {drug.stock} in stock
                      </Text>
                    </Flex>
                    <Progress
                      value={(drug.stock / 100) * 100}
                      size="sm"
                      colorScheme={drug.stock < 10 ? "red" : drug.stock < 30 ? "yellow" : "green"}
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Category: {drug.category}
                    </Text>
                  </Box>
                ))
              )}
            </VStack>

            {lowStockDrugs.length > 0 && (
              <Flex justify="flex-end" mt={4}>
                <Button size="sm" variant="outline" colorScheme="blue" onClick={() => router.push("/dashboard/drugs")}>
                  View All Inventory
                </Button>
              </Flex>
            )}
          </CardBody>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader pb={2}>
            <Heading size="md">Recent Orders</Heading>
          </CardHeader>
          <CardBody>
            {recentOrders.length === 0 ? (
              <Text textAlign="center" py={4} color="gray.500">
                No recent orders
              </Text>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Customer</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentOrders.map((order) => (
                    <Tr key={order.id}>
                      <Td>#{order.id}</Td>
                      <Td>{formatValue(order.user_name)}</Td>
                      <Td>{formatCurrency(Number(order.total_amount))}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            {recentOrders.length > 0 && (
              <Flex justify="flex-end" mt={4}>
                <Button size="sm" variant="outline" colorScheme="blue" onClick={() => router.push("/dashboard/orders")}>
                  View All Orders
                </Button>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
}

function DashboardSkeleton() {
  return (
    <Box>
      <Skeleton height="40px" width="200px" mb={6} />

      {/* Top section skeleton */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6} mb={6}>
        <Skeleton height="200px" borderRadius="lg" />
        <Skeleton height="200px" borderRadius="lg" />
      </Grid>

      {/* Analytics section skeleton */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="120px" borderRadius="lg" />
        ))}
      </SimpleGrid>

      {/* Pending approvals skeleton */}
      <Skeleton height="300px" borderRadius="lg" mb={6} />

      {/* Bottom section skeleton */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {[1, 2].map((i) => (
          <Skeleton key={i} height="300px" borderRadius="lg" />
        ))}
      </Grid>
    </Box>
  )
}