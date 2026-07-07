import type { Metadata } from 'next'
import DeliveryPaymentPageContent from '@/components/pages/DeliveryPaymentPageContent'

export const metadata: Metadata = {
  title: 'Доставка и оплата | Коровушкино',
  description: 'Условия доставки и способы оплаты фермерской продукции Коровушкино.',
}

export default function DeliveryPaymentPage() {
  return <DeliveryPaymentPageContent />
}
