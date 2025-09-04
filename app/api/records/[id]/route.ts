import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateRecordInput } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.record.findUnique({
      where: { id: parseInt(params.id) }
    })
    
    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(record)
  } catch (error) {
    console.error('Error fetching record:', error)
    return NextResponse.json(
      { error: 'Failed to fetch record' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<UpdateRecordInput> = await request.json()
    const id = parseInt(params.id)
    
    // Calculate derived values if relevant fields are updated
    const updateData: any = { ...body }
    
    if (body.total !== undefined || body.deposit !== undefined) {
      const currentRecord = await prisma.record.findUnique({
        where: { id }
      })
      
      if (currentRecord) {
        const total = body.total ?? currentRecord.total
        const deposit = body.deposit ?? currentRecord.deposit
        const capital = body.capital ?? currentRecord.capital
        
        updateData.remain = total - deposit
        updateData.profit = total - capital
        updateData.profitTotal = total - capital
        updateData.capitalTotal = capital
      }
    }
    
    if (body.orderDate) {
      updateData.orderDate = new Date(body.orderDate)
    }
    
    const record = await prisma.record.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json(
      { error: 'Failed to update record' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.record.delete({
      where: { id: parseInt(params.id) }
    })
    
    return NextResponse.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}
