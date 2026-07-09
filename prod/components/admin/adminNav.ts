export type AdminNavIconType =
  | 'catalog'
  | 'home'
  | 'backup'
  | 'delivery'
  | 'contact'
  | 'orders'
  | 'newsletter'
  | 'reviews'
  | 'clients'
  | 'site'
  | 'pages'

export type AdminNavItem = {
  href: string
  label: string
  icon: AdminNavIconType
  section?: 'leads' | 'catalog' | 'content' | 'clients' | 'system'
}

export const ADMIN_NAV_SECTIONS: { id: AdminNavItem['section']; label: string }[] = [
  { id: 'leads', label: 'Заявки' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'content', label: 'Контент' },
  { id: 'system', label: 'Система' },
  { id: 'clients', label: 'Клиенты' },
]

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin/leads/contact', label: 'Обратная связь', icon: 'contact', section: 'leads' },
  { href: '/admin/leads/orders', label: 'Заказы', icon: 'orders', section: 'leads' },
  { href: '/admin/leads/newsletter', label: 'Рассылка', icon: 'newsletter', section: 'leads' },
  { href: '/admin/leads/reviews', label: 'Отзывы', icon: 'reviews', section: 'leads' },
  { href: '/admin/catalog', label: 'Товары', icon: 'catalog', section: 'catalog' },
  { href: '/admin/delivery', label: 'Доставка', icon: 'delivery', section: 'catalog' },
  { href: '/admin/home', label: 'Главная страница', icon: 'home', section: 'content' },
  { href: '/admin/pages', label: 'Страницы сайта', icon: 'pages', section: 'content' },
  { href: '/admin/site', label: 'Подвал и попапы', icon: 'site', section: 'content' },
  { href: '/admin/backup', label: 'Резервная копия', icon: 'backup', section: 'system' },
  { href: '/admin/clients', label: 'Клиенты', icon: 'clients', section: 'clients' },
]

export function isAdminNavActive(pathname: string, href: string) {
  if (href === '/admin/catalog') {
    return pathname === '/admin/catalog' || pathname.startsWith('/admin/catalog/')
  }
  if (href === '/admin/home') {
    return pathname === '/admin/home' || pathname.startsWith('/admin/home/')
  }
  if (href === '/admin/site') {
    return pathname === '/admin/site' || pathname.startsWith('/admin/site/')
  }
  if (href === '/admin/pages') {
    return pathname === '/admin/pages' || pathname.startsWith('/admin/pages/')
  }
  if (href === '/admin/backup') {
    return pathname === '/admin/backup' || pathname.startsWith('/admin/backup/')
  }
  if (href === '/admin/delivery') {
    return pathname === '/admin/delivery' || pathname.startsWith('/admin/delivery/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
