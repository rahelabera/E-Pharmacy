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
  Center,
} from "@chakra-ui/react"
import { CheckCircle, XCircle, Search, Eye, MoreHorizontal, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Prescription = {
  id: number
  patient: {
    id: number
    name: string
    email: string
  }
  image_url: string
  status: "pending" | "approved" | "rejected" | "dispensed"
  notes: string
  created_at: string
  updated_at: string
}

export default function PrescriptionsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchPrescriptions = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockPrescriptions: Prescription[] = [
          {
            id: 1001,
            patient: {
              id: 5,
              name: "John Doe",
              email: "john@example.com",
            },
            image_url: "/prescription-sample.jpg",
            status: "pending",
            notes: "",
            created_at: "2023-05-15",
            updated_at: "2023-05-15",
          },
          {
            id: 1002,
            patient: {
              id: 6,
              name: "Jane Smith",
              email: "jane@example.com",
            },
            image_url: "/prescription-sample.jpg",
            status: "approved",
            notes: "Approved for dispensing. Patient has insurance coverage.",
            created_at: "2023-05-14",
            updated_at: "2023-05-15",
          },
          {
            id: 1003,
            patient: {
              id: 7,
              name: "Robert Johnson",
              email: "robert@example.com",
            },
            image_url: "/prescription-sample.jpg",
            status: "dispensed",
            notes: "Medication dispensed on May 16, 2023.",
            created_at: "2023-05-13",
            updated_at: "2023-05-16",
          },
          {
            id: 1004,
            patient: {
              id: 8,
              name: "Emily Davis",
              email: "emily@example.com",
            },
            image_url: "/prescription-sample.jpg",
            status: "rejected",
            notes: "Prescription is illegible. Requested clearer image.",
            created_at: "2023-05-12",
            updated_at: "2023-05-13",
          },
          {
            id: 1005,
            patient: {
              id: 9,
              name: "Michael Brown",
              email: "michael@example.com",
            },
            image_url: "/prescription-sample.jpg",
            status: "pending",
            notes: "",
            created_at: "2023-05-16",
            updated_at: "2023-05-16",
          },
        ]

        setPrescriptions(mockPrescriptions)
        setFilteredPrescriptions(mockPrescriptions)
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescriptions()
  }, [token])

  useEffect(() => {
    // Filter prescriptions based on search term and active tab
    let filtered = prescriptions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (prescription) =>
          prescription.id.toString().includes(searchTerm) ||
          prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((prescription) => prescription.status === activeTab)
    }

    setFilteredPrescriptions(filtered)
  }, [searchTerm, activeTab, prescriptions])

  const handleUpdateStatus = (prescriptionId: number, newStatus: Prescription["status"], newNotes = "") => {
    // In a real app, you would call your API to update the prescription status
    const updatedPrescriptions = prescriptions.map((prescription) =>
      prescription.id === prescriptionId
        ? {
            ...prescription,
            status: newStatus,
            notes: newNotes || prescription.notes,
            updated_at: new Date().toISOString().split("T")[0],
          }
        : prescription,
    )

    setPrescriptions(updatedPrescriptions)

    toast({
      title: "Prescription status updated",
      description: `Prescription #${prescriptionId} has been marked as ${newStatus}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const viewPrescriptionDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setNotes(prescription.notes)
    onViewOpen()
  }

  const getStatusBadgeColor = (status: Prescription["status"]) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "approved":
        return "blue"
      case "dispensed":
        return "green"
      case "rejected":
        return "red"
      default:
        return "gray"
    }
  }

  if (isLoading) {
    return <PrescriptionsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Prescriptions
          </Heading>
          <Text color="gray.600">Manage and process patient prescriptions</Text>
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
                    placeholder="Search prescriptions..."
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
                  const tabValues = ["all", "pending", "approved", "dispensed", "rejected"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Pending</Tab>
                  <Tab>Approved</Tab>
                  <Tab>Dispensed</Tab>
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
                    <Th>ID</Th>
                    <Th>Patient</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPrescriptions.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                        No prescriptions found
                      </Td>
                    </Tr>
                  ) : (
                    filteredPrescriptions.map((prescription) => (
                      <Tr key={prescription.id}>
                        <Td>#{prescription.id}</Td>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{prescription.patient.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {prescription.patient.email}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{prescription.created_at}</Td>
                        <Td>
                          <Badge colorScheme={getStatusBadgeColor(prescription.status)}>
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
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
                              <MenuItem icon={<Eye size={16} />} onClick={() => viewPrescriptionDetails(prescription)}>
                                View Details
                              </MenuItem>
                              <MenuDivider />
                              <MenuList>Update Status</MenuList>
                              {prescription.status === "pending" && (
                                <>
                                  <MenuItem
                                    icon={<CheckCircle size={16} color="blue" />}
                                    onClick={() => viewPrescriptionDetails(prescription)}
                                  >
                                    Approve
                                  </MenuItem>
                                  <MenuItem
                                    icon={<XCircle size={16} color="red" />}
                                    onClick={() => viewPrescriptionDetails(prescription)}
                                  >
                                    Reject
                                  </MenuItem>
                                </>
                              )}
                              {prescription.status === "approved" && (
                                <MenuItem
                                  icon={<CheckCircle size={16} color="green" />}
                                  onClick={() => viewPrescriptionDetails(prescription)}
                                >
                                  Mark as Dispensed
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

      {/* View Prescription Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prescription #{selectedPrescription?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPrescription && (
              <Stack spacing={6}>
                <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Patient
                    </Text>
                    <Text fontSize="sm">{selectedPrescription.patient.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedPrescription.patient.email}
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Prescription Info
                    </Text>
                    <Text fontSize="sm">Date: {selectedPrescription.created_at}</Text>
                    <Flex align="center" gap={1}>
                      <Text fontSize="sm">Status:</Text>
                      <Badge colorScheme={getStatusBadgeColor(selectedPrescription.status)}>
                        {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                      </Badge>
                    </Flex>
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Prescription Image
                  </Text>
                  <Box borderWidth="1px" borderRadius="md" p={2} bg="gray.50">
                    <Center h="64" maxW="md" mx="auto">
                      <Box
                        bg="gray.200"
                        borderRadius="md"
                        h="full"
                        w="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FileText size={64} color="#A0AEC0" />
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Prescription Image Placeholder
                        </Text>
                      </Box>
                    </Center>
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Notes
                  </Text>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this prescription..."
                    minH="100px"
                  />
                </Box>

                <Flex justify="space-between">
                  <Button variant="outline" onClick={onViewClose}>
                    Close
                  </Button>
                  <Stack direction="row" spacing={2}>
                    {selectedPrescription.status === "pending" && (
                      <>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            handleUpdateStatus(selectedPrescription.id, "rejected", notes)
                            onViewClose()
                          }}
                          leftIcon={<XCircle size={16} />}
                        >
                          Reject
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={() => {
                            handleUpdateStatus(selectedPrescription.id, "approved", notes)
                            onViewClose()
                          }}
                          leftIcon={<CheckCircle size={16} />}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {selectedPrescription.status === "approved" && (
                      <Button
                        colorScheme="green"
                        onClick={() => {
                          handleUpdateStatus(selectedPrescription.id, "dispensed", notes)
                          onViewClose()
                        }}
                        leftIcon={<CheckCircle size={16} />}
                      >
                        Mark as Dispensed
                      </Button>
                    )}
                  </Stack>
                </Flex>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function PrescriptionsSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="8" width="32" />
        <Skeleton height="4" width="48" mt={2} />
      </Box>

      <Skeleton height="500px" width="full" />
    </Stack>
  )
}
