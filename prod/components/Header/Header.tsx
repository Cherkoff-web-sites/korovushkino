'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'
import AccountEntryButton from '@/components/auth/AccountEntryButton'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { favoriteCount } = useFavorites()
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()
  const headerIcons = {
    cart: '/images/header/icon-cart.svg',
    favorites: '/images/header/icon-favorites.svg',
  }

  return (
    <>
      <header className="relative z-50 shrink-0 border-b border-[#2d6710] bg-[#3D8C13]">
        <div className="container">
          <div className="flex h-[76px] items-center justify-between gap-4 md:h-[84px] md:gap-6">
            <Link href="/" className="shrink-0 text-[30px] font-normal leading-none text-[#FFFFFF] md:text-[38px]">
              Коровушкино
            </Link>

            <Navigation />

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1f1f1f] transition-opacity hover:opacity-90"
                  aria-label={`Корзина${cartCount > 0 ? `, ${cartCount} поз.` : ''}`}
                >
                  <Image src={headerIcons.cart} alt="" width={22} height={22} />
                  {cartCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#3D8C13] px-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-[#3D8C13]">
                      {cartCount > 99 ? '99' : cartCount}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/favorites"
                  className="relative flex h-10 w-10 items-center justify-center rounded-md bg-white transition-opacity hover:opacity-90"
                  aria-label={`Избранное${favoriteCount > 0 ? `, ${favoriteCount}` : ''}`}
                >
                  <Image src={headerIcons.favorites} alt="" width={22} height={22} />
                  {favoriteCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-[#3D8C13]">
                      {favoriteCount > 9 ? '9+' : favoriteCount}
                    </span>
                  ) : null}
                </Link>
                <AccountEntryButton className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#1f1f1f] transition-opacity hover:opacity-90" />
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center text-[#FFFFFF] hover:text-[#FFFFFF] lg:hidden"
                aria-label="Открыть меню"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                >
                  <path
                    d="M12 16L36 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 24L36 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 32L36 32"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
