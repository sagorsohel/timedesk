"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const time = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const date = dateTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
      

        <div className="ml-auto flex items-center gap-4">
          {/* 🕒 Clock + 📅 Date */}
          <div className="text-right text-sm text-muted-foreground leading-tight">
            <div className="text-primary font-bold">{time}</div>
            <div className="text-xs">{date}</div>
          </div>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
