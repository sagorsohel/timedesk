"use client"

import React, { useState } from "react"
import RoutineManager from "@/components/routine-manager"

import { formatToHrsMins } from "@/utils/timeCoverter"
import RoutineChartPage from "@/components/dashboard/routine-chart-data"

export default function Page() {

  return (
    <div className="flex flex-col sm:flex-row w-full p-4  justify-between">
      <div className="sm:w-1/2 w-full">
        <RoutineChartPage/>
      </div>
      <div className="flex justify-end ">
        <RoutineManager />
      </div>
    </div>

  )
}
