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
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
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
  tin_number: string | null
  account_number: string | null
  bank_name: string | null
  license_public_id: string | null
  tin_public_id: string | null
  google_id: string | null
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
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  })

  useEffect(() => {
    // Fetch patients from the API
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<PatientsResponse>(`/admin/patients?page=${currentPage}`)

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
          throw new Error("Failed to fetch patients")
        }
      } catch (error) {
        console.error("Error fetching patients:", error)
        toast({
          title: "Error fetching patients",
          description: "Failed to load patient data. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [token, toast, currentPage])

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
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter)
    }

    setFilteredPatients(filtered)
  }, [searchTerm, statusFilter, patients])

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "green"
      case "pending":
        return "yellow"
      case "inactive":
      case "rejected":
        return "red"
      default:
        return "gray"
    }
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
    return <PatientsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Patients
          </Heading>
          <Text color="gray.600">Manage patient accounts and information</Text>
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
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
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
            </Flex>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Patient</Th>
                    <Th>Contact</Th>
                    <Th>Location</Th>
                    <Th>Status</Th>
                    <Th>Registered</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPatients.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                        No patients found
                      </Td>
                    </Tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <Tr key={patient.id}>
                        <Td>
                          <Flex align="center" gap={3}>
                            <Avatar size="sm" name={patient.name} bg="blue.100" color="blue.600" />
                            <Box>
                              <Text fontWeight="medium">{formatValue(patient.name)}</Text>
                              <Text fontSize="sm" color="gray.500">
                                ID: {patient.id}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontSize="sm">{formatValue(patient.email)}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatValue(patient.phone)}
                            </Text>
                          </Box>
                        </Td>
                        <Td>
                          {patient.address ? (
                            <Flex align="center" gap={1}>
                              <MapPin size={14} />
                              <Text fontSize="sm">{patient.address}</Text>
                            </Flex>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(patient.status)}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td>{formatDate(patient.created_at)}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination controls */}
            {pagination.totalItems > 0 && (
              <Flex justify="space-between" align="center" mt={4}>
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
                  {["Patient", "Contact", "Location", "Status", "Registered"].map((header) => (
                    <Th key={header}>
                      <Skeleton height="14px" width="80%" />
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Tr key={i}>
                      <Td>
                        <Flex align="center" gap={3}>
                          <Skeleton height="32px" width="32px" borderRadius="full" />
                          <Box>
                            <Skeleton height="16px" width="120px" mb={1} />
                            <Skeleton height="14px" width="80px" />
                          </Box>
                        </Flex>
                      </Td>
                      <Td>
                        <Box>
                          <Skeleton height="14px" width="150px" mb={1} />
                          <Skeleton height="14px" width="100px" />
                        </Box>
                      </Td>
                      <Td>
                        <Flex align="center" gap={1}>
                          <Skeleton height="14px" width="14px" />
                          <Skeleton height="14px" width="120px" />
                        </Flex>
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="70px" borderRadius="full" />
                      </Td>
                      <Td>
                        <Skeleton height="14px" width="80px" />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
          <Flex justify="space-between" align="center" mt={4}>
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
