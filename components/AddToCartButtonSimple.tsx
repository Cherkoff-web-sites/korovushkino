'use client'

import { useCart } from '@/contexts/CartContext'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface AddToCartButtonSimpleProps {
  product: {
    id: string
    name: string
    model: string
    price: number
    image: string
    href: string
  }
}

export default function AddToCartButtonSimple({ product }: AddToCartButtonSimpleProps) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.price === 0) {
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      model: product.model,
      price: product.price,
      image: product.image,
      href: product.href,
    })
  }

  if (product.price === 0) {
    return null
  }

  return (
    <Button className="w-full" onClick={handleAddToCart}>
      Купить
    </Button>
  )
}
