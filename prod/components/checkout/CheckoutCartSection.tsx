'use client'

import Image from 'next/image'
import type { CartItem } from '@/contexts/CartContext'
import { checkoutSectionClass, checkoutSectionDividerClass, checkoutSectionTitleClass } from '@/components/checkout/checkoutStyles'
import { ChevronIcon, TrashIcon } from '@/components/checkout/CheckoutIcons'

type CheckoutCartSectionProps = {
  items: CartItem[]
  open: boolean
  onToggle: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export default function CheckoutCartSection({
  items,
  open,
  onToggle,
  onUpdateQuantity,
  onRemove,
}: CheckoutCartSectionProps) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <section className={checkoutSectionClass}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <h2 className={checkoutSectionTitleClass}>Корзина ({count})</h2>
        <span className="text-[#232326]/70">
          <ChevronIcon open={open} />
        </span>
      </button>

      {open ? (
        <ul className={`mt-4 space-y-4 border-t ${checkoutSectionDividerClass} pt-4`}>
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 sm:gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#C88C39]/60 bg-white sm:h-[72px] sm:w-[72px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#1F1F1F] sm:text-[15px]">{item.name}</p>
                <p className="mt-1 text-sm text-[#232326]/75">
                  {item.price.toLocaleString('ru-RU')} ₽/кг
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center rounded-lg border border-[#C88C39]/60 bg-white">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center text-[#232326] transition-colors hover:bg-[#FFF6E7]"
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium text-[#1F1F1F]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center text-[#232326] transition-colors hover:bg-[#FFF6E7]"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#232326]/55 transition-colors hover:bg-white hover:text-[#3D8C13]"
                  aria-label="Удалить товар"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
