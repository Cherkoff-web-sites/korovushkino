'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()

  return (
    <div className="min-h-screen">
      {/* Секция "ВАША КОРЗИНА" */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-[#3D8C13]">
            ВАША КОРЗИНА
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#232326]/75 text-lg mb-6">Ваша корзина пуста</p>
              <Link href="/catalog">
                <Button>Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Сводка */}
              <div className="mb-6 sm:mb-8">
                <p className="text-[#232326] text-base sm:text-lg">
                  В вашей корзине {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'} на сумму{' '}
                  <span className="text-[#3D8C13] font-semibold">
                    {totalPrice.toLocaleString('ru-RU')} руб.
                  </span>
                </p>
              </div>

              {/* Список товаров */}
              <div className="space-y-4 sm:space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#2A2529] border-2 border-[#3D8C13] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
                  >
                    {/* Изображение товара */}
                    <Link href={item.href} className="flex-shrink-0">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#3B363C] rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      </div>
                    </Link>

                    {/* Информация о товаре */}
                    <div className="flex-1 min-w-0">
                      <Link href={item.href}>
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-2 hover:text-[#3D8C13] transition-colors">
                          {item.name} {item.model}
                        </h3>
                      </Link>

                      {/* Количество */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white/80 text-sm sm:text-base">Количество:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-[#3D8C13] text-white flex items-center justify-center hover:bg-[#3D8C13]/90 transition-colors"
                            aria-label="Уменьшить количество"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M4 8h8" />
                            </svg>
                          </button>
                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-[#3D8C13] text-white flex items-center justify-center hover:bg-[#3D8C13]/90 transition-colors"
                            aria-label="Увеличить количество"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M8 4v8M4 8h8" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Сумма */}
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm sm:text-base">Сумма:</span>
                        <span className="text-white font-semibold text-base sm:text-lg">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} руб.
                        </span>
                      </div>
                    </div>

                    {/* Кнопка удаления */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 text-white/70 hover:text-[#3D8C13] transition-colors p-2"
                      aria-label="Удалить товар"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  )
}
