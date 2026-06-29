import type { Metadata } from 'next'
import HomePageContent from '@/components/home/HomePageContent'

export const metadata: Metadata = {
  title: 'Главная | Коровушкино',
  description: 'Натуральные фермерские продукты и готовые продуктовые корзины.',
}

export default function HomePage() {
  return <HomePageContent />
}
