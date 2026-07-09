import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api/productsApi'
import { getCatalogProducts, productsData } from '@/lib/api/productsData'
import { collectProductStaticSlugs } from '@/lib/catalogProductRoute'
import { productUrlSlug } from '@/lib/productSeo'
import ProductReviewsPageContent from './ProductReviewsPageContent'

export function generateStaticParams() {
  return collectProductStaticSlugs(getCatalogProducts(), productUrlSlug).map((productId) => ({
    productId,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { productId: string }
}): Promise<Metadata> {
  const product = (await getProduct(params.productId)) || productsData[params.productId]
  if (!product) {
    return { title: 'Отзывы | Коровушкино' }
  }
  return {
    title: `Отзывы: ${product.name} | Коровушкино`,
    description: `Отзывы покупателей о товаре «${product.name}».`,
  }
}

export default async function ProductReviewsPage({ params }: { params: { productId: string } }) {
  const product = (await getProduct(params.productId)) || productsData[params.productId]

  if (!product) {
    notFound()
  }

  return <ProductReviewsPageContent product={product} />
}
