import { NextResponse } from 'next/server'
import { mockProducts } from '@/lib/api/mockData'

// GET /api/products/[productId] - получение товара по ID
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const product = mockProducts.find(p => p.id.toString() === params.productId)

  if (!product) {
    return NextResponse.json(
      { error: 'Товар не найден' },
      { status: 404 }
    )
  }

  return NextResponse.json({ product })
}

