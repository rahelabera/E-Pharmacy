"use client"

import { useState, useEffect, type ChangeEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  Textarea,
  VStack,
  useToast,
  FormErrorMessage,
  Avatar,
  HStack,
  IconButton,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Progress,
  Tooltip,
  Badge,
  Icon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react"
import { FiArrowLeft, FiUpload, FiX, FiSave, FiUser, FiInfo, FiCheck, FiTrash2, FiLock } from "react-icons/fi"
import api from "@/lib/api"

type ProfileData = {
  id: number
  name: string
  username: string
  email: string
  profile_image: string | null
  cloudinary_public_id: string | null
  is_role: number
  phone: string | null
  address: string | null
  status: string
  pharmacy_name: string | null
  created_at: string
  updated_at: string | null
  license_image: string | null
  tin_image: string | null
  account_number: string | null
  bank_name: string | null
}

// Create a custom event to notify other components when profile is updated
const dispatchProfileUpdatedEvent = () => {
  console.log("Dispatching profileUpdated event")
  const event = new Event("profileUpdated")
  window.dispatchEvent(event)
}

export default function EditProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    pharmacy_name: "",
    account_number: "",
    bank_name: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)

  // Change password modal state
  const { isOpen: isChangePasswordOpen, onOpen: onChangePasswordOpen, onClose: onChangePasswordClose } = useDisclosure()
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  // Confirmation dialog for profile save
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Delete confirmation dialog for profile image
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const deleteRef = useRef<HTMLButtonElement>(null)

  // Password modal ref
  const passwordCancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await api.get("https://e-pharmacybackend-production.up.railway.app/api/profile")
        console.log("Profile response:", response.data)

        if (response.data.status === "success") {
          const profileData = response.data.data
          setProfile(profileData)

          // Initialize form data
          setFormData({
            name: profileData.name || "",
            username: profileData.username || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            pharmacy_name: profileData.pharmacy_name || "",
            account_number: profileData.account_number || "",
            bank_name: profileData.bank_name || "",
          })

          // Set profile image preview if exists
          if (profileData.profile_image) {
            setProfileImagePreview(profileData.profile_image)
          }

          // Calculate initial form progress
          calculateFormProgress()
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile data",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast])

  // Calculate form completion progress
  const calculateFormProgress = () => {
    const requiredFields = ["name", "username", "email"]
    const optionalFields = ["phone", "address", "pharmacy_name", "account_number", "bank_name"]

    let filledRequired = 0
    let filledOptional = 0

    requiredFields.forEach((field) => {
      if (formData[field as keyof typeof formData]?.trim()) filledRequired++
    })

    optionalFields.forEach((field) => {
      if (formData[field as keyof typeof formData]?.trim()) filledOptional++
    })

    const requiredWeight = 70
    const optionalWeight = 30

    const requiredProgress = (filledRequired / requiredFields.length) * requiredWeight
    const optionalProgress = (filledOptional / optionalFields.length) * optionalWeight

    setFormProgress(Math.round(requiredProgress + optionalProgress))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    setTimeout(calculateFormProgress, 100)
  }

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate image type and size
      const validTypes = ["image/jpeg", "image/png"]
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPEG or PNG image.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return
      }
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Image size must be less than 5MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return
      }
      setProfileImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearProfileImage = () => {
    setProfileImage(null)
    setProfileImagePreview(profile?.profile_image || null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.current_password.trim()) {
      newErrors.current_password = "Current password is required"
    }

    if (!passwordData.password.trim()) {
      newErrors.password = "New password is required"
    } else if (passwordData.password.length < 8) {
      newErrors.password = "New password must be at least 8 characters"
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadProfileImage = async () => {
    if (!profileImage) return null

    setIsUploading(true)
    try {
      // Try to check and delete existing image, but ignore 404 errors
      try {
        const imageRes = await api.get("https://e-pharmacybackend-production.up.railway.app/api/image")
        if (imageRes.data.image?.url) {
          await api.delete("https://e-pharmacybackend-production.up.railway.app/api/image")
        }
      } catch (err: any) {
        // Ignore 404 (no image found)
        if (err.response?.status !== 404) throw err
      }

      // Upload new image
      const imageFormData = new FormData()
      imageFormData.append("image", profileImage)

      const response = await api.post(
        "https://e-pharmacybackend-production.up.railway.app/api/image",
        imageFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.data.message === "Profile picture updated successfully") {
        dispatchProfileUpdatedEvent()
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        setProfileImagePreview(response.data.image.url)
        return response.data.image.url
      } else {
        throw new Error("Failed to upload profile picture")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const deleteProfileImage = async () => {
    setIsDeleting(true)
    try {
      const response = await api.delete("https://e-pharmacybackend-production.up.railway.app/api/image")
      console.log("Image delete response:", response.data)

      setProfileImage(null)
      setProfileImagePreview(null)

      dispatchProfileUpdatedEvent()

      toast({
        title: "Success",
        description: "Profile picture deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      // Refresh profile data
      const profileResponse = await api.get("https://e-pharmacybackend-production.up.railway.app/api/profile")
      if (profileResponse.data.status === "success") {
        setProfile(profileResponse.data.data)
        if (profileResponse.data.data.profile_image) {
          setProfileImagePreview(profileResponse.data.data.profile_image)
        }
      }
    } catch (error: any) {
      console.error("Error deleting profile image:", error)
      toast({
        title: "Error",
        description: "Failed to delete profile picture",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      onDeleteClose()
    }
  }

  const handleSaveChanges = async () => {
    onClose()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsSaving(true)
    try {
      // Handle profile image upload if changed
      if (profileImage) {
        await uploadProfileImage()
      }

      // Update text fields with raw JSON
      const profileData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== undefined && value !== "")
      )

      const response = await api.put(
        "https://e-pharmacybackend-production.up.railway.app/api/profile/update",
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Update response:", response.data)

      if (response.data.status === "success") {
        dispatchProfileUpdatedEvent()

        // Refresh profile data
        const profileResponse = await api.get("https://e-pharmacybackend-production.up.railway.app/api/profile")
        if (profileResponse.data.status === "success") {
          setProfile(profileResponse.data.data)
          const profileData = profileResponse.data.data
          setFormData({
            name: profileData.name || "",
            username: profileData.username || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            pharmacy_name: profileData.pharmacy_name || "",
            account_number: profileData.account_number || "",
            bank_name: profileData.bank_name || "",
          })
          if (profileData.profile_image) {
            setProfileImagePreview(profileData.profile_image)
          }
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
          icon: <Icon as={FiCheck} />,
        })

        router.push("/dashboard/profile")
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const formattedErrors: Record<string, string> = {}
        Object.entries(apiErrors).forEach(([key, value]) => {
          formattedErrors[key] = Array.isArray(value) ? value[0] : (value as string)
        })
        setErrors(formattedErrors)
      }
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the password form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsPasswordSaving(true)
    try {
      // Use the correct endpoint and method for changing password
      const response = await api.put(
        "https://e-pharmacybackend-production.up.railway.app/api/password/change",
        {
          current_password: passwordData.current_password,
          password: passwordData.password,
          password_confirmation: passwordData.password_confirmation,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      console.log("Password change response:", response.data)

      if (response.data.status === "success") {
        toast({
          title: "Success",
          description: "Password changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          icon: <Icon as={FiCheck} />,
        })
        setPasswordData({
          current_password: "",
          password: "",
          password_confirmation: "",
        })
        onChangePasswordClose()
      } else {
        throw new Error(response.data.message || "Failed to change password")
      }
    } catch (error: any) {
      console.error("Password change error:", error.response?.data || error.message)
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const formattedErrors: Record<string, string> = {}
        Object.entries(apiErrors).forEach(([key, value]) => {
          formattedErrors[key] = Array.isArray(value) ? value[0] : (value as string)
        })
        setPasswordErrors(formattedErrors)
      }
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsPasswordSaving(false)
    }
  }

  if (isLoading) {
    return <ProfileEditSkeleton />
  }

  return (
    <Container maxW="container.lg" py={6}>
      <Card mb={6} boxShadow="lg" borderRadius="xl">
        <CardHeader bg="blue.500" borderTopRadius="xl" color="white">
          <Flex justify="space-between" align="center">
            <HStack>
              <IconButton
                aria-label="Back to profile"
                icon={<FiArrowLeft />}
                variant="ghost"
                color="white"
                _hover={{ bg: "blue.600" }}
                onClick={() => router.push("/dashboard/profile")}
              />
              <Heading size="lg">Edit Profile</Heading>
            </HStack>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={8} align="stretch">
            {/* Profile Image */}
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={8}
              bg="blue.50"
              p={6}
              borderRadius="md"
              boxShadow="sm"
            >
              <Box position="relative" minW="150px" p={2}>
                <Avatar
                  size="2xl"
                  name={formData.name}
                  src={profileImagePreview || undefined}
                  borderWidth={3}
                  borderColor="blue.500"
                  bg="blue.100"
                />
                {profileImagePreview && profileImage && (
                  <IconButton
                    aria-label="Clear image"
                    icon={<FiX />}
                    size="sm"
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="2px"
                    right="2px"
                    onClick={clearProfileImage}
                    boxShadow="sm"
                  />
                )}
                {profileImagePreview && !profileImage && (
                  <Tooltip label="Delete Image" hasArrow>
                    <IconButton
                      aria-label="Delete image"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      borderRadius="full"
                      position="absolute"
                      top="2px"
                      right="2px"
                      boxShadow="sm"
                      _hover={{ bg: "red.100", color: "red.600" }}
                      onClick={onDeleteOpen}
                      isDisabled={isDeleting || isUploading}
                    />
                  </Tooltip>
                )}
                {isUploading && (
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.300"
                    borderRadius="full"
                    justify="center"
                    align="center"
                  >
                    <Spinner color="blue.500" size="lg" />
                  </Flex>
                )}
              </Box>

              <VStack align="flex-start" spacing={4}>
                <Heading size="md" color="blue.700">
                  <Icon as={FiUser} mr={2} />
                  Profile Picture
                </Heading>
                <Text color="gray.600">Upload JPEG/PNG file.</Text>
                <HStack spacing={3}>
                  <FormControl>
                    <Button
                      leftIcon={<FiUpload />}
                      colorScheme="blue"
                      variant="outline"
                      as="label"
                      htmlFor="profile-image"
                      cursor="pointer"
                      isDisabled={isUploading}
                    >
                      {profileImagePreview ? "Change" : "Upload"}
                    </Button>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleProfileImageChange}
                      display="none"
                    />
                  </FormControl>
                  {profileImagePreview && !profileImage && (
                    <Button
                      leftIcon={<FiTrash2 />}
                      colorScheme="red"
                      variant="outline"
                      onClick={onDeleteOpen}
                      isDisabled={isDeleting || isUploading}
                    >
                      Delete
                    </Button>
                  )}
                </HStack>
                {profileImage && (
                  <Badge colorScheme="blue" p={2} borderRadius="md">
                    New image selected. Click "Save Changes" to upload.
                  </Badge>
                )}
              </VStack>
            </Flex>

            <Divider />

            {/* Basic Information */}
            <Box>
              <Heading
                size="md"
                mb={4}
                color="blue.700"
                p={3}
                bg="blue.50"
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiInfo} mr={2} />
                Basic Information
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel fontWeight="medium">Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.username}>
                  <FormLabel fontWeight="medium">Username</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="medium">Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.phone}>
                  <FormLabel fontWeight="medium">Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Address */}
            <Box>
              <FormControl isInvalid={!!errors.address}>
                <FormLabel fontWeight="medium">Address</FormLabel>
                <Textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  rows={3}
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                />
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>
            </Box>

            {/* Change Password */}
            <Box>
              <Heading
                size="md"
                mb={4}
                color="blue.700"
                p={3}
                bg="blue.50"
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiLock} mr={2} />
                Change Password
              </Heading>
              <Button
                leftIcon={<FiLock />}
                colorScheme="blue"
                variant="outline"
                onClick={onChangePasswordOpen}
                width={{ base: "full", md: "auto" }}
              >
                Change Password
              </Button>
            </Box>

            <Divider />

            <Flex justify="space-between" mt={4}>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/profile")}
                leftIcon={<FiArrowLeft />}
                _hover={{ bg: "gray.100" }}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" isLoading={isSaving} onClick={onOpen} leftIcon={<FiSave />} boxShadow="md">
                Save Changes
              </Button>
            </Flex>
          </VStack>
        </CardBody>
      </Card>

      {/* Confirmation Dialog for Profile Save */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" boxShadow="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" bg="blue.50" borderTopRadius="xl" color="blue.700">
              <HStack>
                <Icon as={FiSave} />
                <Text>Save Profile Changes</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody py={4}>
              <VStack align="start" spacing={4}>
                <Text>Are you sure you want to save these changes to your profile?</Text>
                {profileImage && (
                  <HStack bg="blue.50" p={2} borderRadius="md" width="full">
                    <Icon as={FiInfo} color="blue.500" />
                    <Text fontSize="sm">Your new profile picture will be uploaded.</Text>
                  </HStack>
                )}
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSaveChanges} ml={3} isLoading={isSaving} leftIcon={<FiCheck />}>
                Save Changes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Image Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={deleteRef} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" boxShadow="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" bg="red.50" borderTopRadius="xl" color="red.700">
              <HStack>
                <Icon as={FiTrash2} />
                <Text>Delete Profile Picture</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody py={4}>
              <Text>Are you sure you want to delete your profile picture? This action cannot be undone.</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteRef} onClick={onDeleteClose} variant="outline">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteProfileImage}
                ml={3}
                isLoading={isDeleting}
                leftIcon={<FiTrash2 />}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Change Password Modal */}
      <Modal isOpen={isChangePasswordOpen} onClose={onChangePasswordClose}>
        <ModalOverlay />
        <ModalContent borderRadius="xl" boxShadow="xl">
          <ModalHeader bg="blue.50" borderTopRadius="xl" color="blue.700">
            <HStack>
              <Icon as={FiLock} />
              <Text>Change Password</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            <ModalBody py={4}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!passwordErrors.current_password}>
                  <FormLabel fontWeight="medium">Current Password</FormLabel>
                  <Input
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{passwordErrors.current_password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!passwordErrors.password}>
                  <FormLabel fontWeight="medium">New Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={passwordData.password}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{passwordErrors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!passwordErrors.password_confirmation}>
                  <FormLabel fontWeight="medium">Confirm New Password</FormLabel>
                  <Input
                    name="password_confirmation"
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm new password"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" }}
                  />
                  <FormErrorMessage>{passwordErrors.password_confirmation}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                ref={passwordCancelRef}
                onClick={onChangePasswordClose}
                variant="outline"
                mr={3}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isPasswordSaving}
                leftIcon={<FiCheck />}
              >
                Change Password
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  )
}

