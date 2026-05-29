import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Избранное | Коровушкино',
  description: 'Сохранённые товары с фермы Коровушкино.',
}

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children
}
