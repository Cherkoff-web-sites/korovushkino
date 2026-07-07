import type { Metadata } from 'next'
import BasketsPageContent from '@/components/pages/BasketsPageContent'

export const metadata: Metadata = {
  title: 'Продуктовые корзины | Коровушкино',
  description: 'Готовые продуктовые корзины: мясная, молочная и недельная — доставка фермерских продуктов.',
}

export default function BasketsPage() {
  return <BasketsPageContent />
}
