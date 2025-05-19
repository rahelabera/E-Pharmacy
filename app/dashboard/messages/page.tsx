"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  Skeleton,
  Stack,
  Text,
  Avatar,
  AvatarBadge,
  useToast,
  Grid, // Added Grid import
} from "@chakra-ui/react"
import { Search, Send } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type Contact = {
  id: number
  name: string
  email: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  online: boolean
}

type Message = {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: string
  read: boolean
}

export default function MessagesPage() {
  const { user, token } = useAuth()
  const toast = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchContacts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockContacts: Contact[] = [
          {
            id: 5,
            name: "John Doe",
            email: "john@example.com",
            avatar: "",
            lastMessage: "I need a refill for my prescription",
            lastMessageTime: "10:30 AM",
            unread: 2,
            online: true,
          },
          {
            id: 6,
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "",
            lastMessage: "Is my order ready for pickup?",
            lastMessageTime: "Yesterday",
            unread: 0,
            online: false,
          },
          {
            id: 7,
            name: "Robert Johnson",
            email: "robert@example.com",
            avatar: "",
            lastMessage: "Thank you for your help",
            lastMessageTime: "Yesterday",
            unread: 0,
            online: true,
          },
          {
            id: 8,
            name: "Emily Davis",
            email: "emily@example.com",
            avatar: "",
            lastMessage: "Do you have this medication in stock?",
            lastMessageTime: "Monday",
            unread: 0,
            online: false,
          },
          {
            id: 9,
            name: "Michael Brown",
            email: "michael@example.com",
            avatar: "",
            lastMessage: "I have a question about my prescription",
            lastMessageTime: "Sunday",
            unread: 1,
            online: false,
          },
        ]

        setContacts(mockContacts)
        setFilteredContacts(mockContacts)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [token])

  useEffect(() => {
    // Filter contacts based on search term
    if (searchTerm) {
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchTerm, contacts])

  useEffect(() => {
    // Fetch messages for selected contact
    if (selectedContact) {
      // In a real app, you would fetch messages from your API
      // For now, we'll use mock  {
      // In a real app, you would fetch messages from your API
      // For now, we'll use mock data
      const fetchMessages = async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          const mockMessages: Message[] = [
            {
              id: 1,
              senderId: selectedContact.id,
              receiverId: user?.id || 0,
              content: "Hello, I need some help with my prescription.",
              timestamp: "10:15 AM",
              read: true,
            },
            {
              id: 2,
              senderId: user?.id || 0,
              receiverId: selectedContact.id,
              content: "Of course, how can I help you today?",
              timestamp: "10:17 AM",
              read: true,
            },
            {
              id: 3,
              senderId: selectedContact.id,
              receiverId: user?.id || 0,
              content: "I need a refill for my blood pressure medication.",
              timestamp: "10:20 AM",
              read: true,
            },
            {
              id: 4,
              senderId: user?.id || 0,
              receiverId: selectedContact.id,
              content: "I'll check your records. Do you have a prescription for it?",
              timestamp: "10:22 AM",
              read: true,
            },
            {
              id: 5,
              senderId: selectedContact.id,
              receiverId: user?.id || 0,
              content: "Yes, Dr. Smith gave me a prescription last month.",
              timestamp: "10:25 AM",
              read: true,
            },
            {
              id: 6,
              senderId: selectedContact.id,
              receiverId: user?.id || 0,
              content: "I need a refill for my prescription",
              timestamp: "10:30 AM",
              read: false,
            },
          ]

          setMessages(mockMessages)

          // Mark messages as read
          const updatedContacts = contacts.map((contact) =>
            contact.id === selectedContact.id ? { ...contact, unread: 0 } : contact,
          )
          setContacts(updatedContacts)
          setFilteredContacts(updatedContacts)
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }

      fetchMessages()
    }
  }, [selectedContact, user, contacts])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedContact) return

    // In a real app, you would send this message to your API
    const newMsg: Message = {
      id: messages.length + 1,
      senderId: user?.id || 0,
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Update last message in contacts
    const updatedContacts = contacts.map((contact) =>
      contact.id === selectedContact.id
        ? {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: "Just now",
          }
        : contact,
    )
    setContacts(updatedContacts)
    setFilteredContacts(updatedContacts)

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  if (isLoading) {
    return <MessagesSkeleton />
  }

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading as="h1" size="lg" mb={1}>
            Messages
          </Heading>
          <Text color="gray.600">Communicate with patients and other pharmacists</Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
          <Card>
            <CardHeader pb={3}>
              <Box position="relative" w="full">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search size={16} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="search"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Box>
            </CardHeader>
            <CardBody p={0}>
              <Box maxH="calc(100vh - 300px)" overflowY="auto">
                {filteredContacts.length === 0 ? (
                  <Box py={6} textAlign="center" color="gray.500">
                    No contacts found
                  </Box>
                ) : (
                  <Stack divider={<Box borderBottomWidth="1px" />}>
                    {filteredContacts.map((contact) => (
                      <Box
                        key={contact.id}
                        p={3}
                        cursor="pointer"
                        bg={selectedContact?.id === contact.id ? "blue.50" : undefined}
                        _hover={{ bg: "blue.50" }}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Flex gap={3}>
                          <Box position="relative">
                            <Avatar name={contact.name} bg="blue.100" color="blue.600">
                              {contact.online && <AvatarBadge boxSize="1em" bg="green.500" />}
                            </Avatar>
                          </Box>
                          <Box flex="1" minW={0}>
                            <Flex justify="space-between" align="baseline">
                              <Text fontWeight="medium" noOfLines={1}>
                                {contact.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {contact.lastMessageTime}
                              </Text>
                            </Flex>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {contact.lastMessage}
                            </Text>
                          </Box>
                          {contact.unread > 0 && (
                            <Flex
                              align="center"
                              justify="center"
                              boxSize={5}
                              borderRadius="full"
                              bg="blue.500"
                              color="white"
                              fontSize="xs"
                            >
                              {contact.unread}
                            </Flex>
                          )}
                        </Flex>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </CardBody>
          </Card>

          <Card display="flex" flexDirection="column">
            {selectedContact ? (
              <>
                <CardHeader pb={3} borderBottomWidth="1px">
                  <Flex align="center" gap={3}>
                    <Avatar name={selectedContact.name} bg="blue.100" color="blue.600">
                      {selectedContact.online && <AvatarBadge boxSize="1em" bg="green.500" />}
                    </Avatar>
                    <Box>
                      <Heading size="md">{selectedContact.name}</Heading>
                      <Text fontSize="sm" color="gray.500">
                        {selectedContact.email}
                      </Text>
                    </Box>
                  </Flex>
                </CardHeader>
                <CardBody p={0} display="flex" flexDirection="column" flex="1">
                  <Box flex="1" p={4} overflowY="auto" maxH="calc(100vh - 400px)">
                    {messages.map((message) => (
                      <Box
                        key={message.id}
                        mb={4}
                        maxW="80%"
                        ml={message.senderId === user?.id ? "auto" : undefined}
                        mr={message.senderId !== user?.id ? "auto" : undefined}
                      >
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={message.senderId === user?.id ? "blue.500" : "gray.100"}
                          color={message.senderId === user?.id ? "white" : "gray.800"}
                        >
                          {message.content}
                        </Box>
                        <Text
                          fontSize="xs"
                          mt={1}
                          textAlign={message.senderId === user?.id ? "right" : "left"}
                          color="gray.500"
                        >
                          {message.timestamp}
                        </Text>
                      </Box>
                    ))}
                    <Box ref={messagesEndRef} />
                  </Box>
                  <Box p={4} borderTopWidth="1px">
                    <form onSubmit={handleSendMessage}>
                      <Flex gap={2}>
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          flex="1"
                        />
                        <Button type="submit" colorScheme="blue" leftIcon={<Send size={16} />}>
                          <Text srOnly>Send</Text>
                        </Button>
                      </Flex>
                    </form>
                  </Box>
                </CardBody>
              </>
            ) : (
              <Flex flex="1" direction="column" align="center" justify="center" p={6} textAlign="center">
                <Flex align="center" justify="center" bg="blue.100" borderRadius="full" p={6} mb={4}>
                  <Send size={32} color="#3b82f6" />
                </Flex>
                <Heading size="md" mb={2}>
                  Select a conversation
                </Heading>
                <Text color="gray.500">Choose a contact from the list to start messaging</Text>
              </Flex>
            )}
          </Card>
        </Grid>
      </Stack>
    </Box>
  )
}

function MessagesSkeleton() {
  return (
    <Stack spacing={6}>
      <Box>
        <Skeleton height="32px" width="120px" mb={1} />
        <Skeleton height="18px" width="350px" />
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
        <Card>
          <CardHeader pb={3}>
            <Skeleton height="40px" width="full" />
          </CardHeader>
          <CardBody p={0}>
            <Box maxH="calc(100vh - 300px)" overflowY="auto">
              <Stack divider={<Box borderBottomWidth="1px" />}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Box key={i} p={3}>
                      <Flex gap={3}>
                        <Skeleton height="40px" width="40px" borderRadius="full" />
                        <Box flex="1" minW={0}>
                          <Flex justify="space-between" align="baseline">
                            <Skeleton height="16px" width="100px" />
                            <Skeleton height="12px" width="60px" />
                          </Flex>
                          <Skeleton height="14px" width="full" mt={1} />
                        </Box>
                      </Flex>
                    </Box>
                  ))}
              </Stack>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardHeader pb={3} borderBottomWidth="1px">
            <Flex align="center" gap={3}>
              <Skeleton height="40px" width="40px" borderRadius="full" />
              <Box>
                <Skeleton height="18px" width="120px" mb={1} />
                <Skeleton height="14px" width="150px" />
              </Box>
            </Flex>
          </CardHeader>
          <CardBody p={0} display="flex" flexDirection="column" flex="1">
            <Box flex="1" p={4} overflowY="auto" maxH="calc(100vh - 400px)">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Box
                    key={i}
                    mb={4}
                    maxW="80%"
                    ml={i % 2 === 0 ? "auto" : undefined}
                    mr={i % 2 !== 0 ? "auto" : undefined}
                  >
                    <Skeleton height="60px" width="full" borderRadius="lg" bg={i % 2 === 0 ? "blue.500" : "gray.100"} />
                    <Skeleton height="12px" width="60px" mt={1} ml={i % 2 === 0 ? "auto" : undefined} />
                  </Box>
                ))}
            </Box>
            <Box p={4} borderTopWidth="1px">
              <Flex gap={2}>
                <Skeleton height="40px" width="full" />
                <Skeleton height="40px" width="40px" />
              </Flex>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  )
}
