import { NextResponse } from "next/server"
import si from "systeminformation"

export async function GET() {
  const cpu = await si.cpu()
  const currentLoad = await si.currentLoad()
  const mem = await si.mem()
  const time = await si.time()

  return NextResponse.json({
    cpu: {
      manufacturer: cpu.manufacturer,
      brand: cpu.brand,
      speed: cpu.speed, // GHz
      cores: cpu.cores,
      physicalCores: cpu.physicalCores,
      processors: cpu.processors,
      cache: cpu.cache, // L1, L2, L3
    },
    load: currentLoad.currentLoad.toFixed(2) + "%",
    memory: {
      total: (mem.total / 1024 / 1024 / 1024).toFixed(2) + " GB",
      used: (mem.active / 1024 / 1024 / 1024).toFixed(2) + " GB",
    },
    uptime: time.uptime, // seconds
  })
}