function ProfileEditSkeleton() {
  return (
    <Container maxW="container.lg" py={6}>
      <Card mb={6} boxShadow="lg" borderRadius="xl">
        <CardHeader bg="blue.500" borderTopRadius="xl">
          <Flex justify="space-between" align="center">
            <Skeleton height="30px" width="150px" />
            <Skeleton height="40px" width="120px" />
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={8} align="stretch">
            <Flex direction={{ base: "column", md: "row" }} align="center" gap={8} bg="gray.50" p={6} borderRadius="md">
              <Skeleton height="150px" width="150px" borderRadius="full" />
              <VStack align="flex-start" spacing={4} flex="1">
                <Skeleton height="24px" width="150px" />
                <Skeleton height="16px" width="300px" />
                <Skeleton height="40px" width="150px" />
              </VStack>
            </Flex>

            <Divider />

            <Box>
              <Skeleton height="24px" width="200px" mb={4} />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Skeleton height="80px" />
                <Skeleton height="80px" />
                <Skeleton height="80px" />
                <Skeleton height="80px" />
              </SimpleGrid>
            </Box>

            <Box>
              <Skeleton height="24px" width="200px" mb={4} />
              <Skeleton height="120px" />
            </Box>

            <Flex justify="space-between" mt={4}>
              <Skeleton height="40px" width="100px" />
              <Skeleton height="40px" width="120px" />
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}