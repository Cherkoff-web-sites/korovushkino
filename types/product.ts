export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image?: string
  specifications?: ProductSpecification[]
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

