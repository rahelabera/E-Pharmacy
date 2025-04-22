import type React from "react"
import { ChakraProvider } from "@/components/chakra-provider"
import { AuthProvider } from "@/contexts/auth-context"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Market Pharmacy Admin",
  description: "Admin dashboard for E-Market Pharmacy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
