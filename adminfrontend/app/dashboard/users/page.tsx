"use client"

import { SetStateAction, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Text,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react"
import { Search, MoreVertical, Plus } from "lucide-react"

// Sample user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
    lastActive: "2023-06-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Pharmacist",
    status: "Active",
    lastActive: "2023-06-02",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2023-06-03",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Customer",
    status: "Inactive",
    lastActive: "2023-05-20",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    role: "Customer",
    status: "Active",
    lastActive: "2023-06-04",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah@example.com",
    role: "Pharmacist",
    status: "Active",
    lastActive: "2023-06-01",
  },
  {
    id: "7",
    name: "David Miller",
    email: "david@example.com",
    role: "Customer",
    status: "Inactive",
    lastActive: "2023-05-15",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    name: string
    email: string
    role: string
    status: string
    lastActive: string
  } | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (user: { id: string; name: string; email: string; role: string; status: string; lastActive: string }) => {
    setSelectedUser(user)
    onOpen()
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="6">
        <Heading>Users</Heading>
        <Button leftIcon={<Plus size={16} />} colorScheme="blue" onClick={onOpen}>
          Add User
        </Button>
      </Flex>

      <Card mb="6">
        <CardBody>
          <InputGroup mb="4">
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray" />
            </InputLeftElement>
            <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last Active</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack spacing="3">
                        <Avatar size="sm" name={user.name} bg="blue.100" color="blue.500" />
                        <Box>
                          <Text fontWeight="medium">{user.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {user.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{user.role}</Td>
                    <Td>
                      <Badge colorScheme={user.status === "Active" ? "green" : "red"}>{user.status}</Badge>
                    </Td>
                    <Td>{user.lastActive}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={16} />}
                          variant="ghost"
                          size="sm"
                          aria-label="Options"
                        />
                        <MenuList>
                          <MenuItem onClick={() => handleEditUser(user)}>Edit</MenuItem>
                          <MenuItem color="red.500" onClick={() => alert(`Delete ${user.name}`)}>
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      <UserFormModal
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
        onSubmit={(data: Record<string, string>) => {
          console.log("Form submitted:", data)
          onClose()
          setSelectedUser(null)
        }}
      />
    </Box>
  )
}

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    role: string
    status: string
    lastActive: string
  } | null
  onSubmit: (data: Record<string, string>) => void
}

function UserFormModal({ isOpen, onClose, user, onSubmit }: UserFormModalProps) {
  const isEditing = !!user

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value as string])
    )
    onSubmit(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{isEditing ? "Edit User" : "Add User"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Name</FormLabel>
              <Input name="name" defaultValue={user?.name || ""} placeholder="Enter name" required />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" defaultValue={user?.email || ""} placeholder="Enter email" required />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Role</FormLabel>
              <Select name="role" defaultValue={user?.role || "Customer"} required>
                <option value="Customer">Customer</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Admin">Admin</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select name="status" defaultValue={user?.status || "Active"} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              {isEditing ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
