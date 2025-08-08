'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export default function AuthSuccess() {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const userString = urlParams.get("user")

    if (token && userString) {
      localStorage.setItem("token", token)

      try {
        const user = JSON.parse(decodeURIComponent(userString))
        localStorage.setItem("user", JSON.stringify(user))
      } catch (e) {
        console.error("Failed to parse user data", e)
      }

      router.push("/admin/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted">
    <Card className="w-[350px] text-center">
      <CardContent className="flex flex-col items-center gap-4 py-10">
        <Spinner />
        <h2 className="text-xl font-semibold">Logging you in via GitHub...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we finish signing you in.
        </p>
      </CardContent>
    </Card>
  </div>
  )
}
