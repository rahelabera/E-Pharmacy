"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
} from "@chakra-ui/react"
import { Search, Eye, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type Patient = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function PatientsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch patients from the API
    const fetchPatients = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("https://e-pharmacybackend-production.up.railway.app/api/admin/patients")

        if (response.data.status === "success") {
          const patientsData = response.data.patients || []
          setPatients(patientsData)
          setFilteredPatients(patientsData)
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
  }, [token, toast])

  useEffect(() => {
    // Filter patients based on search term and status
    let filtered = patients

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleContactPatient = (method: "email" | "phone", contact: string) => {
    if (method === "email") {
      window.location.href = `mailto:${contact}`
    } else if (method === "phone") {
      window.location.href = `tel:${contact}`
    }
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
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPatients.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={6} color="gray.500">
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
                              <Text fontWeight="medium">{patient.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                ID: {patient.id}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontSize="sm">{patient.email}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {patient.phone || "No phone"}
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
                            "No address"
                          )}
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(patient.status)}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td>{formatDate(patient.created_at)}</Td>
                        <Td isNumeric>
                          <HStack spacing={1} justify="flex-end">
                            {patient.email && (
                              <IconButton
                                aria-label="Email patient"
                                icon={<Mail size={16} />}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleContactPatient("email", patient.email)}
                              />
                            )}
                            {patient.phone && (
                              <IconButton
                                aria-label="Call patient"
                                icon={<Phone size={16} />}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleContactPatient("phone", patient.phone || "")}
                              />
                            )}
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<MoreHorizontal size={16} />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem icon={<Eye size={16} />}>View Patient Details</MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
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
                  {["Patient", "Contact", "Location", "Status", "Registered", "Actions"].map((header) => (
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
                      <Td isNumeric>
                        <Flex justify="flex-end">
                          <Skeleton height="24px" width="80px" />
                        </Flex>
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
