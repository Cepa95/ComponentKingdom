export interface NewOrder {
    id: number
    buyerEmail: string
    orderDate: string
    shipToAddress_FirstName: string
    shipToAddress_LastName: string
    shipToAddress_Street: string
    shipToAddress_City: string
    shipToAddress_State: string
    shipToAddress_ZipCode: string
    subTotal: number
    status: string
    deliveryMethodPrice: number
  }