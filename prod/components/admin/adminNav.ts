export type AdminNavIconType =
  | 'catalog'
  | 'contact'
  | 'orders'
  | 'clients'
  | 'site'

export type AdminNavItem = {
  href: string
  label: string
  icon: AdminNavIconType
  section?: 'leads' | 'catalog' | 'clients' | 'system'
}

export const ADMIN_NAV_SECTIONS: { id: AdminNavItem['section']; label: string }[] = [
  { id: 'leads', label: 'Заявки' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'clients', label: 'Клиенты' },
]

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin/leads/contact', label: 'Обратная связь', icon: 'contact', section: 'leads' },
  { href: '/admin/leads/orders', label: 'Заказы', icon: 'orders', section: 'leads' },
  { href: '/admin/catalog', label: 'Товары', icon: 'catalog', section: 'catalog' },
  { href: '/admin/clients', label: 'Клиенты', icon: 'clients', section: 'clients' },
]

export function isAdminNavActive(pathname: string, href: string) {
  if (href === '/admin/catalog') {
    return pathname === '/admin/catalog' || pathname.startsWith('/admin/catalog/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
