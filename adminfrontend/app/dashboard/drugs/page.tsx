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
} from "@chakra-ui/react"
import { Search, PlusCircle, Edit, Trash2, AlertTriangle, MoreHorizontal, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Drug = {
  id: number
  name: string
  brand: string
  description: string
  category: string
  price: number
  stock: number
  dosage: string
  expires_at: string
  created_at: string
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

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchDrugs = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockDrugs: Drug[] = [
          {
            id: 1,
            name: "Amoxicillin",
            brand: "Amoxil",
            description: "Antibiotic used to treat bacterial infections",
            category: "Antibiotic",
            price: 15.99,
            stock: 120,
            dosage: "500mg",
            expires_at: "2025-06-30",
            created_at: "2023-01-15",
          },
          {
            id: 2,
            name: "Lisinopril",
            brand: "Prinivil",
            description: "Used to treat high blood pressure and heart failure",
            category: "Blood Pressure",
            price: 12.5,
            stock: 85,
            dosage: "10mg",
            expires_at: "2024-12-15",
            created_at: "2023-02-10",
          },
          {
            id: 3,
            name: "Metformin",
            brand: "Glucophage",
            description: "Used to treat type 2 diabetes",
            category: "Diabetes",
            price: 8.75,
            stock: 5,
            dosage: "500mg",
            expires_at: "2025-03-20",
            created_at: "2023-01-25",
          },
          {
            id: 4,
            name: "Atorvastatin",
            brand: "Lipitor",
            description: "Used to lower cholesterol and triglycerides",
            category: "Cholesterol",
            price: 22.99,
            stock: 65,
            dosage: "20mg",
            expires_at: "2024-09-10",
            created_at: "2023-03-05",
          },
          {
            id: 5,
            name: "Albuterol",
            brand: "Ventolin",
            description: "Used to treat asthma and COPD",
            category: "Respiratory",
            price: 25.5,
            stock: 3,
            dosage: "90mcg",
            expires_at: "2024-11-30",
            created_at: "2023-02-18",
          },
          {
            id: 6,
            name: "Sertraline",
            brand: "Zoloft",
            description: "Used to treat depression, anxiety, and PTSD",
            category: "Mental Health",
            price: 18.25,
            stock: 42,
            dosage: "50mg",
            expires_at: "2025-01-15",
            created_at: "2023-03-12",
          },
        ]

        setDrugs(mockDrugs)
        setFilteredDrugs(mockDrugs)
      } catch (error) {
        console.error("Error fetching drugs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrugs()
  }, [token])

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

  const handleAddDrug = () => {
    // In a real app, you would call your API to add the drug
    const newDrug: Drug = {
      id: drugs.length + 1,
      name: formData.name,
      brand: formData.brand,
      description: formData.description,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      dosage: formData.dosage,
      expires_at: formData.expires_at,
      created_at: new Date().toISOString().split("T")[0],
    }

    setDrugs([...drugs, newDrug])
    onAddClose()
    resetForm()

    toast({
      title: "Drug added",
      description: `${newDrug.name} has been added successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleEditDrug = () => {
    if (!selectedDrug) return

    // In a real app, you would call your API to update the drug
    const updatedDrugs = drugs.map((drug) =>
      drug.id === selectedDrug.id
        ? {
            ...drug,
            name: formData.name,
            brand: formData.brand,
            description: formData.description,
            category: formData.category,
            price: Number.parseFloat(formData.price),
            stock: Number.parseInt(formData.stock),
            dosage: formData.dosage,
            expires_at: formData.expires_at,
          }
        : drug,
    )

    setDrugs(updatedDrugs)
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
  }

  const handleDeleteDrug = () => {
    if (!selectedDrug) return

    // In a real app, you would call your API to delete the drug
    const updatedDrugs = drugs.filter((drug) => drug.id !== selectedDrug.id)

    setDrugs(updatedDrugs)
    onDeleteClose()
    setSelectedDrug(null)

    toast({
      title: "Drug deleted",
      description: `${selectedDrug.name} has been deleted successfully`,
      status: "error",
      duration: 3000,
      isClosable: true,
    })
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
                        <Td isNumeric>${drug.price.toFixed(2)}</Td>
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
                              <MenuItem icon={<Eye size={16} />}>View Details</MenuItem>
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
          <Skeleton height="8" width="32" />
          <Skeleton height="4" width="48" mt={2} />
        </Box>
        <Skeleton height="10" width="36" />
      </Flex>

      <Skeleton height="500px" width="full" />
    </Stack>
  )
}
