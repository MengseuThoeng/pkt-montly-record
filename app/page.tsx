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
import { SearchBar } from "@/components/search-bar"
import { Record } from "@/lib/types"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [records, setRecords] = useState<Record[]>([])
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
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
      setIsLoading(true)
      console.log(`Fetching records for ${selectedMonth}/${selectedYear}`)
      const startTime = Date.now()
      
      const url = `/api/records?month=${selectedMonth}&year=${selectedYear}`
      
      // Add timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store' // Prevent caching issues
      })
      
      clearTimeout(timeoutId)
      const endTime = Date.now()
      console.log(`API call took ${endTime - startTime}ms`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }
      const data = await response.json()
      console.log(`Received ${data.length} records`)
      setRecords(data)
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        toast.error("Request timed out - please try again")
      } else {
        toast.error("Failed to load records")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter records based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecords(records)
    } else {
      const filtered = records.filter(record => 
        record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.order.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecords(filtered)
    }
  }, [records, searchQuery])

  useEffect(() => {
    if (session) {
      fetchRecords()
    }
  }, [session, selectedMonth, selectedYear])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    fetchRecords()
  }

  const handleMonthChange = (month: string, year: string) => {
    setSelectedMonth(month)
    setSelectedYear(year)
    // Don't set loading here - let useEffect handle it
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Header with user info and logout */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Monthly Records</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your monthly business records and track profits
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">Welcome, {session.user?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <RecordForm onSuccess={handleRefresh} />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={handleMonthChange}
        isLoading={isLoading}
      />

      {/* Dashboard Stats */}
      <DashboardStats records={filteredRecords} />

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search by customer, order, location, or phone..."
        className="mb-4 sm:mb-6"
      />

      {/* Records Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>
            Records {searchQuery && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredRecords.length} of {records.length} shown)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading records...</span>
            </div>
          ) : (
            <RecordsTable records={filteredRecords} onRefresh={handleRefresh} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
