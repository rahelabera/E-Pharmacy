"use client"

import {
  Box,
  SimpleGrid,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  Stat,
  CardBody,
  Heading,
  Text,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"

// Sample data for charts
const salesData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 2700 },
  { name: "Jun", total: 3000 },
]

const userActivityData = [
  { name: "Mon", active: 120 },
  { name: "Tue", active: 145 },
  { name: "Wed", active: 135 },
  { name: "Thu", active: 160 },
  { name: "Fri", active: 180 },
  { name: "Sat", active: 90 },
  { name: "Sun", active: 75 },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    status: "Completed",
    date: "2023-06-01",
    total: "$125.99",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    status: "Processing",
    date: "2023-06-02",
    total: "$89.50",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    status: "Pending",
    date: "2023-06-03",
    total: "$245.75",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    status: "Completed",
    date: "2023-06-03",
    total: "$32.20",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    status: "Cancelled",
    date: "2023-06-04",
    total: "$112.30",
  },
]



export default function DashboardPage() {
  return (
    <Box>
      <Heading mb="6">Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="6">
        <StatCard title="Total Users" value="2,543" change="+12.5%" icon={Users} color="blue" />
        <StatCard title="Total Orders" value="1,345" change="+8.2%" icon={ShoppingCart} color="green" />
        <StatCard title="Revenue" value="$45,678" change="+23.1%" icon={DollarSign} color="purple" />
        <StatCard title="Growth" value="15.3%" change="+4.5%" icon={TrendingUp} color="orange" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="6" mb="6">
        <Card>
          <CardBody>
            <Heading size="md" mb="4">
              Monthly Sales
            </Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4299E1" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb="4">
              User Activity
            </Heading>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#805AD5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Tabs>
            <TabList>
              <Tab>Recent Orders</Tab>
              <Tab>Pending Prescriptions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px="0">
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Customer</Th>
                        <Th>Date</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentOrders.map((order) => (
                        <Tr key={order.id}>
                          <Td fontWeight="medium">{order.id}</Td>
                          <Td>{order.customer}</Td>
                          <Td>{order.date}</Td>
                          <Td>
                            <OrderStatusBadge status={order.status} />
                          </Td>
                          <Td isNumeric>{order.total}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              <TabPanel>
                <Text>No pending prescriptions to verify.</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  )
}

function StatCard({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardBody>
        <Flex justifyContent="space-between">
          <Box>
            <Stat>
              <StatLabel color="gray.500">{title}</StatLabel>
              <StatNumber fontSize="2xl">{value}</StatNumber>
              <StatHelpText color={change.startsWith("+") ? "green.500" : "red.500"}>{change}</StatHelpText>
            </Stat>
          </Box>
          <Flex alignItems="center" justifyContent="center" h="12" w="12" rounded="full" bg={`${color}.100`}>
            <Icon as={icon} color={`${color}.500`} boxSize="5" />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let color
  switch (status) {
    case "Completed":
      color = "green"
      break
    case "Processing":
      color = "blue"
      break
    case "Pending":
      color = "orange"
      break
    case "Cancelled":
      color = "red"
      break
    default:
      color = "gray"
  }



  return <Badge colorScheme={color}>{status}</Badge>
}
