'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ProductData } from '@/lib/api/productsData'
import { fetchCatalogProduct } from '@/lib/api/productsClient'
import { extractCatalogProductSlug } from '@/lib/catalogProductRoute'

export function useResolvedCatalogProduct(paramSlug: string) {
  const pathname = usePathname()
  const slug = extractCatalogProductSlug(pathname) || paramSlug.trim()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolvedSlug, setResolvedSlug] = useState(slug)

  useEffect(() => {
    const nextSlug = extractCatalogProductSlug(pathname) || paramSlug.trim()
    setResolvedSlug(nextSlug)
    if (!nextSlug) {
      setProduct(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchCatalogProduct(nextSlug)
      .then((item) => {
        if (!cancelled) setProduct(item)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    const onUpdate = () => {
      fetchCatalogProduct(nextSlug).then((item) => {
        if (!cancelled) setProduct(item)
      })
    }

    window.addEventListener('preview-products-updated', onUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('preview-products-updated', onUpdate)
    }
  }, [pathname, paramSlug])

  return { product, loading, slug: resolvedSlug }
}
