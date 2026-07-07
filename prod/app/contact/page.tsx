import type { Metadata } from 'next'
import ContactPageContent from '@/components/pages/ContactPageContent'

export const metadata: Metadata = {
  title: 'Контакты | Коровушкино',
  description: 'Связь с фермой Коровушкино: телефон, почта, соцсети и юридическая информация.',
}

export default function ContactPage() {
  return <ContactPageContent />
}
