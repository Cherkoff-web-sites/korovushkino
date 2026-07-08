'use client'

import { useEffect } from 'react'
import type { ProductData } from '@/lib/api/productsData'
import { productMetaDescription, productMetaKeywords, productMetaTitle } from '@/lib/productSeo'

export default function ProductSeoHead({ product }: { product: ProductData }) {
  useEffect(() => {
    document.title = productMetaTitle(product)

    const description = productMetaDescription(product)
    let descMeta = document.querySelector('meta[name="description"]')
    if (!descMeta) {
      descMeta = document.createElement('meta')
      descMeta.setAttribute('name', 'description')
      document.head.appendChild(descMeta)
    }
    descMeta.setAttribute('content', description)

    const keywords = productMetaKeywords(product)
    let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    if (keywords) {
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta')
        keywordsMeta.setAttribute('name', 'keywords')
        document.head.appendChild(keywordsMeta)
      }
      keywordsMeta.setAttribute('content', keywords)
    } else if (keywordsMeta) {
      keywordsMeta.remove()
    }
  }, [product])

  return null
}
