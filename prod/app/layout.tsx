import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import AuthModal from '@/components/auth/AuthModal'
import AppProviders from '@/components/providers/AppProviders'
import MainWithTransition from '@/components/navigation/MainWithTransition'
import PageTransition from '@/components/navigation/PageTransition'
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
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <PageTransition />
            <Header />
            <MainWithTransition>{children}</MainWithTransition>
            <Footer />
            <ScrollToTop />
            <AuthModal />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}

