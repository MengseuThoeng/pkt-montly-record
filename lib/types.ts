export interface Record {
  id: number
  customerName: string
  order: string
  orderDate: Date
  total: number
  delivery: number
  deposit: number
  remain: number
  location: string
  phoneNumber: string
  capital: number
  kilo: number
  profit: number
  profitTotal: number
  capitalTotal: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateRecordInput {
  customerName: string
  order: string
  orderDate: Date
  total: number
  delivery: number
  deposit: number
  location: string
  phoneNumber: string
  capital: number
  kilo: number
}

export interface UpdateRecordInput extends Partial<CreateRecordInput> {
  id: number
}
