import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    blue: {
      50: "#e6f1ff",
      100: "#cce3ff",
      200: "#99c7ff",
      300: "#66abff",
      400: "#338fff",
      500: "#0073ff", // Primary blue
      600: "#005cd9",
      700: "#0044b3",
      800: "#002d8c",
      900: "#001766",
    },
    brand: {
      primary: "#0073ff",
    },
  },
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "blue.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "blue.500",
          color: "white",
          _hover: {
            bg: "blue.600",
          },
        },
        outline: {
          borderColor: "blue.500",
          color: "blue.500",
        },
        ghost: {
          color: "gray.600",
          _hover: {
            bg: "gray.100",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "white",
          borderRadius: "lg",
          boxShadow: "md",
          overflow: "hidden",
        },
      },
    },
  },
})

export default theme
