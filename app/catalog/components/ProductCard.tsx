'use client'

import Link from 'next/link'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import Card from '@/components/ui/Card'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/catalog/${product.id}`}>
      <Card hover className="h-full flex flex-col">
        <div className="flex-grow">
          <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400">Изображение товара</span>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>
        </div>
      </Card>
    </Link>
  )
}

