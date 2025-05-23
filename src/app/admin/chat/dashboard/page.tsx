"use client"

import { DatePickerForm } from "@/components/dashboard/Calendar"
import * as React from "react"
import TabsSection from "@/components/dashboard/tabsSection"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <DatePickerForm />
      </div>
      <TabsSection />
    </div>
  )
}
