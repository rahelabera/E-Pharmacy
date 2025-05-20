"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  useToast,
  Avatar,
} from "@chakra-ui/react"
import { Search, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

type Pharmacist = {
  id: number
  name: string
  username: string
  email: string
  is_role: number
  profile_image: string | null
  cloudinary_public_id: string | null
  phone: string | null
  address: string | null
  lat: number | null
  lng: number | null
  status: "pending" | "approved" | "rejected"
  status_reason: string | null
  status_updated_at: string | null
  pharmacy_name: string | null
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  license_image: string | null
  tin_image: string | null
  tin_number: string | null
  account_number: string | null
  bank_name: string | null
  license_public_id: string | null
  tin_public_id: string | null
  google_id: string | null
}

type PharmacistsResponse = {
  status: string
  data: {
    current_page: number
    data: Pharmacist[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
      url: string | null
      label: string
      active: boolean
    }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
}

export default function PharmacistsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([])
  const [filteredPharmacists, setFilteredPharmacists] = useState<Pharmacist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [tabIndex, setTabIndex] = useState(0)
  const router = useRouter()
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })

  useEffect(() => {
    // Check if there's a selected tab in localStorage
    const savedTab = localStorage.getItem("pharmacistsTab")
    if (savedTab) {
      const tabValues = ["all", "pending", "approved", "rejected"]
      const index = tabValues.indexOf(savedTab)
      if (index !== -1) {
        setActiveTab(savedTab)
        setTabIndex(index)
      }
      // Clear the localStorage value after using it
      localStorage.removeItem("pharmacistsTab")
    }
  }, [])

  useEffect(() => {
    // Fetch pharmacists from the API
    const fetchPharmacists = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<PharmacistsResponse>("/admin/pharmacists/all")

        console.log("Pharmacists API response:", response.data) // For debugging

        if (response.data.status === "success" && response.data.data) {
          const pharmacistsData = response.data.data.data || []
          setPharmacists(pharmacistsData)
          setFilteredPharmacists(pharmacistsData)

          // Set pagination data
          setPagination({
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalItems: response.data.data.total,
          })
        } else {
          throw new Error("Failed to fetch pharmacists")
        }
      } catch (error) {
        console.error("Error fetching pharmacists:", error)
        toast({
          title: "Error fetching pharmacists",
          description: "Failed to load pharmacist data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        // Initialize with empty arrays to prevent undefined errors
        setPharmacists([])
        setFilteredPharmacists([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPharmacists()
  }, [token, toast])

  useEffect(() => {
    // Filter pharmacists based on search term and active tab
    let filtered = pharmacists

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pharmacist) =>
          (pharmacist.name && pharmacist.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pharmacist.email && pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pharmacist.pharmacy_name && pharmacist.pharmacy_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pharmacist.address && pharmacist.address.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((pharmacist) => pharmacist.status === activeTab)
    }

    setFilteredPharmacists(filtered)
  }, [searchTerm, activeTab, pharmacists])

  // Helper function to handle null values
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "-"
    }
    return String(value)
  }

  const viewPharmacistDetails = (pharmacist: Pharmacist) => {
    router.push(`/dashboard/pharmacists/${pharmacist.id}`)
  }

  const getStatusBadgeColor = (status: Pharmacist["status"]) => {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleTabChange = (index: number) => {
    const tabValues = ["all", "pending", "approved", "rejected"]
    setActiveTab(tabValues[index])
    setTabIndex(index)
  }

  if (isLoading) {
    return <PharmacistsSkeleton />
  }

  // Count pending pharmacists
  const pendingCount = pharmacists.filter((p) => p.status === "pending").length

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Pharmacists
            {activeTab !== "all" && ` (${activeTab})`}
          </Heading>
          <Text color="gray.600">
            Manage pharmacist accounts and license verification
            {activeTab === "pending" &&
              pendingCount > 0 &&
              ` • ${pendingCount} pending approval${pendingCount !== 1 ? "s" : ""}`}
          </Text>
        </Box>

        <Card>
          <CardHeader pb={3}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ sm: "center" }}
              justify={{ sm: "space-between" }}
              gap={4}
            >
              <Box position="relative" w={{ base: "full", sm: "72" }}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search size={16} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="search"
                    placeholder="Search pharmacists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
              <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                w={{ base: "full", sm: "auto" }}
                index={tabIndex}
                onChange={handleTabChange}
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>
                    Pending
                    {pendingCount > 0 && (
                      <Badge ml={2} colorScheme="red" borderRadius="full">
                        {pendingCount}
                      </Badge>
                    )}
                  </Tab>
                  <Tab>Approved</Tab>
                  <Tab>Rejected</Tab>
                </TabList>
              </Tabs>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Pharmacist</Th>
                    <Th>Pharmacy</Th>
                    <Th>Location</Th>
                    <Th>Bank Info</Th>
                    <Th>Date Applied</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPharmacists.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={6} color="gray.500">
                        No pharmacists found
                        {activeTab !== "all" && ` with status "${activeTab}"`}
                      </Td>
                    </Tr>
                  ) : (
                    filteredPharmacists.map((pharmacist) => (
                      <Tr
                        key={pharmacist.id}
                        onClick={() => viewPharmacistDetails(pharmacist)}
                        cursor="pointer"
                        _hover={{ bg: "gray.50" }}
                      >
                        <Td>
                          <Flex align="center" gap={3}>
                            <Avatar size="sm" name={pharmacist.name} src={pharmacist.profile_image || undefined} />
                            <Box>
                              <Text fontWeight="medium">{formatValue(pharmacist.name)}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {formatValue(pharmacist.email)}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>{formatValue(pharmacist.pharmacy_name)}</Td>
                        <Td>
                          {pharmacist.address ? (
                            <Flex align="center" gap={1}>
                              <MapPin size={14} />
                              <Text fontSize="sm">{pharmacist.address}</Text>
                            </Flex>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          <Box>
                            <Text fontSize="sm">{formatValue(pharmacist.bank_name)}</Text>
                            <Text fontSize="xs" color="gray.500">
                              Acc: {formatValue(pharmacist.account_number)}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{formatDate(pharmacist.created_at)}</Td>
                        <Td>
                          <Badge colorScheme={getStatusBadgeColor(pharmacist.status)}>
                            {pharmacist.status.charAt(0).toUpperCase() + pharmacist.status.slice(1)}
                          </Badge>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination info */}
            {pagination.totalItems > 0 && (
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm">
                  Showing {filteredPharmacists.length} of {pagination.totalItems} pharmacists
                  {activeTab !== "all" && ` with status "${activeTab}"`}
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Stack>
    </Box>
  )
}

function PharmacistsSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="32px" width="150px" mb={1} />
        <Skeleton height="18px" width="350px" />
      </Box>

      <Card>
        <CardHeader pb={3}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ sm: "center" }}
            justify={{ sm: "space-between" }}
            gap={4}
          >
            <Skeleton height="40px" width={{ base: "full", sm: "250px" }} />
            <Skeleton height="40px" width={{ base: "full", sm: "300px" }} />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {["Pharmacist", "Pharmacy", "Location", "Bank Info", "Date Applied", "Status"].map((header) => (
                    <Th key={header}>
                      <Skeleton height="14px" width="80%" />
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Tr key={i}>
                      <Td>
                        <Flex align="center" gap={3}>
                          <Skeleton height="32px" width="32px" borderRadius="full" />
                          <Box>
                            <Skeleton height="16px" width="120px" mb={1} />
                            <Skeleton height="14px" width="150px" />
                          </Box>
                        </Flex>
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="100px" />
                      </Td>
                      <Td>
                        <Flex align="center" gap={1}>
                          <Skeleton height="14px" width="14px" />
                          <Skeleton height="14px" width="120px" />
                        </Flex>
                      </Td>
                      <Td>
                        <Box>
                          <Skeleton height="14px" width="100px" mb={1} />
                          <Skeleton height="12px" width="80px" />
                        </Box>
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="70px" borderRadius="full" />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Stack>
  )
}
