'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import Button from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { usePagesContent } from '@/hooks/usePagesContent'
import { resolveFavoriteItems } from '@/lib/favoriteItems'
import AccountSectionCard from '@/app/account/components/AccountSectionCard'

const CATALOG_HREF = '/catalog'

export default function AccountFavoritesContent() {
  const { favoriteIds } = useFavorites()
  const { addItem } = useCart()
  const { content: pagesContent } = usePagesContent()

  const items = useMemo(
    () => resolveFavoriteItems(favoriteIds, pagesContent.baskets.items),
    [favoriteIds, pagesContent.baskets.items],
  )

  return (
    <AccountSectionCard title="Избранные продукты">
      <p className="mb-6 text-sm text-[#232326]/75 sm:text-[15px]">
        Добавляйте понравившиеся товары из каталога и продуктовые корзины — список сохраняется в этом
        браузере.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[#D2B48C]/50 bg-white/60 px-6 py-12 text-center">
          <p className="text-lg text-[#232326]/80">Здесь пока пусто</p>
          <p className="mt-2 text-sm text-[#232326]/60">
            Нажимайте сердечко на карточке товара или корзины, чтобы сохранить здесь.
          </p>
          <Link href={CATALOG_HREF} className="mt-8 inline-block">
            <Button size="lg">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-5">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#D1C4B2] bg-white/70 shadow-sm sm:flex sm:flex-row sm:items-center sm:gap-6 sm:p-5"
            >
              <Link
                href={item.href}
                className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F5F0E8] sm:aspect-auto sm:h-[120px] sm:w-[140px] sm:rounded-lg"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 140px"
                />
              </Link>

              <div className="flex flex-col gap-4 p-4 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-6 sm:p-0">
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <Link
                    href={item.href}
                    className="text-lg font-bold text-[#1F1F1F] transition-colors hover:text-[#3D8C13] sm:text-xl"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[#707070]">
                    {item.price.toLocaleString('ru-RU')}₽{' '}
                    <span className="text-[#232326]/60">· {item.series}</span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 sm:flex-col sm:justify-center md:flex-row">
                  <FavoriteHeartButton productId={item.id} iconSize={22} className="h-11 w-11 shadow-sm" />
                  <button
                    type="button"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#3D8C13] px-5 text-sm font-medium text-white transition-colors hover:bg-[#347710]"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        model: item.series,
                        price: item.price,
                        image: item.image,
                        href: item.href,
                      })
                    }
                  >
                    <Image
                      src="/images/header/icon-cart.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="brightness-0 invert"
                    />
                    В корзину
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountSectionCard>
  )
}
