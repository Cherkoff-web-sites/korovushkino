import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ProductTabs from './ProductTabs'
import AddToCartButton from './AddToCartButton'
import { getProduct } from '@/lib/api/productsApi'
import { productsData } from '@/lib/api/productsData'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { productId: string }
}): Promise<Metadata> {
  const product = (await getProduct(params.productId)) || productsData[params.productId]

  if (!product) {
    return {
      title: 'Товар не найден | Коровушкино',
    }
  }

  return {
    title: `${product.name} | Коровушкино`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = (await getProduct(params.productId)) || productsData[params.productId]

  if (!product) {
    notFound()
  }

  const breadcrumbs = product.breadcrumbs.map((crumb, index, array) => ({
    ...crumb,
    active: index === array.length - 1,
  }))

  const mainImage = product.images[0] ?? '/images/home/hero-bg.png'

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="border-b border-[#E5DECF] bg-white py-6 sm:py-8">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 ? <span className="text-[#232326]/35">•</span> : null}
                  {crumb.active ? (
                    <span className="text-[#232326]/70">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="transition-colors hover:text-[#232326]">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h1 className="text-2xl font-bold leading-tight text-[#1F1F1F] sm:text-3xl lg:text-4xl">{product.name}</h1>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-xl border border-[#E5DECF] bg-[#E8E4DC] lg:max-w-none">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              {product.briefDescription ? (
                <p className="mb-4 text-base leading-relaxed text-[#232326]/85 sm:text-lg">{product.briefDescription}</p>
              ) : null}

              <p className="mb-6 text-base leading-relaxed text-[#232326] sm:text-lg">{product.description}</p>

              <div className="mb-6">
                <p className="text-2xl font-bold text-[#1F1F1F] sm:text-3xl">
                  {product.price > 0 ? (
                    <>
                      {product.price.toLocaleString('ru-RU')}₽
                      <span className="text-lg font-normal text-[#232326]/60 sm:text-xl"> / {product.series}</span>
                    </>
                  ) : (
                    'Цена по запросу'
                  )}
                </p>
              </div>

              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  model: product.series,
                  price: product.price,
                  image: mainImage,
                  href: `/catalog/${product.id}`,
                }}
                label="В корзину"
                variant="primary"
                className="w-full rounded-lg bg-[#3D8C13] px-8 py-3 text-base font-medium text-white hover:bg-[#347710] sm:w-auto sm:min-w-[220px]"
              />
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <ProductTabs product={product} />
          </div>
        </div>
      </section>
    </div>
  )
}
