export type AccountNavItem = {
  href: string
  label: string
  icon: 'profile' | 'orders' | 'reviews' | 'addresses' | 'password' | 'favorites' | 'settings'
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { href: '/account', label: 'Личные данные', icon: 'profile' },
  { href: '/account/orders', label: 'Заказы', icon: 'orders' },
  { href: '/account/reviews', label: 'Отзывы', icon: 'reviews' },
  { href: '/account/addresses', label: 'Адреса', icon: 'addresses' },
  { href: '/account/favorites', label: 'Избранные продукты', icon: 'favorites' },
  { href: '/account/settings', label: 'Учетная запись', icon: 'settings' },
]
