"use client"

import type React from "react"

import { ChakraProvider as ChakraProviderBase } from "@chakra-ui/react"
import { CacheProvider } from "@chakra-ui/next-js"
import theme from "@/lib/theme"

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProviderBase theme={theme}>{children}</ChakraProviderBase>
    </CacheProvider>
  )
}
