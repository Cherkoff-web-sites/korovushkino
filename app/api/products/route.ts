import { NextResponse } from 'next/server'
import { mockProducts } from '@/lib/api/mockData'
import { ProductFilters } from '@/types/product'

// GET /api/products - получение списка товаров с фильтрацией
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const filters: ProductFilters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  let filteredProducts = [...mockProducts]

  // Применяем фильтры
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    )
  }

  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category)
  }

  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
  }

  return NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length,
  })
}

