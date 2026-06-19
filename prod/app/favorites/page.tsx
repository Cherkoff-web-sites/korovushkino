'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import Button from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { productsData, type ProductData } from '@/lib/api/productsData'
import { productPublicPath } from '@/lib/productSeo'

const CATALOG_HREF = '/catalog'
const placeholderImg = '/images/home/hero-bg.png'

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const { addItem } = useCart()

  const products = useMemo(() => {
    const list: ProductData[] = []
    for (const id of favoriteIds) {
      const p = productsData[id]
      if (p) list.push(p)
    }
    return list
  }, [favoriteIds])

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <section className="border-b border-[#E5DECF] bg-white py-8 sm:py-10 lg:py-12">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55 sm:text-[15px]" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#232326]">
                  Главная
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]/70">Избранное</li>
            </ol>
          </nav>

          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            Избранное
          </h1>
          <p className="mt-2 text-sm text-[#232326]/75 sm:text-[15px]">
            Добавляйте понравившиеся товары с каталога — список хранится в этом браузере.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container">
          {products.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-xl border border-[#E5DECF] bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-lg text-[#232326]/80">Здесь пока пусто</p>
              <p className="mt-2 text-sm text-[#232326]/60">
                Нажимайте сердечко на карточке товара, чтобы сохранить его здесь.
              </p>
              <Link href={CATALOG_HREF} className="mt-8 inline-block">
                <Button size="lg">Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {products.map((product) => {
                const img = product.images[0] ?? placeholderImg
                return (
                  <li
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-[#D1C4B2] bg-[#FFF9F0] shadow-sm sm:flex sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                  >
                    <Link
                      href={productPublicPath(product)}
                      className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F5F0E8] sm:aspect-auto sm:h-[120px] sm:w-[140px] sm:rounded-lg"
                    >
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 140px"
                      />
                    </Link>

                    <div className="flex flex-col gap-4 p-4 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:gap-6 sm:p-0">
                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <Link
                          href={productPublicPath(product)}
                          className="text-lg font-bold text-[#1F1F1F] transition-colors hover:text-[#3D8C13] sm:text-xl"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-sm text-[#707070]">
                          {product.price.toLocaleString('ru-RU')}₽{' '}
                          <span className="text-[#232326]/60">· {product.series}</span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 sm:flex-col sm:justify-center md:flex-row">
                        <FavoriteHeartButton
                          productId={product.id}
                          iconSize={22}
                          className="h-11 w-11 shadow-sm"
                        />
                        <button
                          type="button"
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#3D8C13] px-5 text-sm font-medium text-white transition-colors hover:bg-[#347710]"
                          onClick={() =>
                            addItem({
                              id: product.id,
                              name: product.name,
                              model: product.series,
                              price: product.price,
                              image: img,
                              href: productPublicPath(product),
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
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
