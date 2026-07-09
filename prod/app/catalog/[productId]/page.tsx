import type { Metadata } from 'next'
import { getProduct } from '@/lib/api/productsApi'
import { getCatalogProducts } from '@/lib/api/productsData'
import { collectProductStaticSlugs } from '@/lib/catalogProductRoute'
import { productMetaDescription, productMetaKeywords, productMetaTitle, productUrlSlug } from '@/lib/productSeo'
import ProductPageContent from './ProductPageContent'

export function generateStaticParams() {
  const slugs = collectProductStaticSlugs(getCatalogProducts(), productUrlSlug)
  return slugs.map((productId) => ({ productId }))
}

export async function generateMetadata({
  params,
}: {
  params: { productId: string }
}): Promise<Metadata> {
  const product = await getProduct(params.productId)
  if (!product) {
    return { title: 'Товар | Коровушкино' }
  }
  return {
    title: productMetaTitle(product),
    description: productMetaDescription(product),
    keywords: productMetaKeywords(product),
  }
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const initialProduct = await getProduct(params.productId)
  return <ProductPageContent paramSlug={params.productId} initialProduct={initialProduct} />
}
