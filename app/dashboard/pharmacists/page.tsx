"use client"

import type React from "react"
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
  InputRightElement,
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
  Button,
  HStack,
  IconButton,
} from "@chakra-ui/react"
import { Search, MapPin, ChevronLeft, ChevronRight, Eye, Check } from "lucide-react"
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
    pending_count?: number // Optional: if server provides this
  }
}

export default function PharmacistsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowsPerPageInput, setRowsPerPageInput] = useState(rowsPerPage.toString())
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  })
  const [pendingCount, setPendingCount] = useState(0)

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
      localStorage.removeItem("pharmacistsTab")
    }
  }, [])

  useEffect(() => {
    // Fetch pharmacists from the API with server-side filtering and pagination
    const fetchPharmacists = async () => {
      setIsLoading(true)
      try {
        // Construct query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          per_page: rowsPerPage.toString(),
        })
        if (searchTerm) {
          params.append("search", searchTerm)
        }
        if (activeTab !== "all") {
          params.append("filter", activeTab)
        }

        const response = await api.get<PharmacistsResponse>(`/admin/pharmacists/all?page=1?page=1&per_page=10?${params.toString()}`)

        if (response.data.status === "success" && response.data.data) {
          const pharmacistsData = response.data.data.data || []
          setPharmacists(pharmacistsData)
          setPagination({
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalItems: response.data.data.total,
            from: response.data.data.from,
            to: response.data.data.to,
          })
          // Set pending count (preferably from server, fallback to client-side)
          setPendingCount(response.data.data.pending_count ?? pharmacistsData.filter((p) => p.status === "pending").length)
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
        setPharmacists([])
        setPendingCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPharmacists()
  }, [token, toast, currentPage, rowsPerPage, searchTerm, activeTab])

  // Reset page to 1 when search term, active tab, or rows per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab, rowsPerPage])

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

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return <PharmacistsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="md" mb={1}>
            Pharmacies
            {activeTab !== "all" && ` (${activeTab})`}
          </Heading>
          <Text color="gray.600">
            Manage pharmacy accounts and license verification
            {activeTab === "pending" && pendingCount > 0 && ` • ${pendingCount} pending approval${pendingCount !== 1 ? "s" : ""}`}
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
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pharmacists.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={6} color="gray.500">
                        No pharmacists found
                        {activeTab !== "all" && ` with status "${activeTab}"`}
                      </Td>
                    </Tr>
                  ) : (
                    pharmacists.map((pharmacist) => (
                      <Tr key={pharmacist.id}>
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
                        <Td>
                          <Text
                            color="blue.500"
                            fontWeight="medium"
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            onClick={() => viewPharmacistDetails(pharmacist)}
                            _hover={{ textDecoration: "underline" }}
                          >
                            <Eye size={16} style={{ marginRight: "6px" }} />
                            View
                          </Text>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>

            {pagination.totalItems > 0 && (
              <Flex justify="space-between" align="center" mt={4} wrap="wrap" gap={4}>
                <HStack>
                  <Text fontSize="sm" whiteSpace="nowrap">
                    Rows per page:
                  </Text>
                  <InputGroup size="sm" width="80px">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={rowsPerPageInput}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || (Number(value) > 0 && Number(value) <= 100)) {
                          setRowsPerPageInput(value)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const value = Number(rowsPerPageInput)
                          if (value > 0 && value <= 100) {
                            setRowsPerPage(value)
                          }
                        }
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Apply rows per page"
                        icon={<Check size={16} />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => {
                          const value = Number(rowsPerPageInput)
                          if (value > 0 && value <= 100) {
                            setRowsPerPage(value)
                          }
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </HStack>

                <Text fontSize="sm">
                  Showing {pagination.from} to {pagination.to} of {pagination.totalItems} pharmacists
                  {activeTab !== "all" && ` with status "${activeTab}"`}
                </Text>

                <HStack>
                  <Button
                    size="sm"
                    leftIcon={<ChevronLeft size={16} />}
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Text fontSize="sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </Text>
                  <Button
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </HStack>
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
                  {["Pharmacist", "Pharmacy", "Location", "Bank Info", "Date Applied", "Status", "Actions"].map(
                    (header) => (
                      <Th key={header}>
                        <Skeleton height="14px" width="80%" />
                      </Th>
                    ),
                  )}
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
                      <Td>
                        <Skeleton height="16px" width="60px" />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
          <Flex justify="space-between" align="center" mt={4}>
            <Skeleton height="32px" width="150px" />
            <Skeleton height="16px" width="200px" />
            <Flex gap={2}>
              <Skeleton height="32px" width="80px" />
              <Skeleton height="16px" width="80px" />
              <Skeleton height="32px" width="80px" />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Stack>
  )
}