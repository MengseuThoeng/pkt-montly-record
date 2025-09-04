"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RecordForm } from "./record-form"
import { Record } from "@/lib/types"

interface RecordsTableProps {
  records: Record[]
  onRefresh: () => void
}

export function RecordsTable({ records, onRefresh }: RecordsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete record")
      }

      toast.success("Record deleted successfully")
      onRefresh()
    } catch (error) {
      toast.error("Failed to delete record")
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Delivery</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Remain</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Capital</TableHead>
            <TableHead className="text-right">Kilo</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                No records found. Add your first record to get started.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{record.customerName}</TableCell>
                <TableCell>{record.order}</TableCell>
                <TableCell>{format(new Date(record.orderDate), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(record.total)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.delivery)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.deposit)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={record.remain > 0 ? "destructive" : "secondary"}>
                    {formatCurrency(record.remain)}
                  </Badge>
                </TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(record.capital)}
                </TableCell>
                <TableCell className="text-right">{record.kilo.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={record.profit > 0 ? "default" : "destructive"}>
                    {formatCurrency(record.profit)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <div className="w-full">
                          <RecordForm record={record} onSuccess={onRefresh} />
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(record.id)}
                        disabled={isDeleting === record.id}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting === record.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
