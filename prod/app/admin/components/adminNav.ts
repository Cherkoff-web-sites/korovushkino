export type AdminNavItem = {
  href: string
  label: string
  icon: 'catalog'
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin/catalog', label: 'Каталог товаров', icon: 'catalog' },
]
