'use client'

import { useCart } from '@/contexts/CartContext'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

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
  allowZeroPrice?: boolean
}

export default function AddToCartButton({
  product,
  label = 'Добавить в корзину',
  variant = 'outline',
  className = 'w-full sm:w-auto flex-1',
  allowZeroPrice = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      model: product.model || '',
      price: product.price,
      image: product.image,
      href: product.href,
    })
    // Можно добавить уведомление или редирект
    // router.push('/cart')
  }

  if (product.price === 0 && !allowZeroPrice) {
    return (
      <Button
        variant="outline"
        size="lg"
        className={`border-white text-white hover:bg-white/10 ${className}`}
      >
        Получить прайс-лист
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size="lg"
      className={className}
      onClick={handleAddToCart}
    >
      {label}
    </Button>
  )
}
