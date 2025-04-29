import type React from "react"
import type { Metadata } from "next"
import { ChakraProvider } from "@/components/chakra-provider"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pharmacy Admin Dashboard",
  description: "Admin dashboard for pharmacy management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}
