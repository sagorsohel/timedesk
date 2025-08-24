import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWrapper from "@/components/layout-wrapper"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeDesk - Your Digital Workspace",
  description: "Track time, manage projects, take notes, and organize your digital workspace with TimeDesk.",
  
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster position="top-center" richColors   />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>

      </body>
    </html>
  )
}
