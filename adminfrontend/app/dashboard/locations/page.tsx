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
  Grid,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  Center,
} from "@chakra-ui/react"
import { Search, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Location = {
  id: number
  name: string
  address: string
  city: string
  phone: string
  lat: number
  lng: number
}

export default function LocationsPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    lat: "",
    lng: "",
  })

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockLocations: Location[] = [
          {
            id: 1,
            name: "Central Pharmacy",
            address: "123 Main St",
            city: "Addis Ababa",
            phone: "+251-111-234567",
            lat: 9.0222,
            lng: 38.7468,
          },
          {
            id: 2,
            name: "North Side Pharmacy",
            address: "456 North Ave",
            city: "Addis Ababa",
            phone: "+251-111-345678",
            lat: 9.0349,
            lng: 38.7615,
          },
          {
            id: 3,
            name: "East End Pharmacy",
            address: "789 East Blvd",
            city: "Addis Ababa",
            phone: "+251-111-456789",
            lat: 9.0167,
            lng: 38.7667,
          },
          {
            id: 4,
            name: "South Point Pharmacy",
            address: "101 South St",
            city: "Addis Ababa",
            phone: "+251-111-567890",
            lat: 9.0102,
            lng: 38.7468,
          },
          {
            id: 5,
            name: "West Gate Pharmacy",
            address: "202 West Rd",
            city: "Addis Ababa",
            phone: "+251-111-678901",
            lat: 9.0222,
            lng: 38.7368,
          },
        ]

        setLocations(mockLocations)
        setFilteredLocations(mockLocations)
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [token])

  useEffect(() => {
    // Filter locations based on search term
    if (searchTerm) {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredLocations(filtered)
    } else {
      setFilteredLocations(locations)
    }
  }, [searchTerm, locations])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      lat: "",
      lng: "",
    })
  }

  const handleAddLocation = () => {
    // In a real app, you would call your API to add the location
    const newLocation: Location = {
      id: locations.length + 1,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      lat: Number.parseFloat(formData.lat),
      lng: Number.parseFloat(formData.lng),
    }

    setLocations([...locations, newLocation])
    onAddClose()
    resetForm()

    toast({
      title: "Location added",
      description: `${newLocation.name} has been added successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleEditLocation = () => {
    if (!selectedLocation) return

    // In a real app, you would call your API to update the location
    const updatedLocations = locations.map((location) =>
      location.id === selectedLocation.id
        ? {
            ...location,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            lat: Number.parseFloat(formData.lat),
            lng: Number.parseFloat(formData.lng),
          }
        : location,
    )

    setLocations(updatedLocations)
    onEditClose()
    setSelectedLocation(null)
    resetForm()

    toast({
      title: "Location updated",
      description: `${formData.name} has been updated successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleDeleteLocation = () => {
    if (!selectedLocation) return

    // In a real app, you would call your API to delete the location
    const updatedLocations = locations.filter((location) => location.id !== selectedLocation.id)

    setLocations(updatedLocations)
    onDeleteClose()
    setSelectedLocation(null)

    toast({
      title: "Location deleted",
      description: `${selectedLocation.name} has been deleted successfully`,
      status: "error",
      duration: 3000,
      isClosable: true,
    })
  }

  const openEditModal = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      phone: location.phone,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    })
    onEditOpen()
  }

  const openDeleteModal = (location: Location) => {
    setSelectedLocation(location)
    onDeleteOpen()
  }

  if (isLoading) {
    return <LocationsSkeleton />
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
              Pharmacy Locations
            </Heading>
            <Text color="gray.600">Manage pharmacy locations and addresses</Text>
          </Box>
          <Button leftIcon={<Plus size={16} />} colorScheme="blue" onClick={onAddOpen}>
            Add New Location
          </Button>
        </Flex>

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          <Card>
            <CardHeader>
              <Flex align="center" justify="space-between">
                <Heading size="md">Pharmacy Locations</Heading>
                <Box w="64">
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Search size={16} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="search"
                      placeholder="Search locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Box>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Address</Th>
                      <Th>Phone</Th>
                      <Th isNumeric>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredLocations.length === 0 ? (
                      <Tr>
                        <Td colSpan={4} textAlign="center" py={6} color="gray.500">
                          No locations found
                        </Td>
                      </Tr>
                    ) : (
                      filteredLocations.map((location) => (
                        <Tr key={location.id}>
                          <Td fontWeight="medium">{location.name}</Td>
                          <Td>
                            {location.address}, {location.city}
                          </Td>
                          <Td>{location.phone}</Td>
                          <Td isNumeric>
                            <IconButton
                              aria-label="Edit"
                              icon={<Edit size={16} />}
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(location)}
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<Trash2 size={16} />}
                              variant="ghost"
                              size="sm"
                              colorScheme="red"
                              onClick={() => openDeleteModal(location)}
                            />
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Map View</Heading>
            </CardHeader>
            <CardBody>
              <Box h="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <Box textAlign="center">
                  <MapPin size={48} color="#3b82f6" style={{ margin: "0 auto 8px" }} />
                  <Heading size="md" mb={2}>
                    Map Placeholder
                  </Heading>
                  <Text color="gray.500">
                    In a real application, this would display an interactive map with pharmacy locations
                  </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      {/* Add Location Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Pharmacy Name</FormLabel>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </FormControl>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Latitude</FormLabel>
                  <Input
                    id="lat"
                    name="lat"
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Longitude</FormLabel>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddLocation}
              isDisabled={!formData.name || !formData.address || !formData.city}
            >
              Add Location
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Location Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Pharmacy Name</FormLabel>
                  <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input id="edit-city" name="city" value={formData.city} onChange={handleInputChange} required />
              </FormControl>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Latitude</FormLabel>
                  <Input
                    id="edit-lat"
                    name="lat"
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Longitude</FormLabel>
                  <Input
                    id="edit-lng"
                    name="lng"
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={handleInputChange}
                    required
                  />
                </FormControl>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditLocation}>
              Update Location
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Location Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection="column" py={4}>
              <Box color="red.500" mb={4}>
                <Trash2 size={48} />
              </Box>
              <Text>Are you sure you want to delete {selectedLocation?.name}? This action cannot be undone.</Text>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteLocation}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function LocationsSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="8" width="32" />
        <Skeleton height="4" width="48" mt={2} />
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        <Skeleton height="500px" width="full" />
        <Skeleton height="500px" width="full" />
      </Grid>
    </Stack>
  )
}
