"use client"

import type React from "react"

import { ChakraProvider as Provider } from "@chakra-ui/react"
import theme from "@/lib/theme"

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>
}
