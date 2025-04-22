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
  Grid, // Added Grid import
} from "@chakra-ui/react"
import { Search, Eye, MoreHorizontal, CheckCircle, Truck, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Order = {
  id: number
  customer: {
    id: number
    name: string
    email: string
  }
  items: {
    id: number
    drug_name: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
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

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockOrders: Order[] = [
          {
            id: 1001,
            customer: {
              id: 5,
              name: "John Doe",
              email: "john@example.com",
            },
            items: [
              {
                id: 1,
                drug_name: "Amoxicillin",
                quantity: 2,
                price: 15.99,
              },
              {
                id: 3,
                drug_name: "Metformin",
                quantity: 1,
                price: 8.75,
              },
            ],
            total: 40.73,
            status: "delivered",
            created_at: "2023-05-15",
            updated_at: "2023-05-17",
          },
          {
            id: 1002,
            customer: {
              id: 6,
              name: "Jane Smith",
              email: "jane@example.com",
            },
            items: [
              {
                id: 2,
                drug_name: "Lisinopril",
                quantity: 1,
                price: 12.5,
              },
            ],
            total: 12.5,
            status: "processing",
            created_at: "2023-05-16",
            updated_at: "2023-05-16",
          },
          {
            id: 1003,
            customer: {
              id: 7,
              name: "Robert Johnson",
              email: "robert@example.com",
            },
            items: [
              {
                id: 4,
                drug_name: "Atorvastatin",
                quantity: 1,
                price: 22.99,
              },
              {
                id: 6,
                drug_name: "Sertraline",
                quantity: 1,
                price: 18.25,
              },
            ],
            total: 41.24,
            status: "shipped",
            created_at: "2023-05-14",
            updated_at: "2023-05-15",
          },
          {
            id: 1004,
            customer: {
              id: 8,
              name: "Emily Davis",
              email: "emily@example.com",
            },
            items: [
              {
                id: 5,
                drug_name: "Albuterol",
                quantity: 1,
                price: 25.5,
              },
            ],
            total: 25.5,
            status: "pending",
            created_at: "2023-05-17",
            updated_at: "2023-05-17",
          },
          {
            id: 1005,
            customer: {
              id: 9,
              name: "Michael Brown",
              email: "michael@example.com",
            },
            items: [
              {
                id: 1,
                drug_name: "Amoxicillin",
                quantity: 1,
                price: 15.99,
              },
            ],
            total: 15.99,
            status: "cancelled",
            created_at: "2023-05-13",
            updated_at: "2023-05-14",
          },
        ]

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [token])

  useEffect(() => {
    // Filter orders based on search term and active tab
    let filtered = orders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.drug_name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, activeTab, orders])

  const handleUpdateStatus = (orderId: number, newStatus: Order["status"]) => {
    // In a real app, you would call your API to update the order status
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
            updated_at: new Date().toISOString().split("T")[0],
          }
        : order,
    )

    setOrders(updatedOrders)

    toast({
      title: "Order status updated",
      description: `Order #${orderId} has been marked as ${newStatus}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
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
                            <Text fontWeight="medium">{order.customer.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {order.customer.email}
                            </Text>
                          </Box>
                        </Td>
                        <Td>{order.created_at}</Td>
                        <Td isNumeric>${order.total.toFixed(2)}</Td>
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
                    <Text fontSize="sm">{selectedOrder.customer.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedOrder.customer.email}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Order Info
                    </Text>
                    <Text fontSize="sm">Date: {selectedOrder.created_at}</Text>
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
                        {selectedOrder.items.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.drug_name}</Td>
                            <Td textAlign="center">{item.quantity}</Td>
                            <Td isNumeric>${item.price.toFixed(2)}</Td>
                            <Td isNumeric>${(item.price * item.quantity).toFixed(2)}</Td>
                          </Tr>
                        ))}
                        <Tr>
                          <Td colSpan={3} textAlign="right" fontWeight="medium">
                            Total:
                          </Td>
                          <Td isNumeric fontWeight="medium">
                            ${selectedOrder.total.toFixed(2)}
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
