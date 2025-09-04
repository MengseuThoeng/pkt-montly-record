"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonthSelectorProps {
  selectedMonth: string
  selectedYear: string
  onMonthChange: (month: string, year: string) => void
  isLoading?: boolean
}

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange, isLoading = false }: MonthSelectorProps) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = format(currentDate, "MM")

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const handleCurrentMonth = () => {
    onMonthChange(currentMonth, currentYear.toString())
  }

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by Month:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <Select value={selectedMonth} onValueChange={(month) => onMonthChange(month, selectedYear)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={(year) => onMonthChange(selectedMonth, year)}>
              <SelectTrigger className="w-full sm:w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleCurrentMonth} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <RefreshCw className="mr-2 h-3 w-3 animate-spin" />}
              <span className="sm:hidden">Current</span>
              <span className="hidden sm:inline">Current Month</span>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
            Showing: <strong>{months.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
