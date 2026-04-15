'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerIcons = {
    cart: '/images/header/icon-cart.svg',
    favorites: '/images/header/icon-favorites.svg',
    account: '/images/header/icon-account.svg',
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-black/10 bg-[#3D8C13]">
        <div className="container">
          <div className="flex h-[76px] items-center justify-between gap-4 md:h-[84px] md:gap-6">
            <Link href="/" className="shrink-0 text-[30px] font-normal leading-none text-[#FFFFFF] md:text-[38px]">
              Коровушкино
            </Link>

            <Navigation />

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1f1f1f]"
                  aria-label="Корзина"
                >
                  <Image src={headerIcons.cart} alt="" width={22} height={22} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1f1f1f]"
                  aria-label="Избранное"
                >
                  <Image src={headerIcons.favorites} alt="" width={22} height={22} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1f1f1f]"
                  aria-label="Профиль"
                >
                  <Image src={headerIcons.account} alt="" width={22} height={22} />
                </button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center text-[#FFFFFF] transition-colors hover:text-white/80 lg:hidden"
                aria-label="Открыть меню"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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

