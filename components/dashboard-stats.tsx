"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Record } from "@/lib/types"

interface DashboardStatsProps {
  records: Record[]
}

export function DashboardStats({ records }: DashboardStatsProps) {
  const stats = {
    totalRecords: records.length,
    totalRevenue: records.reduce((sum, record) => sum + record.total, 0),
    totalProfit: records.reduce((sum, record) => sum + record.profit, 0),
    totalCapital: records.reduce((sum, record) => sum + record.capital, 0),
    totalRemaining: records.reduce((sum, record) => sum + record.remain, 0),
    totalKilo: records.reduce((sum, record) => sum + record.kilo, 0),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{stats.totalRecords}</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm sm:text-2xl font-bold text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Profit</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm sm:text-2xl font-bold text-blue-600">
            {formatCurrency(stats.totalProfit)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Capital</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm sm:text-2xl font-bold text-purple-600">
            {formatCurrency(stats.totalCapital)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Remaining</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm sm:text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalRemaining)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-2 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Kilo</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm sm:text-2xl font-bold text-orange-600">
            {stats.totalKilo.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
