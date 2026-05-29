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
    <div className="min-h-screen bg-[#fdfbf6]">
      <section className="border-b border-[#E5DECF] bg-white py-8 sm:py-12 lg:py-14">
        <div className="container">
          <h1 className="text-3xl font-normal leading-tight text-[#1F1F1F] sm:text-4xl">Корзина</h1>

          {items.length === 0 ? (
            <div className="mt-10 rounded-xl border border-[#E5DECF] bg-white px-6 py-12 text-center">
              <p className="mb-6 text-lg text-[#232326]/75">В корзине пока ничего нет</p>
              <Link href="/catalog">
                <Button size="lg">Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-4 text-base text-[#232326] sm:text-lg">
                {totalItems}{' '}
                {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'} на сумму{' '}
                <span className="font-semibold text-[#3D8C13]">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </p>

              <ul className="mt-8 space-y-4 sm:space-y-5">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-[#E5DECF] bg-white p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                  >
                    <Link href={item.href} className="shrink-0 self-start sm:self-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-[#E5DECF] bg-[#fdfbf6] sm:h-28 sm:w-28">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 96px, 112px"
                        />
                      </div>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link href={item.href}>
                        <h2 className="text-base font-semibold text-[#1F1F1F] transition-colors hover:text-[#3D8C13] sm:text-lg">
                          {item.name}
                          {item.model ? <span className="font-normal text-[#232326]/70"> · {item.model}</span> : null}
                        </h2>
                      </Link>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-[#232326]/70">Количество</span>
                        <div className="inline-flex items-center gap-2 rounded-lg border border-[#E5DECF] bg-[#fdfbf6] p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#232326] transition-colors hover:bg-white"
                            aria-label="Уменьшить количество"
                          >
                            <span className="text-lg leading-none">−</span>
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold text-[#232326]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#232326] transition-colors hover:bg-white"
                            aria-label="Увеличить количество"
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-[#232326]/80">
                        Сумма:{' '}
                        <span className="font-semibold text-[#1F1F1F]">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 self-end text-sm font-medium text-[#232326]/60 underline-offset-2 hover:text-[#3D8C13] hover:underline sm:self-center"
                      aria-label="Удалить товар"
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg font-semibold text-[#1F1F1F]">
                  Итого: <span className="text-[#3D8C13]">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </p>
                <Link href="/catalog">
                  <Button variant="outline" size="lg">
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
