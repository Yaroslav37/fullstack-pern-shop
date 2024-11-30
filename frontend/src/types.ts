export interface Product {
  id: string
  name: string
  game: string
  description: string
  price: number
  imageUrl: string
  stock: number
}
export interface Promocode {
  id: number
  code: string
  discount: number
  expiration_date: string
  is_active: boolean
}

export interface NewPromocode {
  code: string
  discount: number
  expiration_date: string
  is_active: boolean
}
export interface Game {
  id: string
  name: string
}
