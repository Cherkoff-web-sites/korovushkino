'use client'

import { useCart } from '@/contexts/CartContext'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    model?: string
    price: number
    image: string
    href: string
  }
  label?: string
  variant?: 'primary' | 'outline'
  className?: string
}

export default function AddToCartButton({
  product,
  label = 'Добавить в корзину',
  variant = 'outline',
  className = 'w-full sm:w-auto flex-1',
}: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      model: product.model || '',
      price: product.price,
      image: product.image,
      href: product.href,
    })
  }

  if (product.price === 0) {
    return (
      <Link
        href="/contact"
        className={`inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-[#3D8C13] bg-white px-8 py-3 text-center text-base font-medium text-[#3D8C13] transition-colors hover:bg-[#3D8C13]/10 ${className}`}
      >
        Узнать цену
      </Link>
    )
  }

  return (
    <Button variant={variant} size="lg" className={className} onClick={handleAddToCart}>
      {label}
    </Button>
  )
}
