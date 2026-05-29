import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'О нас | Коровушкино',
  description:
    'Ферма «Коровушкино» в Тульской области: как всё началось, наше хозяйство, производство и ценности семейной фермы.',
}

/**
 * Три иллюстрации страницы «О нас» — положите в `public/images/`:
 *   about-origin.webp  — пейзаж / «С чего все началось»
 *   about-farm.webp    — хозяйство / коровы
 *   about-cheese.webp  — производство / сыры
 */
const IMG_ORIGIN = '/images/about-origin.webp'
const IMG_FARM = '/images/about-farm.webp'
const IMG_CHEESE = '/images/about-cheese.webp'

function AboutImage({ src, alt, sizes }: { src: string; alt: string; sizes?: string }) {
  return (
    <div className="relative min-h-[220px] w-full overflow-hidden rounded-xl sm:min-h-[280px] lg:min-h-[360px]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes ?? '(max-width: 1024px) 100vw, 58vw'}
      />
    </div>
  )
}

function BodyBlock({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[16px] font-normal leading-relaxed text-black">{children}</div>
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="py-10 sm:py-12 lg:py-14">
        <div className="container">
          <h1 className="mb-10 text-[36px] font-normal leading-tight text-black sm:mb-[40px] lg:mb-[40px]">
            О нас
          </h1>

          {/* С чего всё началось: картинка 7 | текст 5 */}
          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <AboutImage src={IMG_ORIGIN} alt="Пейзаж Тульской области — место фермы «Коровушкино»" />
            </div>
            <div className="lg:col-span-5">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">С чего все началось</h2>
              <BodyBlock>
                <p>
                  Ферма «Коровушкино» появилась из простой идеи — делать настоящие продукты, такие, какими они
                  были раньше. Без сложных технологий, без искусственных добавок, только из натурального молока и
                  мяса.
                </p>
                <p>
                  Несколько лет назад наша семья решила вернуться к фермерскому хозяйству. Мы хотели не просто
                  выращивать животных, а создать место, где продукты делают с уважением к природе и традициям.
                </p>
                <p>
                  Так в экологически чистом районе Тульской области появилась небольшая ферма, которая со временем
                  стала делом всей семьи.
                </p>
              </BodyBlock>
            </div>
          </div>

          {/* Наше хозяйство: текст 7 | картинка 5 */}
          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">Наше хозяйство</h2>
              <BodyBlock>
                <p>
                  Сегодня на ферме «Коровушкино» живут коровы, которые дают натуральное молоко для нашей продукции.
                  Животные получают только натуральные корма и содержатся в спокойных и комфортных условиях.
                </p>
                <p>
                  Мы внимательно следим за качеством каждого этапа: от ухода за животными до производства готовых
                  продуктов.
                </p>
                <p>
                  Именно поэтому наше молоко, йогурты, сыры и мясные продукты сохраняют настоящий деревенский вкус.
                </p>
              </BodyBlock>
            </div>
            <div className="lg:col-span-5">
              <AboutImage
                src={IMG_FARM}
                alt="Коровы на ферме «Коровушкино»"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          {/* Как мы делаем продукты: картинка 7 | текст 5 */}
          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <AboutImage src={IMG_CHEESE} alt="Выдержка сыров на ферме" />
            </div>
            <div className="lg:col-span-5">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">Как мы делаем продукты</h2>
              <BodyBlock>
                <p>
                  Мы придерживаемся простого принципа — минимум обработки и максимум натуральности. Молочные продукты
                  на ферме готовятся традиционными методами. Например, часть продукции мы делаем термостатным
                  способом, который позволяет сохранить полезные бактерии и натуральную структуру продукта. Мы не
                  используем искусственные добавки, усилители вкуса или консерванты. Всё, что попадает на ваш стол —
                  это результат натурального производства и свежего фермерского сырья.
                </p>
              </BodyBlock>
            </div>
          </div>

          {/* Почему мы это делаем: текст 7 | пусто 5 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">Почему мы это делаем</h2>
              <BodyBlock>
                <p>Для нас ферма — это не просто бизнес. Это дело, которое мы создаём для людей, ценящих настоящую еду.</p>
                <p>
                  Мы хотим, чтобы каждый покупатель, открывая бутылку молока или баночку йогурта, чувствовал вкус
                  натурального продукта, каким он должен быть.
                </p>
                <p>
                  Ферма «Коровушкино» — это возвращение к простым и честным продуктам, сделанным с заботой о качестве и
                  с уважением к традициям.
                </p>
              </BodyBlock>
            </div>
            <div className="hidden min-h-[1px] lg:col-span-5 lg:block" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  )
}
