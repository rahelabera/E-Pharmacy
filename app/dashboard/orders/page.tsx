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
  Input,
  InputGroup,
  InputLeftElement,
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
  Badge,
  useToast,
  useDisclosure,
  Grid,
  HStack,
  Image,
} from "@chakra-ui/react"
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type OrderUser = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
}

type OrderDrug = {
  id: number
  name: string
  price: number
}

type Order = {
  id: number
  user: OrderUser
  drug: OrderDrug
  quantity: number
  total_amount: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "paid"
  prescription_image: string | null
  created_at: string
  updated_at: string
}

type OrdersResponse = {
  status: string
  message: string
  data: Order[]
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export default function OrdersPage() {
  const { token } = useAuth()
  const toast = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    from: 0,
    to: 0,
  })

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<OrdersResponse>(`/admin/orders?page=${currentPage}`)

        if (response.data.status === "success") {
          setOrders(response.data.data)
          setFilteredOrders(response.data.data)

          // Set pagination data
          setPagination({
            currentPage: response.data.meta.current_page,
            totalPages: response.data.meta.last_page,
            totalItems: response.data.meta.total,
            from: response.data.meta.from,
            to: response.data.meta.to,
          })
        } else {
          throw new Error("Failed to fetch orders")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage, token, toast])

  useEffect(() => {
    // Filter orders based on search term and active tab
    let filtered = orders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.drug?.name && order.drug.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, activeTab, orders])

  // Helper function to handle null values
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "-"
    }
    return String(value)
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    onViewOpen()
  }

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "processing":
        return "blue"
      case "shipped":
        return "purple"
      case "delivered":
        return "green"
      case "cancelled":
        return "red"
      case "paid":
        return "green"
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return <OrdersSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Orders
          </Heading>
          <Text color="gray.600">Manage and process customer orders</Text>
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
                    placeholder="Search orders..."
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
                  const tabValues = ["all", "pending", "processing", "shipped", "delivered", "paid"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All Orders</Tab>
                  <Tab>Pending</Tab>
                  <Tab>Processing</Tab>
                  <Tab>Shipped</Tab>
                  <Tab>Delivered</Tab>
                  <Tab>Paid</Tab>
                </TabList>
              </Tabs>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Customer</Th>
                    <Th>Medication</Th>
                    <Th>Date</Th>
                    <Th isNumeric>Total</Th>
                    <Th>Status</Th>
                    <Th>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={6} color="gray.500">
                        No orders found
                      </Td>
                    </Tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <Tr key={order.id}>
                        <Td>#{order.id}</Td>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{formatValue(order.user?.name)}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatValue(order.user?.email)}
                            </Text>
                          </Box>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{formatValue(order.drug?.name)}</Text>
                            <Text fontSize="sm" color="gray.500">
                              Qty: {order.quantity}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{formatDate(order.created_at)}</Td>
                        <Td isNumeric>${Number(order.total_amount).toFixed(2)}</Td>
                        <Td>
                          <Badge colorScheme={getStatusBadgeColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            leftIcon={<Eye size={16} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => viewOrderDetails(order)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
            {pagination.totalItems > 0 && (
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm">
                  Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.totalItems || 0} orders
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
                    Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
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

      {/* View Order Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order #{selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Stack spacing={6}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Customer
                    </Text>
                    <Text fontSize="sm">{formatValue(selectedOrder.user?.name)}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatValue(selectedOrder.user?.email)}
                    </Text>
                    {selectedOrder.user?.phone && (
                      <Text fontSize="sm" color="gray.500">
                        Phone: {selectedOrder.user.phone}
                      </Text>
                    )}
                    {selectedOrder.user?.address && (
                      <Text fontSize="sm" color="gray.500">
                        Address: {selectedOrder.user.address}
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Order Info
                    </Text>
                    <Text fontSize="sm">Date: {formatDate(selectedOrder.created_at)}</Text>
                    <Flex align="center" gap={1}>
                      <Text fontSize="sm">Status:</Text>
                      <Badge colorScheme={getStatusBadgeColor(selectedOrder.status)}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </Flex>
                  </Box>
                </Grid>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Order Details
                  </Text>
                  <Box borderWidth="1px" borderRadius="md">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Item</Th>
                          <Th textAlign="center">Quantity</Th>
                          <Th isNumeric>Price</Th>
                          <Th isNumeric>Subtotal</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{formatValue(selectedOrder.drug?.name)}</Td>
                          <Td textAlign="center">{selectedOrder.quantity}</Td>
                          <Td isNumeric>${selectedOrder.drug?.price.toFixed(2) || "-"}</Td>
                          <Td isNumeric>${Number(selectedOrder.total_amount).toFixed(2)}</Td>
                        </Tr>
                        <Tr>
                          <Td colSpan={3} textAlign="right" fontWeight="medium">
                            Total:
                          </Td>
                          <Td isNumeric fontWeight="medium">
                            ${Number(selectedOrder.total_amount).toFixed(2)}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </Box>

                {selectedOrder.prescription_image && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Prescription
                    </Text>
                    <Image
                      src={selectedOrder.prescription_image || "/placeholder.svg"}
                      alt="Prescription"
                      borderRadius="md"
                      maxH="300px"
                      mx="auto"
                    />
                  </Box>
                )}

                <Flex justify="center">
                  <Button variant="outline" onClick={onViewClose}>
                    Close
                  </Button>
                </Flex>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function OrdersSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="32px" width="120px" mb={1} />
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
            <Skeleton height="40px" width={{ base: "full", sm: "350px" }} />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {["Order ID", "Customer", "Medication", "Date", "Total", "Status", "View"].map((header) => (
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
                        <Skeleton height="16px" width="60px" />
                      </Td>
                      <Td>
                        <Box>
                          <Skeleton height="16px" width="120px" mb={1} />
                          <Skeleton height="14px" width="150px" />
                        </Box>
                      </Td>
                      <Td>
                        <Box>
                          <Skeleton height="16px" width="100px" mb={1} />
                          <Skeleton height="14px" width="60px" />
                        </Box>
                      </Td>
                      <Td>
                        <Skeleton height="16px" width="80px" />
                      </Td>
                      <Td isNumeric>
                        <Skeleton height="16px" width="70px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="70px" borderRadius="full" />
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
