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
  Skeleton,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Avatar,
  HStack,
  Badge,
  Select,
  Button,
  IconButton,
  InputRightElement,
} from "@chakra-ui/react"
import { Search, MapPin, ChevronLeft, ChevronRight, Eye, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

type Patient = {
  id: number
  name: string
  username: string
  email: string
  is_role: number
  phone: string | null
  address: string | null
  lat: number | null
  lng: number | null
  status: string
  status_reason: string | null
  status_updated_at: string | null
  pharmacy_name: string | null
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  license_image: string | null
  tin_image: string | null
}

type PatientsResponse = {
  status: string
  message: string
  data: {
    current_page: number
    data: Patient[]
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
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
    active_count: number
    inactive_count: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export default function PatientsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    // Fetch patients from the API with server-side filtering and pagination
    const fetchPatients = async () => {
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
        // if (statusFilter !== "all") {
        //   params.append("filter", statusFilter)
        // }

        const response = await api.get<PatientsResponse>(`/admin/patients?${params.toString()}`)

        if (response.data.status === "success") {
          const patientsData = response.data.data.data || []
          setPatients(patientsData)
          setPagination({
            currentPage: response.data.meta.current_page,
            totalPages: response.data.meta.last_page,
            totalItems: response.data.meta.total,
            from: response.data.meta.from,
            to: response.data.meta.to,
          })
        } else {
          throw new Error("Failed to fetch users")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error fetching users",
          description: "Failed to load user data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [token, toast, currentPage, rowsPerPage, searchTerm /*, statusFilter*/])

  // Reset page to 1 when search term or rows per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, rowsPerPage /*, statusFilter*/])

  // Helper function to handle null values
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "-"
    }
    return String(value)
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

  const viewPatientDetails = (patientId: number) => {
    router.push(`/dashboard/patients/${patientId}`)
  }

  if (isLoading) {
    return <PatientsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="md" mb={1}>
            Users
          </Heading>
          <Text color="gray.600">User accounts and information</Text>
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
              {/* Uncomment to enable status filter
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w={{ base: "full", sm: "auto" }}
                maxW="200px"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
              */}
            </Flex>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Profile</Th>
                    <Th>Name</Th>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    <Th>Address</Th>
                    <Th>Registered</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patients.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={6} color="gray.500">
                        No users found
                      </Td>
                    </Tr>
                  ) : (
                    patients.map((patient) => (
                      <Tr key={patient.id}>
                        <Td>
                          <Avatar
                            size="sm"
                            name={patient.name}
                            src={patient.license_image || undefined}
                            bg="blue.100"
                            color="blue.600"
                          />
                        </Td>
                        <Td>
                          <Text fontWeight="medium">{formatValue(patient.name)}</Text>
                        </Td>
                        <Td>
                          <Text color="gray.600">@{patient.username}</Text>
                        </Td>
                        <Td>{patient.email}</Td>
                        <Td>{patient.address || "-"}</Td>
                        <Td>{formatDate(patient.created_at)}</Td>
                        <Td>
                          <Text
                            color="blue.500"
                            fontWeight="medium"
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            onClick={() => viewPatientDetails(patient.id)}
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

            {/* Pagination controls */}
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
                  Showing {pagination.from} to {pagination.to} of {pagination.totalItems} patients
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

function PatientsSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="32px" width="150px" mb={1} />
        <Skeleton height="18px" width="300px" />
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
            <Skeleton height="40px" width={{ base: "full", sm: "200px" }} />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Profile</Th>
                  <Th>Name</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Address</Th>
                  <Th>Registered</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Tr key={i}>
                      <Td>
                        <Skeleton height="32px" width="32px" borderRadius="full" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="120px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="100px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
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