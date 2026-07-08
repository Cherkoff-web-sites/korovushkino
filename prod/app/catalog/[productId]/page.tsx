import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api/productsApi'
import { productsData } from '@/lib/api/productsData'
import { productMetaDescription, productMetaKeywords, productMetaTitle, productUrlSlug } from '@/lib/productSeo'
import ProductPageContent from './ProductPageContent'

export function generateStaticParams() {
  return Object.values(productsData).map((product) => ({
    productId: productUrlSlug(product),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { productId: string }
}): Promise<Metadata> {
  const product = (await getProduct(params.productId)) || productsData[params.productId]
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
  const product = (await getProduct(params.productId)) || productsData[params.productId]

  if (!product) {
    notFound()
  }

  return <ProductPageContent productId={params.productId} fallbackProduct={product} />
}
