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
} from "@chakra-ui/react"
// Import the Check icon
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
  // tin_number: string | null
  // account_number: string | null
  // bank_name: string | null
  // license_public_id: string | null
  // tin_public_id: string | null
  // google_id: string | null
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
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  })

  // Add a new state to track the input value
  const [rowsPerPageInput, setRowsPerPageInput] = useState(rowsPerPage.toString())

  useEffect(() => {
    // Fetch patients from the API
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<PatientsResponse>(`/admin/patients?page=${currentPage}&per_page=${rowsPerPage}`)

        if (response.data.status === "success") {
          const patientsData = response.data.data.data || []
          setPatients(patientsData)
          setFilteredPatients(patientsData)

          // Set pagination data
          setPagination({
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalItems: response.data.data.total,
            from: response.data.data.from,
            to: response.data.data.to,
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
  }, [token, toast, currentPage, rowsPerPage])

  useEffect(() => {
    // Filter patients based on search term and status
    let filtered = patients

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          (patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.phone && patient.phone.includes(searchTerm)) ||
          (patient.address && patient.address.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply status filter
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter((patient) => patient.status === statusFilter)
    // }

    setFilteredPatients(filtered)
  }, [searchTerm, patients])

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

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "active":
  //     case "approved":
  //       return "green"
  //     case "pending":
  //       return "yellow"
  //     case "inactive":
  //     case "rejected":
  //       return "red"
  //     default:
  //       return "gray"
  //   }
  // }

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

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing rows per page
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
              {/* <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w={{ base: "full", sm: "auto" }}
                maxW="200px"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select> */}
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
                  {filteredPatients.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={6} color="gray.500">
                        No users found
                      </Td>
                    </Tr>
                  ) : (
                    filteredPatients.map((patient) => (
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
                {/* Replace the rows per page input and button with this updated version */}
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
                      pr="2.5rem" // add padding for the button
                    />
                    <Box
                      position="absolute"
                      right="0.5rem"
                      top="50%"
                      transform="translateY(-50%)"
                      as="button"
                      onClick={() => {
                        const value = Number(rowsPerPageInput)
                        if (value > 0 && value <= 100) {
                          setRowsPerPage(value)
                          setCurrentPage(1) // Reset to first page when changing rows per page
                        }
                      }}
                      cursor="pointer"
                      p={1}
                      borderRadius="sm"
                      _hover={{ bg: "blue.50" }}
                      color="blue.500"
                      bg="transparent"
                      zIndex={1}
                    >
                      <Check size={16} />
                    </Box>
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
                        <Skeleton height="32px" width="60px" />
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
