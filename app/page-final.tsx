"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { RefreshCw, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordsTable } from "@/components/records-table"
import { RecordForm } from "@/components/record-form"
import { DashboardStats } from "@/components/dashboard-stats"
import { MonthSelector } from "@/components/month-selector"
import { Record } from "@/lib/types"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Default to current month and year
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(format(currentDate, "MM"))
  const [selectedYear, setSelectedYear] = useState(format(currentDate, "yyyy"))

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
  }, [status, router])

  const fetchRecords = async () => {
    try {
      const url = `/api/records?month=${selectedMonth}&year=${selectedYear}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      toast.error("Failed to load records")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchRecords()
    }
  }, [session, selectedMonth, selectedYear])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchRecords()
  }

  const handleMonthChange = (month: string, year: string) => {
    setSelectedMonth(month)
    setSelectedYear(year)
    setIsLoading(true)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with user info and logout */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Monthly Records</h1>
          <p className="text-muted-foreground">
            Manage your monthly business records and track profits
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Welcome, {session.user?.name}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <RecordForm onSuccess={handleRefresh} />
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Month Selector */}
      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      {/* Dashboard Stats */}
      <DashboardStats records={records} />

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading records...</span>
            </div>
          ) : (
            <RecordsTable records={records} onRefresh={handleRefresh} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
