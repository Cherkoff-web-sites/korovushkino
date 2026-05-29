import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Коровушкино',
  description: 'Натуральные фермерские продукты и готовые продуктовые корзины.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <ScrollToTop />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

