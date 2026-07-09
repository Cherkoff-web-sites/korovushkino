'use client'

import Image from 'next/image'
import FavoriteHeartButton from '@/components/FavoriteHeartButton'
import { useCart } from '@/contexts/CartContext'
import { TaggedHeading } from '@/components/ui/RenderTaggedContent'
import type { HeadingTag } from '@/lib/contentBlocks'
import { resolveHeadingTag } from '@/lib/contentBlocks'

const cartIcon = '/images/header/icon-cart.svg'

type BasketProductCardProps = {
  id: string
  title: string
  titleTag?: HeadingTag
  description: string
  descriptionTag?: HeadingTag
  nutritionPer100: string
  calories: string
  price: number
  imageSrc: string
  imageAlt: string
  imagePriority?: boolean
}

function StarRow() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#232326]/60">
      <span>Отзывы</span>
      <span className="flex gap-0.5 text-[#D4D4D4]" aria-hidden>
        {'★★★★★'.split('').map((s, i) => (
          <span key={i} className="text-lg leading-none">
            {s}
          </span>
        ))}
      </span>
    </div>
  )
}

export default function BasketProductCard({
  id,
  title,
  titleTag,
  description,
  descriptionTag,
  nutritionPer100,
  calories,
  price,
  imageSrc,
  imageAlt,
  imagePriority = false,
}: BasketProductCardProps) {
  const { addItem } = useCart()

  const handleCart = () => {
    addItem({
      id,
      name: title,
      model: '1 шт',
      price,
      image: imageSrc,
      href: '/baskets',
    })
  }

  return (
    <article className="flex min-h-0 flex-col-reverse overflow-hidden rounded-xl border border-[#E5DECF] bg-white shadow-sm md:flex-row md:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col p-6 md:p-7 lg:p-8">
        <TaggedHeading
          tag={resolveHeadingTag(titleTag, 'h2')}
          className="text-2xl font-bold leading-tight text-[#1F1F1F] md:text-[26px]"
        >
          {title}
        </TaggedHeading>
        <div className="mt-3">
          <StarRow />
        </div>
        <TaggedHeading
          tag={resolveHeadingTag(descriptionTag, 'p')}
          className="mt-4 text-sm leading-relaxed text-[#232326]/85 md:text-[15px]"
        >
          {description}
        </TaggedHeading>
        <div className="mt-4 space-y-1 text-sm leading-snug text-[#232326]/80 md:text-[15px]">
          <p>На 100 гр — {nutritionPer100}</p>
          <p>{calories}</p>
        </div>
        <p className="mt-6 text-2xl font-semibold text-[#1F1F1F] md:text-[28px]">
          {price.toLocaleString('ru-RU')}₽{' '}
          <span className="text-base font-normal text-[#232326]/55 md:text-lg">/ 1 шт</span>
        </p>
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCart}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#B8B8B8] bg-white text-[#1a3d0f] shadow-sm transition-colors hover:border-[#3D8C13] hover:bg-[#f6fff0]"
            aria-label="В корзину"
          >
            <Image src={cartIcon} alt="" width={22} height={22} />
          </button>
          <FavoriteHeartButton productId={id} iconSize={22} className="h-10 w-10" />
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#E8E8E8] md:aspect-auto md:w-[44%] md:min-h-[260px] lg:min-h-[300px]">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={imagePriority}
        />
      </div>
    </article>
  )
}
