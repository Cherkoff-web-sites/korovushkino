'use client'

import { CATEGORY_LABELS, type CategorySlug } from '@/lib/api/productsData'
import { adminPanelClass } from './adminStyles'

type AdminTreeProps = {
  selectedCategory: CategorySlug | 'all'
  counts: Record<string, number>
  onSelect: (category: CategorySlug | 'all') => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function AdminTree({
  selectedCategory,
  counts,
  onSelect,
  collapsed = false,
  onToggleCollapse,
}: AdminTreeProps) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

  return (
    <div className={adminPanelClass}>
      <div className="flex items-center justify-between border-b border-[#e8eaef] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#1F1F1F]">Категории</h2>
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-xs text-[#707070] lg:hidden"
          >
            {collapsed ? 'Показать' : 'Скрыть'}
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <ul className="p-2">
          <li>
            <button
              type="button"
              onClick={() => onSelect('all')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#3D8C13]/10 font-medium text-[#3D8C13]'
                  : 'text-[#232326]/80 hover:bg-[#f7f8fa]'
              }`}
            >
              <span>Все товары</span>
              <span className="text-xs text-[#707070]">{total}</span>
            </button>
          </li>
          {(Object.entries(CATEGORY_LABELS) as [CategorySlug, string][]).map(([slug, label]) => (
            <li key={slug}>
              <button
                type="button"
                onClick={() => onSelect(slug)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategory === slug
                    ? 'bg-[#3D8C13]/10 font-medium text-[#3D8C13]'
                    : 'text-[#232326]/80 hover:bg-[#f7f8fa]'
                }`}
              >
                <span>{label}</span>
                <span className="text-xs text-[#707070]">{counts[slug] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
