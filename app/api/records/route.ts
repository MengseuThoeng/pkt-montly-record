import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateRecordInput } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause = {}
    
    if (month && year) {
      // Use more efficient date filtering
      const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)
      
      whereClause = {
        orderDate: {
          gte: startDate,
          lte: endDate
        }
      }
    }

    const records = await prisma.record.findMany({
      where: whereClause,
      orderBy: {
        orderDate: 'desc' // Order by orderDate instead of createdAt for better performance
      }
    })
    
    return NextResponse.json(records)
  } catch (error) {
    console.error('API Error fetching records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRecordInput = await request.json()
    
    // Calculate derived values
    const remain = body.total - body.deposit
    const profit = body.total - body.capital
    const profitTotal = profit // For now, same as profit
    const capitalTotal = body.capital // For now, same as capital
    
    const record = await prisma.record.create({
      data: {
        customerName: body.customerName,
        order: body.order,
        orderDate: new Date(body.orderDate),
        total: body.total,
        delivery: body.delivery,
        deposit: body.deposit,
        remain,
        location: body.location,
        phoneNumber: body.phoneNumber,
        capital: body.capital,
        kilo: body.kilo,
        profit,
        profitTotal,
        capitalTotal,
      }
    })
    
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
