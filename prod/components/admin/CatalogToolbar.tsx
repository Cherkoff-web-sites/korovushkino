'use client'

import Button from '@/components/ui/Button'
import { adminInputClass, adminPanelClass } from './adminStyles'

type CatalogToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  view: 'table' | 'grid'
  onViewChange: (view: 'table' | 'grid') => void
  onAddProduct: () => void
}

export default function CatalogToolbar({
  query,
  onQueryChange,
  view,
  onViewChange,
  onAddProduct,
}: CatalogToolbarProps) {
  return (
    <div className={`${adminPanelClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}>
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Поиск по названию, URL, SEO…"
        className={`${adminInputClass} sm:max-w-sm`}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] p-1">
          <button
            type="button"
            onClick={() => onViewChange('table')}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              view === 'table' ? 'bg-white text-[#1F1F1F] shadow-sm' : 'text-[#707070]'
            }`}
          >
            Таблица
          </button>
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              view === 'grid' ? 'bg-white text-[#1F1F1F] shadow-sm' : 'text-[#707070]'
            }`}
          >
            Карточки
          </button>
        </div>
        <Button type="button" onClick={onAddProduct}>
          + Товар
        </Button>
      </div>
    </div>
  )
}
