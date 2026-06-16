import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/api/productsApi'
import { productsData, CATEGORY_LABELS } from '@/lib/api/productsData'
import { productPageHref } from '@/lib/catalogPaths'
import ReviewAccountAvatar from '@/components/reviews/ReviewAccountAvatar'
import { buildReviewCards, HOME_REVIEW_BODY, PRODUCT_PAGE_REVIEW_VARIANTS } from '@/lib/reviewsData'

const PLACEHOLDER = '/images/home/hero-bg.png'

export function generateStaticParams() {
  return Object.keys(productsData).map((productId) => ({ productId }))
}

function StarsFilled({ count, suffix }: { count: number; suffix: string }) {
  return (
    <div className="flex gap-0.5 text-[#C88C39]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={`star-${suffix}-${i}`} className={`text-base sm:text-lg ${i < count ? 'opacity-100' : 'opacity-25'}`}>
          ★
        </span>
      ))}
    </div>
  )
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

  const mainImage = product.images[0] ?? PLACEHOLDER
  const reviews = buildReviewCards(PRODUCT_PAGE_REVIEW_VARIANTS, HOME_REVIEW_BODY)
  const categoryHref = `/catalog?category=${product.categorySlug}`
  const categoryLabel = CATEGORY_LABELS[product.categorySlug]

  return (
    <div className="min-h-screen bg-white">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="border-b border-[#E5DECF] py-6 sm:py-8">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55 sm:text-[15px]" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#232326]">
                  Главная
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href="/catalog" className="transition-colors hover:text-[#232326]">
                  Каталог
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href={categoryHref} className="transition-colors hover:text-[#232326]">
                  {categoryLabel}
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href={productPageHref(product.id)} className="transition-colors hover:text-[#232326]">
                  {product.name}
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]/70">Отзывы</li>
            </ol>
          </nav>

          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            Отзывы: {product.name}
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 space-y-5 lg:col-span-8">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <ReviewAccountAvatar size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-base font-medium text-black">{review.authorName}</span>
                        <time className="text-sm text-[#232326]/70" dateTime={review.date}>
                          {review.date}
                        </time>
                      </div>
                      <div className="mt-2">
                        <StarsFilled count={review.rating} suffix={review.id} />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-black sm:text-[15px]">{review.text}</p>

                  <div className="ml-8 mt-5 rounded-lg border border-[#D2B48C]/80 bg-[#FFF6E7] p-4 sm:ml-12 sm:p-5 lg:ml-14">
                    <div className="flex flex-wrap items-start gap-3">
                      <ReviewAccountAvatar size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-black">{review.reply.authorLabel}</span>
                          <time className="text-sm text-[#232326]/70" dateTime={review.reply.date}>
                            {review.reply.date}
                          </time>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-black sm:text-[15px]">{review.reply.text}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-6">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F5F0E8]">
                    <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 320px" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold leading-tight text-black sm:text-2xl">{product.name}</h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-base text-black">Рейтинг 5.0</span>
                    <span className="text-2xl leading-none text-[#C88C39]" aria-hidden>
                      ★
                    </span>
                  </div>
                  <Link
                    href={productPageHref(product.id)}
                    className="mt-6 inline-block text-sm font-medium text-[#3D8C13] underline-offset-2 hover:underline"
                  >
                    ← К товару
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
