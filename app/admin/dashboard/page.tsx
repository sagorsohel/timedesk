"use client"

import React, { useState } from "react"
import RoutineManager from "@/components/routine-manager"

import { formatToHrsMins } from "@/utils/timeCoverter"

export default function Page() {

  return (
    <div className="flex justify-end p-4">
      <RoutineManager />
    </div>

  )
}
