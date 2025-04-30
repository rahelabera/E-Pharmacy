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
  Badge,
  useToast,
  useDisclosure,
  Grid,
  HStack,
} from "@chakra-ui/react"
import { Search, Eye, MoreHorizontal, CheckCircle, Truck, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"

type OrderItem = {
  name: string
  price: string
  drug_id: number
  quantity: number
  subtotal: number
}

type Order = {
  id: number
  user_id: number
  items: OrderItem[]
  total_amount: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
  // Additional fields for UI display
  customer?: {
    id: number
    name: string
    email: string
  }
}

type OrdersResponse = {
  data: Order[]
  meta?: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  links?: {
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
  const [meta, setMeta] = useState<OrdersResponse["meta"] | null>(null)

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<OrdersResponse>(`/admin/orders?page=${currentPage}`)

        // Process orders to add customer info (in a real app, this would come from the API)
        const processedOrders = response.data.data.map((order) => ({
          ...order,
          customer: {
            id: order.user_id,
            name: `User ${order.user_id}`, // Placeholder - in a real app, you'd get this from the API
            email: `user${order.user_id}@example.com`, // Placeholder
          },
        }))

        setOrders(processedOrders)
        setFilteredOrders(processedOrders)

        if (response.data.meta) {
          setMeta(response.data.meta)
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
          (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.customer?.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, activeTab, orders])

  const handleUpdateStatus = async (orderId: number, newStatus: Order["status"]) => {
    try {
      // In a real app, you would call your API to update the order status
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })

      // Update the order in the list
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updated_at: new Date().toISOString(),
            }
          : order,
      )

      setOrders(updatedOrders)
      setFilteredOrders(updatedOrders)

      toast({
        title: "Order status updated",
        description: `Order #${orderId} has been marked as ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
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
      default:
        return "gray"
    }
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

  const formatDate = (dateString: string) => {
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
                  const tabValues = ["all", "pending", "processing", "shipped", "delivered"]
                  setActiveTab(tabValues[index])
                }}
              >
                <TabList>
                  <Tab>All Orders</Tab>
                  <Tab>Pending</Tab>
                  <Tab>Processing</Tab>
                  <Tab>Shipped</Tab>
                  <Tab>Delivered</Tab>
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
                    <Th>Date</Th>
                    <Th isNumeric>Total</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={6} color="gray.500">
                        No orders found
                      </Td>
                    </Tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <Tr key={order.id}>
                        <Td>#{order.id}</Td>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{order.customer?.name || `User ${order.user_id}`}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {order.customer?.email || `user${order.user_id}@example.com`}
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
                              <MenuItem icon={<Eye size={16} />} onClick={() => viewOrderDetails(order)}>
                                View Details
                              </MenuItem>
                              <MenuDivider />
                              <MenuList>Update Status</MenuList>
                              {order.status !== "processing" && (
                                <MenuItem
                                  icon={<CheckCircle size={16} color="blue" />}
                                  onClick={() => handleUpdateStatus(order.id, "processing")}
                                >
                                  Mark as Processing
                                </MenuItem>
                              )}
                              {order.status !== "shipped" &&
                                order.status !== "delivered" &&
                                order.status !== "cancelled" && (
                                  <MenuItem
                                    icon={<Truck size={16} color="purple" />}
                                    onClick={() => handleUpdateStatus(order.id, "shipped")}
                                  >
                                    Mark as Shipped
                                  </MenuItem>
                                )}
                              {order.status !== "delivered" && order.status !== "cancelled" && (
                                <MenuItem
                                  icon={<CheckCircle size={16} color="green" />}
                                  onClick={() => handleUpdateStatus(order.id, "delivered")}
                                >
                                  Mark as Delivered
                                </MenuItem>
                              )}
                              {order.status !== "cancelled" && order.status !== "delivered" && (
                                <MenuItem
                                  icon={<XCircle size={16} color="red" />}
                                  onClick={() => handleUpdateStatus(order.id, "cancelled")}
                                >
                                  Cancel Order
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
            {meta && (
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm">
                  Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} orders
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
                    Page {meta.current_page || 1} of {meta.last_page || 1}
                  </Text>
                  <Button
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                    onClick={handleNextPage}
                    isDisabled={!meta.last_page || meta.current_page === meta.last_page}
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
                    <Text fontSize="sm">{selectedOrder.customer?.name || `User ${selectedOrder.user_id}`}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedOrder.customer?.email || `user${selectedOrder.user_id}@example.com`}
                    </Text>
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
                    Order Items
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
                        {selectedOrder.items.map((item, index) => (
                          <Tr key={index}>
                            <Td>{item.name}</Td>
                            <Td textAlign="center">{item.quantity}</Td>
                            <Td isNumeric>${Number(item.price).toFixed(2)}</Td>
                            <Td isNumeric>${item.subtotal.toFixed(2)}</Td>
                          </Tr>
                        ))}
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

                <Flex justify="space-between">
                  <Button variant="outline" onClick={onViewClose}>
                    Close
                  </Button>
                  {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                    <Button
                      colorScheme="green"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "delivered")
                        onViewClose()
                      }}
                      leftIcon={<CheckCircle size={16} />}
                    >
                      Mark as Delivered
                    </Button>
                  )}
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
        <Skeleton height="8" width="32" />
        <Skeleton height="4" width="48" mt={2} />
      </Box>

      <Skeleton height="500px" width="full" />
    </Stack>
  )
}
