'use client'

export function CatalogProductCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#D1C4B2]/70 bg-[#FFF9F0]"
      aria-hidden
    >
      <div className="aspect-[4/3] w-full shrink-0 skeleton-pulse bg-[#E8E0D4]" />
      <div className="flex flex-1 flex-col px-[15px] pb-4 pt-[15px]">
        <div className="skeleton-pulse mb-2 h-5 w-4/5 max-w-[85%] rounded-md bg-[#E8E0D4]" />
        <div className="skeleton-pulse mb-1.5 h-3.5 w-full rounded-md bg-[#E8E0D4]" />
        <div className="skeleton-pulse mb-4 h-3.5 w-2/3 max-w-[70%] rounded-md bg-[#E8E0D4]" />
        <div className="skeleton-pulse mb-4 h-6 w-24 rounded-md bg-[#E8E0D4]" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="skeleton-pulse h-3.5 w-3.5 rounded-full bg-[#E8E0D4]" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton-pulse h-10 w-28 rounded-lg bg-[#E8E0D4]" />
            <div className="skeleton-pulse h-10 w-10 rounded-lg bg-[#E8E0D4]" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CatalogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-label="Загрузка товаров"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CatalogProductCardSkeleton key={index} />
      ))}
      <span className="sr-only">Загрузка каталога…</span>
    </div>
  )
}
