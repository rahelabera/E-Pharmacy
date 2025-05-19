"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
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
  Select,
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
  HStack,
} from "@chakra-ui/react"
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

type Drug = {
  id: number
  name: string
  brand: string
  description: string
  category: string
  price: string // Changed from number to string to match API response
  stock: number
  dosage: string
  expires_at: string
  created_at?: string // Optional since it's not in the API response
}

type Meta = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

type Links = {
  first: string
  last: string
  prev: string | null
  next: string | null
}

type DrugsResponse = {
  data: Drug[]
  meta: Meta
  links: Links
}

export default function DrugsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    dosage: "",
    expires_at: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [links, setLinks] = useState<Links | null>(null)

  useEffect(() => {
    // Fetch drugs from the API
    const fetchDrugs = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<DrugsResponse>(`/drugs?page=${currentPage}`)
        setDrugs(response.data.data)
        setFilteredDrugs(response.data.data)
        setMeta(response.data.meta)
        setLinks(response.data.links)
      } catch (error) {
        console.error("Error fetching drugs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch drugs. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrugs()
  }, [currentPage, token, toast])

  useEffect(() => {
    // Filter drugs based on search term and active tab
    let filtered = drugs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (drug) =>
          drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab === "low-stock") {
      filtered = filtered.filter((drug) => drug.stock <= 5)
    } else if (activeTab === "expiring-soon") {
      // Filter drugs expiring in the next 3 months
      const threeMonthsFromNow = new Date()
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

      filtered = filtered.filter((drug) => {
        const expiryDate = new Date(drug.expires_at)
        return expiryDate <= threeMonthsFromNow
      })
    }

    setFilteredDrugs(filtered)
  }, [searchTerm, activeTab, drugs])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      dosage: "",
      expires_at: "",
    })
  }

  const handleNextPage = () => {
    if (meta && currentPage < meta.last_page) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleAddDrug = async () => {
    try {
      const drugData = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        stock: Number.parseInt(formData.stock),
        dosage: formData.dosage,
        expires_at: formData.expires_at,
      }

      const response = await api.post("/drugs", drugData)

      // Add the new drug to the list
      setDrugs([...drugs, response.data.data])
      onAddClose()
      resetForm()

      toast({
        title: "Drug added",
        description: `${drugData.name} has been added successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      // Refresh drugs list to ensure we have the latest data
      setCurrentPage(1)
    } catch (error) {
      console.error("Error adding drug:", error)
      toast({
        title: "Error",
        description: "Failed to add drug. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEditDrug = async () => {
    if (!selectedDrug) return

    try {
      const drugData = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        stock: Number.parseInt(formData.stock),
        dosage: formData.dosage,
        expires_at: formData.expires_at,
      }

      await api.put(`/drugs/${selectedDrug.id}`, drugData)

      // Update the drug in the list
      const updatedDrugs = drugs.map((drug) =>
        drug.id === selectedDrug.id
          ? {
              ...drug,
              ...drugData,
            }
          : drug,
      )

      setDrugs(updatedDrugs)
      setFilteredDrugs(updatedDrugs)
      onEditClose()
      setSelectedDrug(null)
      resetForm()

      toast({
        title: "Drug updated",
        description: `${formData.name} has been updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error updating drug:", error)
      toast({
        title: "Error",
        description: "Failed to update drug. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDeleteDrug = async () => {
    if (!selectedDrug) return

    try {
      await api.delete(`/drugs/${selectedDrug.id}`)

      // Remove the drug from the list
      const updatedDrugs = drugs.filter((drug) => drug.id !== selectedDrug.id)
      setDrugs(updatedDrugs)
      setFilteredDrugs(updatedDrugs)
      onDeleteClose()
      setSelectedDrug(null)

      toast({
        title: "Drug deleted",
        description: `${selectedDrug.name} has been deleted successfully`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })

      // If we deleted the last item on the current page, go to the previous page
      if (updatedDrugs.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error("Error deleting drug:", error)
      toast({
        title: "Error",
        description: "Failed to delete drug. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const openEditModal = (drug: Drug) => {
    setSelectedDrug(drug)
    setFormData({
      name: drug.name,
      brand: drug.brand,
      description: drug.description,
      category: drug.category,
      price: drug.price.toString(),
      stock: drug.stock.toString(),
      dosage: drug.dosage,
      expires_at: drug.expires_at,
    })
    onEditOpen()
  }

  const openDeleteModal = (drug: Drug) => {
    setSelectedDrug(drug)
    onDeleteOpen()
  }

  if (isLoading) {
    return <DrugsSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          align={{ sm: "center" }}
          justify={{ sm: "space-between" }}
          gap={4}
        >
          <Box>
            <Heading as="h1" size="lg" mb={1}>
              Drugs
            </Heading>
            <Text color="gray.600">Manage medications and inventory</Text>
          </Box>
          <Button leftIcon={<PlusCircle size={16} />} colorScheme="blue" onClick={onAddOpen}>
            Add New Drug
          </Button>
        </Flex>

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
                    placeholder="Search drugs..."
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
                  const tabValues = ["all", "low-stock", "expiring-soon"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All Drugs</Tab>
                  <Tab>Low Stock</Tab>
                  <Tab>Expiring Soon</Tab>
                </TabList>
              </Tabs>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Brand</Th>
                    <Th>Category</Th>
                    <Th>Dosage</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Stock</Th>
                    <Th>Expires</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredDrugs.length === 0 ? (
                    <Tr>
                      <Td colSpan={8} textAlign="center" py={6} color="gray.500">
                        No drugs found
                      </Td>
                    </Tr>
                  ) : (
                    filteredDrugs.map((drug) => (
                      <Tr key={drug.id}>
                        <Td>{drug.name}</Td>
                        <Td>{drug.brand}</Td>
                        <Td>{drug.category}</Td>
                        <Td>{drug.dosage}</Td>
                        <Td isNumeric>${Number.parseFloat(drug.price).toFixed(2)}</Td>
                        <Td isNumeric>
                          <Badge colorScheme={drug.stock <= 5 ? "red" : drug.stock <= 20 ? "yellow" : "green"}>
                            {drug.stock}
                          </Badge>
                        </Td>
                        <Td>{drug.expires_at}</Td>
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
                              <MenuItem
                                icon={<Eye size={16} />}
                                onClick={() => router.push(`/dashboard/drugs/${drug.id}`)}
                              >
                                View Details
                              </MenuItem>
                              <MenuItem icon={<Edit size={16} />} onClick={() => openEditModal(drug)}>
                                Edit
                              </MenuItem>
                              <MenuDivider />
                              <MenuItem
                                icon={<Trash2 size={16} />}
                                color="red.500"
                                onClick={() => openDeleteModal(drug)}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
            {meta && (
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm">
                  Showing {meta.from} to {meta.to} of {meta.total} drugs
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
                    Page {meta.current_page} of {meta.last_page}
                  </Text>
                  <Button
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                    onClick={handleNextPage}
                    isDisabled={meta.current_page === meta.last_page}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Stack>

      {/* Add Drug Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Drug</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Drug Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="e.g., Amoxicillin"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Brand</FormLabel>
                  <Input
                    name="brand"
                    placeholder="e.g., Amoxil"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  placeholder="Brief description of the drug"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    placeholder="Select category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Cholesterol">Cholesterol</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Dosage</FormLabel>
                  <Input
                    name="dosage"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Flex>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Price ($)</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Stock</FormLabel>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    name="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddDrug}
              isDisabled={!formData.name || !formData.price || !formData.stock}
            >
              Add Drug
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Drug Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Drug</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Drug Name</FormLabel>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Brand</FormLabel>
                  <Input name="brand" value={formData.brand} onChange={handleInputChange} required />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </FormControl>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Category</FormLabel>
                  <Select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Cholesterol">Cholesterol</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Dosage</FormLabel>
                  <Input name="dosage" value={formData.dosage} onChange={handleInputChange} required />
                </FormControl>
              </Flex>
              <Flex gap={4}>
                <FormControl flex="1">
                  <FormLabel>Price ($)</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Stock</FormLabel>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl flex="1">
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    name="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditDrug}>
              Update Drug
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Drug Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" py={4}>
              <AlertTriangle size={48} color="#ef4444" />
              <Text mt={4}>Are you sure you want to delete {selectedDrug?.name}? This action cannot be undone.</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteDrug}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function DrugsSkeleton() {
  return (
    <Stack spacing={6}>
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ sm: "center" }}
        justify={{ sm: "space-between" }}
        gap={4}
      >
        <Box>
          <Skeleton height="32px" width="100px" />
          <Skeleton height="18px" width="250px" mt={2} />
        </Box>
        <Skeleton height="40px" width="150px" />
      </Flex>

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
                  {["Name", "Brand", "Category", "Dosage", "Price", "Stock", "Expires", "Actions"].map((header) => (
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
                        <Skeleton height="16px" width="120px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="100px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="90px" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="70px" />
                      </Td>
                      <Td isNumeric>
                        <Skeleton height="16px" width="60px" />
                      </Td>
                      <Td isNumeric>
                        <Skeleton height="20px" width="50px" borderRadius="full" />
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
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
