"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Flex,
  Skeleton,
  Avatar,
  Button,
  Stack,
} from "@chakra-ui/react"
import api from "@/lib/api"
import { ChevronLeft } from "lucide-react"

type Patient = {
  id: number
  name: string
  username: string
  email: string
  address: string | null
  created_at: string | null
  license_image: string | null
}

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/admin/patients/${id}`)
        if (response.data.status === "success") {
          setPatient(response.data.data)
        }
      } catch (error) {
        setPatient(null)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchPatient()
  }, [id])

  if (isLoading) {
    return (
      <Box py={10}>
        <Skeleton height="40px" width="200px" mb={4} />
        <Skeleton height="32px" width="100%" mb={2} />
        <Skeleton height="32px" width="100%" mb={2} />
        <Skeleton height="32px" width="100%" mb={2} />
      </Box>
    )
  }

  if (!patient) {
    return (
      <Box py={10} textAlign="center">
        <Text color="red.500">Patient not found.</Text>
        <Button leftIcon={<ChevronLeft />} mt={4} onClick={() => router.push("/dashboard/patients")}>
          Back to Patients
        </Button>
      </Box>
    )
  }

  return (
    <Box py={6} maxW="400px" mx="auto">
      <Button
        leftIcon={<ChevronLeft />}
        mb={4}
        onClick={() => router.push("/dashboard/patients")}
        variant="ghost"
        colorScheme="blue"
      >
        Back to Patients
      </Button>
      <Card>
        <CardHeader>
          <Flex align="center" gap={4}>
            <Avatar
              size="xl"
              name={patient.name}
              src={patient.license_image || undefined}
              bg="blue.100"
              color="blue.600"
            />
            <Box>
              <Heading size="md">{patient.name}</Heading>
              <Text color="gray.600">@{patient.username}</Text>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack spacing={3}>
            <Text><b>Email:</b> {patient.email}</Text>
            <Text><b>Address:</b> {patient.address || "-"}</Text>
            <Text>
              <b>Joined:</b>{" "}
              {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "-"}
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  )
}