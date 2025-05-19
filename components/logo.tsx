import { Box, Flex, Text, Icon } from "@chakra-ui/react"
import { FiPlusCircle } from "react-icons/fi"

interface LogoProps {
  size?: "small" | "medium" | "large"
  showText?: boolean
}

export function Logo({ size = "medium", showText = true }: LogoProps) {
  const sizes = {
    small: { icon: "24px", text: "md" },
    medium: { icon: "32px", text: "lg" },
    large: { icon: "48px", text: "xl" },
  }

  return (
    <Flex align="center">
      <Box
        width={sizes[size].icon}
        height={sizes[size].icon}
        bg="blue.500"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="blue.400"
          transform="translateX(-50%)"
          borderRadius="md"
        />
        <Icon as={FiPlusCircle} color="white" fontSize={sizes[size].icon} position="relative" zIndex="1" />
      </Box>
      {showText && (
        <Flex direction="column" ml={2}>
          <Text fontWeight="bold" color="white" fontSize={sizes[size].text} lineHeight="1">
            E-Pharmacy
          </Text>
          <Text fontSize="xs"  color="white" lineHeight="1" mt={1}>
            Admin Portal
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
