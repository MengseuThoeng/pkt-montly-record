"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordsTable } from "@/components/records-table"
import { RecordForm } from "@/components/record-form"
import { DashboardStats } from "@/components/dashboard-stats"
import { Record } from "@/lib/types"

export default function HomePage() {
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/records")
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
    fetchRecords()
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchRecords()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Monthly Records</h1>
          <p className="text-muted-foreground">
            Manage your monthly business records and track profits
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
        </div>
      </div>

      <DashboardStats records={records} />

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
