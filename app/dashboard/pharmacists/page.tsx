"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
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
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  Textarea,
  Badge,
  useToast,
  useDisclosure,
  Image,
  Center,
  HStack,
} from "@chakra-ui/react"
import { Search, CheckCircle, XCircle, Eye, MoreHorizontal, FileText, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import type { AxiosError } from "axios"

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

export default function PharmacistsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([])
  const [filteredPharmacists, setFilteredPharmacists] = useState<Pharmacist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null)
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isLicenseOpen, onOpen: onLicenseOpen, onClose: onLicenseClose } = useDisclosure()
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    // Fetch pharmacists from the API
    const fetchPharmacists = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("/admin/pharmacists/all")

        console.log("Pharmacists API response:", response.data) // For debugging

        // Initialize with an empty array to prevent undefined errors
        let pharmacistsData: Pharmacist[] = []

        // Check different possible response structures
        if (response.data.data?.data) {
          // If the response has data.data structure
          pharmacistsData = response.data.data.data
        } else if (response.data.data) {
          // If the response has just data structure
          pharmacistsData = response.data.data
        } else if (response.data.pharmacists) {
          // If the response has pharmacists structure
          pharmacistsData = response.data.pharmacists
        }

        // Ensure we have an array even if the API returns unexpected format
        if (!Array.isArray(pharmacistsData)) {
          console.error("Unexpected API response format:", response.data)
          pharmacistsData = []
        }

        setPharmacists(pharmacistsData)
        setFilteredPharmacists(pharmacistsData)
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
          pharmacist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pharmacist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const viewPharmacistDetails = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist)
    setRejectReason("")
    onViewOpen()
  }

  const viewLicenseImage = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist)
    onLicenseOpen()
  }

  const handleApprovePharmacist = async (pharmacistId: number) => {
    try {
      // Try multiple possible API endpoint formats
      let response
      let success = false

      // Array of possible API endpoints to try
      const endpoints = [
        `/admin/pharmacists/${pharmacistId}/approve`,
        `/pharmacists/${pharmacistId}/approve`,
        `/admin/pharmacist/${pharmacistId}/approve`,
        `/pharmacist/${pharmacistId}/approve`,
      ]

      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to approve with endpoint: ${endpoint}`)
          response = await api.post(endpoint)
          console.log(`Approval success with endpoint ${endpoint}:`, response)
          success = true
          break // Exit the loop if successful
        } catch (endpointError) {
          console.error(`Approval attempt failed with endpoint ${endpoint}:`, endpointError)
          // Continue to the next endpoint
        }
      }

      if (!success) {
        throw new Error("All approval endpoint attempts failed")
      }

      // Update the pharmacists list
      const updatedPharmacists = pharmacists.map((pharmacist) =>
        pharmacist.id === pharmacistId
          ? {
              ...pharmacist,
              status: "approved" as const,
              updated_at: new Date().toISOString(),
            }
          : pharmacist,
      )

      setPharmacists(updatedPharmacists)

      // Force refresh the filtered list
      const newFiltered = updatedPharmacists.filter((p) => activeTab === "all" || p.status === activeTab)
      setFilteredPharmacists(newFiltered)

      onViewClose()
      onLicenseClose()

      toast({
        title: "Pharmacist approved",
        description: "The pharmacist has been approved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: unknown) {
      console.error("Error approving pharmacist (detailed):", error)

      // Type guard to check if error is an AxiosError
      if (error instanceof Error) {
        const axiosError = error as AxiosError
        if (axiosError.response) {
          console.error("Error response data:", axiosError.response.data)
          console.error("Error response status:", axiosError.response.status)
        }
      }

      toast({
        title: "Error",
        description: "Failed to approve pharmacist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleRejectPharmacist = async (pharmacistId: number) => {
    try {
      // Try multiple possible API endpoint formats
      let response
      let success = false

      // Array of possible API endpoints to try
      const endpoints = [
        `/admin/pharmacists/${pharmacistId}/reject`,
        `/pharmacists/${pharmacistId}/reject`,
        `/admin/pharmacist/${pharmacistId}/reject`,
        `/pharmacist/${pharmacistId}/reject`,
      ]

      const payload = { notes: rejectReason }

      // Try each endpoint until one succeeds
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to reject with endpoint: ${endpoint}`, payload)
          response = await api.post(endpoint, payload)
          console.log(`Rejection success with endpoint ${endpoint}:`, response)
          success = true
          break // Exit the loop if successful
        } catch (endpointError) {
          console.error(`Rejection attempt failed with endpoint ${endpoint}:`, endpointError)
          // Continue to the next endpoint
        }
      }

      if (!success) {
        throw new Error("All rejection endpoint attempts failed")
      }

      // Update the pharmacists list
      const updatedPharmacists = pharmacists.map((pharmacist) =>
        pharmacist.id === pharmacistId
          ? {
              ...pharmacist,
              status: "rejected" as const,
              updated_at: new Date().toISOString(),
            }
          : pharmacist,
      )

      setPharmacists(updatedPharmacists)

      // Force refresh the filtered list
      const newFiltered = updatedPharmacists.filter((p) => activeTab === "all" || p.status === activeTab)
      setFilteredPharmacists(newFiltered)

      onViewClose()

      toast({
        title: "Pharmacist rejected",
        description: "The pharmacist has been rejected.",
        status: "info",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: unknown) {
      console.error("Error rejecting pharmacist (detailed):", error)

      // Type guard to check if error is an AxiosError
      if (error instanceof Error) {
        const axiosError = error as AxiosError
        if (axiosError.response) {
          console.error("Error response data:", axiosError.response.data)
          console.error("Error response status:", axiosError.response.status)
        }
      }

      toast({
        title: "Error",
        description: "Failed to reject pharmacist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
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
    if (!dateString) return "N/A"

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

  if (isLoading) {
    return <PharmacistsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Pharmacists
          </Heading>
          <Text color="gray.600">Manage pharmacist accounts and license verification</Text>
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
                onChange={(index) => {
                  const tabValues = ["all", "pending", "approved", "rejected"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Pending</Tab>
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
                    <Th>Date Applied</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPharmacists.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={6} color="gray.500">
                        No pharmacists found
                      </Td>
                    </Tr>
                  ) : (
                    filteredPharmacists.map((pharmacist) => (
                      <Tr key={pharmacist.id}>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{pharmacist.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {pharmacist.email}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{pharmacist.pharmacy_name || "N/A"}</Td>
                        <Td>
                          {pharmacist.address ? (
                            <Flex align="center" gap={1}>
                              <MapPin size={14} />
                              <Text fontSize="sm">{pharmacist.address}</Text>
                            </Flex>
                          ) : (
                            "N/A"
                          )}
                        </Td>
                        <Td>{formatDate(pharmacist.created_at)}</Td>
                        <Td>
                          <Badge colorScheme={getStatusBadgeColor(pharmacist.status)}>
                            {pharmacist.status.charAt(0).toUpperCase() + pharmacist.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td isNumeric>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<MoreHorizontal size={16} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Eye size={16} />} onClick={() => viewPharmacistDetails(pharmacist)}>
                                View Details
                              </MenuItem>
                              {pharmacist.license_image && (
                                <MenuItem icon={<FileText size={16} />} onClick={() => viewLicenseImage(pharmacist)}>
                                  View License
                                </MenuItem>
                              )}
                              <MenuDivider />
                              {pharmacist.status === "pending" && (
                                <>
                                  <MenuItem
                                    icon={<CheckCircle size={16} color="green" />}
                                    onClick={() => handleApprovePharmacist(pharmacist.id)}
                                  >
                                    Approve
                                  </MenuItem>
                                  <MenuItem
                                    icon={<XCircle size={16} color="red" />}
                                    onClick={() => viewPharmacistDetails(pharmacist)}
                                  >
                                    Reject
                                  </MenuItem>
                                </>
                              )}
                              {pharmacist.status === "rejected" && (
                                <MenuItem
                                  icon={<CheckCircle size={16} color="green" />}
                                  onClick={() => handleApprovePharmacist(pharmacist.id)}
                                >
                                  Approve
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
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

      {/* View Pharmacist Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <Box position="sticky" top={0} zIndex={10} bg="white" borderTopRadius="md" pt={4} px={6}>
            <ModalHeader p={0} mb={4}>
              Pharmacist Details
            </ModalHeader>
            <ModalCloseButton top={4} right={6} />
          </Box>
          <ModalBody pt={0}>
            {selectedPharmacist && (
              <Stack spacing={4}>
                <Flex gap={4} direction={{ base: "column", md: "row" }}>
                  <Box flex="1">
                    <Text fontWeight="medium" mb={1}>
                      Pharmacist Information
                    </Text>
                    <Text>Name: {selectedPharmacist.name}</Text>
                    <Text>Email: {selectedPharmacist.email}</Text>
                    <Text>Pharmacy: {selectedPharmacist.pharmacy_name || "N/A"}</Text>
                    <Text>Phone: {selectedPharmacist.phone || "N/A"}</Text>
                    <Text>Address: {selectedPharmacist.address || "N/A"}</Text>
                    <Text>Application Date: {formatDate(selectedPharmacist.created_at)}</Text>
                    <Text>Email Verified: {selectedPharmacist.email_verified_at ? "Yes" : "No"}</Text>
                    <Text>
                      Status:{" "}
                      <Badge colorScheme={getStatusBadgeColor(selectedPharmacist.status)}>
                        {selectedPharmacist.status.charAt(0).toUpperCase() + selectedPharmacist.status.slice(1)}
                      </Badge>
                    </Text>
                  </Box>
                </Flex>

                {selectedPharmacist.status === "pending" && (
                  <Box mt={4}>
                    <Text fontWeight="medium" mb={2}>
                      Rejection Reason (if rejecting)
                    </Text>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </Box>
                )}

                {selectedPharmacist.license_image && (
                  <HStack mt={4}>
                    <Button flex="1" onClick={() => viewLicenseImage(selectedPharmacist)}>
                      View License Image
                    </Button>
                  </HStack>
                )}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onViewClose}>
              Close
            </Button>
            {selectedPharmacist && selectedPharmacist.status === "pending" && (
              <>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => handleRejectPharmacist(selectedPharmacist.id)}
                  isDisabled={!rejectReason.trim()}
                >
                  Reject
                </Button>
                <Button colorScheme="green" onClick={() => handleApprovePharmacist(selectedPharmacist.id)}>
                  Approve
                </Button>
              </>
            )}
            {selectedPharmacist && selectedPharmacist.status === "rejected" && (
              <Button colorScheme="green" onClick={() => handleApprovePharmacist(selectedPharmacist.id)}>
                Approve
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View License Image Modal */}
      <Modal isOpen={isLicenseOpen} onClose={onLicenseClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <Box position="sticky" top={0} zIndex={10} bg="white" borderTopRadius="md" pt={4} px={6}>
            <ModalHeader p={0} mb={4}>
              License Image
            </ModalHeader>
            <ModalCloseButton top={4} right={6} />
          </Box>
          <ModalBody pt={0}>
            {selectedPharmacist && (
              <Box>
                <Center>
                  <Image
                    src={getLicenseImageUrl(selectedPharmacist.license_image) || "/placeholder.svg"}
                    alt="License Image"
                    maxH="500px"
                    objectFit="contain"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/800x600.png?text=License+Image+Not+Available"
                  />
                </Center>
                <Box mt={4}>
                  <Text fontWeight="medium">{selectedPharmacist.name}</Text>
                  <Text>Pharmacy: {selectedPharmacist.pharmacy_name || "N/A"}</Text>
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onLicenseClose}>
              Close
            </Button>
            {selectedPharmacist && selectedPharmacist.status === "pending" && (
              <>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => {
                    onLicenseClose()
                    viewPharmacistDetails(selectedPharmacist)
                  }}
                >
                  Reject
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    handleApprovePharmacist(selectedPharmacist.id)
                    onLicenseClose()
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
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
                  {["Pharmacist", "Pharmacy", "Location", "Date Applied", "Status", "Actions"].map((header) => (
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
                        <Box>
                          <Skeleton height="16px" width="120px" mb={1} />
                          <Skeleton height="14px" width="150px" />
                        </Box>
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
                        <Skeleton height="16px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="70px" borderRadius="full" />
                      </Td>
                      <Td isNumeric>
                        <Flex justify="flex-end">
                          <Skeleton height="24px" width="32px" />
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
