import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ScrollToTop from '@/components/ScrollToTop'
import ProductImages from './ProductImages'
import ProductTabs from './ProductTabs'
import AddToCartButton from './AddToCartButton'
import { getProduct } from '@/lib/api/productsApi'
import { productsData } from '@/lib/api/productsData'
import { notFound } from 'next/navigation'

export async function generateMetadata({ 
  params 
}: { 
  params: { productId: string } 
}): Promise<Metadata> {
  const product = await getProduct(params.productId) || productsData[params.productId]
  
  if (!product) {
    return {
      title: 'Товар не найден | CAREL Professional Service',
    }
  }

  return {
    title: `${product.name} | ${product.series} — CAREL Professional Service`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(params.productId) || productsData[params.productId]
  
  if (!product) {
    notFound()
  }

  // Хлебные крошки
  const breadcrumbs = product.breadcrumbs.map((crumb, index, array) => ({
    ...crumb,
    active: index === array.length - 1,
  }))

  return (
    <div className="min-h-screen">
      {/* Хлебные крошки и заголовок */}
      <section className="bg-[#2A2529] py-6 sm:py-8">
        <div className="container">
          {/* Хлебные крошки */}
          <nav className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-white/50">/</span>}
                  {crumb.active ? (
                    <span className="text-[#3D8C13] font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-white hover:text-[#3D8C13] transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Заголовок */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D8C13]">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Основной контент */}
      <section className="bg-[#3B363C] py-8 sm:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {/* Левая часть - Изображения */}
            <ProductImages images={product.images} productName={product.name} />

            {/* Правая часть - Описание и кнопки */}
            <div>
              {product.briefDescription && (
                <div className="mb-6">
                  <h3 className="text-[#3D8C13] font-semibold mb-3 text-lg">Краткое описание</h3>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                    {product.briefDescription}
                  </p>
                </div>
              )}
              
              <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Цена */}
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-2">Цена:</p>
                {product.price > 0 ? (
                  <p className="text-white text-3xl sm:text-4xl font-bold">
                    {product.price.toLocaleString('ru-RU')} руб.
                  </p>
                ) : (
                  <p className="text-white text-xl sm:text-2xl font-bold">
                    По запросу
                  </p>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    model: product.series,
                    price: product.price,
                    image: product.images[0],
                    href: `/catalog/${product.id}`,
                  }}
                  label="Заказать"
                  variant="primary"
                  allowZeroPrice
                />
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    model: product.series,
                    price: product.price,
                    image: product.images[0],
                    href: `/catalog/${product.id}`,
                  }}
                  className="w-full sm:w-auto flex-1 border-white text-white hover:bg-white/10"
                />
              </div>
            </div>
          </div>

          {/* Вкладки с описанием */}
          <ProductTabs product={product} />
        </div>
      </section>

      {/* Форма обратной связи */}

      {/* Кнопка скролла наверх */}
      <ScrollToTop />
    </div>
  )
}
