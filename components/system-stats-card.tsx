"use client"

import { useEffect, useState } from "react"
import { IconCpu, IconTrendingUp, IconTrendingDown, IconClock, IconDatabase } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SystemStatsCards() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/system-info")
        .then(res => res.json())
        .then(setStats)
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000) // refresh every 2s
    return () => clearInterval(interval)
  }, [])

  if (!stats) return <p className="p-4">Loading system stats...</p>

  const memoryUsagePercent = ((stats.memory.used / stats.memory.total) * 100).toFixed(1)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      
      {/* CPU Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>CPU Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.load}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={stats.load > 50 ? "text-red-600 border-red-500" : "text-green-600 border-green-500"}>
              {stats.load > 50 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.load > 50 ? "High" : "Low"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            <IconCpu className="size-4" /> {stats.cpu.brand} ({stats.cpu.speed} GHz)
          </div>
          <div className="text-muted-foreground">
            {stats.cpu.cores} Cores / {stats.cpu.processors} Threads
          </div>
        </CardFooter>
      </Card>

      {/* Memory Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Memory Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {memoryUsagePercent}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={Number(memoryUsagePercent) > 70 ? "text-red-600 border-red-500" : "text-green-600 border-green-500"}>
              {Number(memoryUsagePercent) > 70 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.memory.used} / {stats.memory.total} GB
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            <IconDatabase className="size-4" /> Active memory usage
          </div>
          <div className="text-muted-foreground">Includes apps & background processes</div>
        </CardFooter>
      </Card>

      {/* Uptime Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>System Uptime</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(stats.uptime / 3600).toFixed(1)} hrs
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClock /> Running
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            <IconClock className="size-4" /> Continuous operation
          </div>
          <div className="text-muted-foreground">Time since last restart</div>
        </CardFooter>
      </Card>

      {/* Cache Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>CPU Cache</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            L1: {stats.cpu.cache.l1d} KB
          </CardTitle>
          <CardAction>
            <Badge variant="outline">L2: {stats.cpu.cache.l2} KB</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            L3 Cache: {stats.cpu.cache.l3} KB
          </div>
          <div className="text-muted-foreground">Faster data access for CPU</div>
        </CardFooter>
      </Card>

    </div>
  )
}
