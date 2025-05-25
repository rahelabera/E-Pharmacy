"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  InputGroup,
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
  HStack,
  Image,
  Avatar,
  IconButton,
  InputLeftElement as ChakraInputLeftElement,
} from "@chakra-ui/react"
import { Search, ChevronLeft, ChevronRight, Eye, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type Creator = {
  id: number
  name: string
  username: string
  email: string
  role: string | null
  profile_image: string | null
  cloudinary_public_id: string | null
  created_at: string
  updated_at: string
}

type Drug = {
  id: number
  name: string
  brand: string
  description: string
  category: string
  price: number
  stock: number
  dosage: string
  image: string | null
  prescription_needed: boolean
  expires_at: string
  creator: Creator
  username: string
}

type Meta = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
  total_stock?: number
  low_stock_count?: number
}

type Links = {
  first: string
  last: string
  prev: string | null
  next: string | null
}

type DrugsResponse = {
  status: string
  message: string
  data: Drug[]
  meta: Meta
  links: Links
}

export default function DrugsPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [links, setLinks] = useState<Links | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowsPerPageInput, setRowsPerPageInput] = useState(rowsPerPage.toString())

  useEffect(() => {
    // Fetch drugs from the API with server-side filtering and pagination
    const fetchDrugs = async () => {
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

        const response = await api.get<DrugsResponse>(`/drugs?${params.toString()}`)
        setDrugs(response.data.data)
        setMeta(response.data.meta)
        setLinks(response.data.links)
      } catch (error) {
        console.error("Error fetching drugs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrugs()
  }, [currentPage, rowsPerPage, searchTerm, activeTab, token])

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

  // Reset page to 1 when search term or active tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab, rowsPerPage])

  // Helper function to handle null values
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "-"
    return String(value)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount)
  }

  const getStockStatusColor = (stock: number | string) => {
    const stockNum = Number.parseInt(String(stock), 10)
    if (stockNum <= 10) return "red"
    if (stockNum <= 20) return "yellow"
    return "green"
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
            <Heading as="h1" size="md" mb={1}>
              Drugs {activeTab !== "all" && `(${activeTab})`}
            </Heading>
            <Text color="gray.600">View medications and inventory</Text>
          </Box>
          {meta && (
            <HStack spacing={4}>
              <Flex direction="column" align="center" bg="blue.50" p={3} borderRadius="md" minW="120px">
                <Text fontSize="sm" color="blue.600">
                  Total Drugs
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  {meta.total}
                </Text>
              </Flex>
              <Flex direction="column" align="center" bg="blue.50" p={3} borderRadius="md" minW="120px">
                <Text fontSize="sm" color="blue.600">
                  Total Stock
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  {meta.total_stock || "-"}
                </Text>
              </Flex>
              <Flex direction="column" align="center" bg="blue.50" p={3} borderRadius="md" minW="120px">
                <Text fontSize="sm" color="blue.600">
                  Low Stock
                </Text>
                <Text fontWeight="bold" fontSize="xl">
                  {meta.low_stock_count || 0}
                </Text>
              </Flex>
            </HStack>
          )}
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
                  <ChakraInputLeftElement pointerEvents="none">
                    <Search size={16} color="gray.500" />
                  </ChakraInputLeftElement>
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
                defaultIndex={0}
                index={["all", "low-stock", "prescription", "expiring-soon"].indexOf(activeTab)}
                onChange={(index) => {
                  const tabValues = ["all", "low-stock", "prescription", "expiring-soon"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All Drugs</Tab>
                  <Tab>Low Stock</Tab>
                  <Tab>Prescription</Tab>
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
                    <Th>Drug</Th>
                    <Th>Brand</Th>
                    <Th>Category</Th>
                    <Th>Dosage</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Stock</Th>
                    <Th>Expires</Th>
                    <Th>Prescription</Th>
                    <Th>Added By</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {drugs.length === 0 ? (
                    <Tr>
                      <Td colSpan={10} textAlign="center" py={6} color="gray.500">
                        No drugs found
                      </Td>
                    </Tr>
                  ) : (
                    drugs.map((drug) => (
                      <Tr key={drug.id}>
                        <Td>
                          <Flex align="center">
                            <Image
                              src={drug.image || "/placeholder.svg"}
                              alt={drug.name}
                              boxSize="32px"
                              borderRadius="md"
                              mr={2}
                              objectFit="cover"
                              fallbackSrc="/placeholder.svg"
                            />
                            <Text fontWeight="medium">{formatValue(drug.name)}</Text>
                          </Flex>
                        </Td>
                        <Td>{formatValue(drug.brand)}</Td>
                        <Td>{formatValue(drug.category)}</Td>
                        <Td>{formatValue(drug.dosage)}</Td>
                        <Td isNumeric>{formatCurrency(drug.price)}</Td>
                        <Td isNumeric>
                          <Badge colorScheme={getStockStatusColor(drug.stock)}>{formatValue(drug.stock)}</Badge>
                        </Td>
                        <Td>{formatDate(drug.expires_at)}</Td>
                        <Td>
                          {drug.prescription_needed ? (
                            <Badge colorScheme="red">Required</Badge>
                          ) : (
                            <Badge colorScheme="green">Not Required</Badge>
                          )}
                        </Td>
                        <Td>
                          <Flex
                            align="center"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (drug.creator?.id) {
                                router.push(`/dashboard/pharmacists/${drug.creator.id}`)
                              }
                            }}
                            cursor={drug.creator?.id ? "pointer" : "default"}
                            _hover={{
                              color: drug.creator?.id ? "blue.500" : "inherit",
                              textDecoration: drug.creator?.id ? "underline" : "none",
                            }}
                          >
                            <Avatar
                              size="xs"
                              name={drug.creator?.name}
                              src={drug.creator?.profile_image || undefined}
                              mr={2}
                            />
                            <Text fontSize="xs">{formatValue(drug.creator?.name)}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text
                            color="blue.500"
                            fontWeight="medium"
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            onClick={() => router.push(`/dashboard/drugs/${drug.id}`)}
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
            {meta && (
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
        <HStack spacing={4}>
          <Skeleton height="70px" width="120px" />
          <Skeleton height="70px" width="120px" />
          <Skeleton height="70px" width="120px" />
        </HStack>
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
                  {["Drug", "Brand", "Category", "Dosage", "Price", "Stock", "Expires", "Prescription", "Added By", "Actions"].map(
                    (header) => (
                      <Th key={header}>
                        <Skeleton height="14px" width="80%" />
                      </Th>
                    ),
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Tr key={i}>
                      <Td>
                        <Flex align="center">
                          <Skeleton height="32px" width="32px" borderRadius="md" mr={2} />
                          <Skeleton height="16px" width="120px" />
                        </Flex>
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
                      <Td>
                        <Skeleton height="20px" width="80px" borderRadius="full" />
                      </Td>
                      <Td>
                        <Flex align="center">
                          <Skeleton height="24px" width="24px" borderRadius="full" mr={2} />
                          <Skeleton height="16px" width="80px" />
                        </Flex>
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