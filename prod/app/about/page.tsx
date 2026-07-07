import type { Metadata } from 'next'
import AboutPageContent from '@/components/pages/AboutPageContent'

export const metadata: Metadata = {
  title: 'О нас | Коровушкино',
  description:
    'Ферма «Коровушкино» в Тульской области: как всё началось, наше хозяйство, производство и ценности семейной фермы.',
}

export default function AboutPage() {
  return <AboutPageContent />
}
