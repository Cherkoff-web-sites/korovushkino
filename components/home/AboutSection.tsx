import Image from 'next/image'

const aboutImages = {
  row1Right: '/images/home/about/row1-farm-landscape.png',
  row2Left: '/images/home/about/row2-cows-pasture.png',
} as const

export default function AboutSection() {
  return (
    <section className="bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
      <div className="container">
        <h2 className="mb-[40px] text-[36px] font-normal leading-tight text-black">О нас</h2>

        {/* Строка 1: текст 8/12 | картинка 4/12 */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-8 lg:gap-10">
            <div className="ml-auto w-full max-w-[455px]">
              <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">Наша ферма</h3>
              <p className="text-[16px] font-normal leading-relaxed text-black">
                «Коровушкино» — семейная ферма в Тульской области. Мы выращиваем животных и ведём
                хозяйство бережно к земле, чтобы вы получали продукты с понятным происхождением и
                заботой о качестве на каждом этапе.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">
                Натуральные продукты
              </h3>
              <p className="text-[16px] font-normal leading-relaxed text-black">
                Делаем натуральные молочные и мясные продукты из сырья с нашей фермы — короткая
                цепочка от поля и фермы до вашего стола, без лишних промежутков.
              </p>
            </div>
          </div>

          <div className="relative min-h-[220px] w-full overflow-hidden rounded-xl lg:col-span-4 lg:min-h-0">
            <Image
              src={aboutImages.row1Right}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority={false}
            />
          </div>
        </div>

        {/* Строка 2: картинка 8/12 | текст 4/12 (слева внизу / справа сверху внутри 4/12) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative min-h-[260px] w-full overflow-hidden rounded-xl sm:min-h-[320px] lg:col-span-8 lg:min-h-[420px]">
            <Image
              src={aboutImages.row2Left}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <div className="grid min-h-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:col-span-4 lg:min-h-[420px] lg:grid-cols-2 lg:gap-6">
            <div className="flex min-h-0 flex-col justify-start lg:justify-end">
              <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">
                Вкус из детства
              </h3>
              <p className="text-[16px] font-normal leading-relaxed text-black">
                Опираемся на простые рецепты и натуральные ингредиенты — так сохраняется тот самый
                вкус, к которому хочется возвращаться, как к воспоминанию из детства.
              </p>
            </div>
            <div className="flex min-h-0 flex-col justify-start">
              <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">
                Натуральные корма
              </h3>
              <p className="text-[16px] font-normal leading-relaxed text-black">
                Животные получают натуральные корма; мы не используем гормоны роста и не добавляем
                антибиотики в рацион «на всякий случай» — только ответственное содержание.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
