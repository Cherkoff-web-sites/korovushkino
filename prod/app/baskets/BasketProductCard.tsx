import Image from 'next/image'

type BasketProductCardProps = {
  title: string
  description: string
  nutritionPer100: string
  calories: string
  price: number
  imageSrc: string
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
  title,
  description,
  nutritionPer100,
  calories,
  price,
  imageSrc,
  imagePriority = false,
}: BasketProductCardProps) {
  return (
    <article className="flex min-h-0 flex-col-reverse overflow-hidden rounded-xl border border-[#E5DECF] bg-white shadow-sm md:flex-row md:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col p-6 md:p-7 lg:p-8">
        <h2 className="text-2xl font-bold leading-tight text-[#1F1F1F] md:text-[26px]">{title}</h2>
        <div className="mt-3">
          <StarRow />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#232326]/85 md:text-[15px]">{description}</p>
        <div className="mt-4 space-y-1 text-sm leading-snug text-[#232326]/80 md:text-[15px]">
          <p>На 100 гр — {nutritionPer100}</p>
          <p>{calories}</p>
        </div>
        <p className="mt-6 text-2xl font-semibold text-[#1F1F1F] md:text-[28px]">
          {price.toLocaleString('ru-RU')}₽{' '}
          <span className="text-base font-normal text-[#232326]/55 md:text-lg">/ 1 шт</span>
        </p>
        <div className="mt-6 flex flex-wrap items-stretch gap-3">
          <button
            type="button"
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#3D8C13] px-5 text-base font-medium text-white transition-colors hover:bg-[#347710] md:min-w-[200px] md:flex-none md:px-8"
          >
            <Image
              src="/images/header/icon-cart.svg"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] [filter:brightness(0)_invert(1)]"
            />
            В корзину
          </button>
          <button
            type="button"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-lg border border-[#D0D0D0] bg-white text-[#232326] transition-colors hover:border-[#3D8C13] hover:text-[#3D8C13]"
            aria-label="В избранное"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#E8E8E8] md:aspect-auto md:w-[44%] md:min-h-[260px] lg:min-h-[300px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={imagePriority}
        />
      </div>
    </article>
  )
}
