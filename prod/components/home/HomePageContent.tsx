'use client'

import Image from 'next/image'
import Link from 'next/link'
import AboutSection from '@/components/home/AboutSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import { HIGHLIGHT_LAYOUT } from '@/lib/homeContent'
import { useHomeContent } from '@/hooks/useHomeContent'

export default function HomePageContent() {
  const { content } = useHomeContent()
  const { hero, benefits, highlights } = content

  return (
    <div className="min-h-screen">
      <section
        className="relative bg-cover bg-center bg-no-repeat pb-16 pt-8 sm:pb-20 sm:pt-10 lg:flex lg:h-[calc(50vw-85px)] lg:flex-col lg:justify-center lg:py-0"
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      >
        <div className="container relative z-10">
          <div className="max-w-[402px]">
            <h1 className="mb-5 text-[30px] font-normal leading-[1.2] text-[#FFFFFF] lg:mb-[40px] lg:text-[36px]">
              {hero.title}
            </h1>
            <div className="mb-8 flex flex-col gap-4 lg:mb-[60px]">
              <p className="text-base font-normal leading-[1.45] text-[#FFFFFF] sm:text-lg lg:text-[20px]">
                {hero.paragraph1}
              </p>
              <p className="text-base font-normal leading-[1.45] text-[#FFFFFF] sm:text-lg lg:text-[20px]">
                {hero.paragraph2}
              </p>
            </div>
            <div className="flex">
              <Link
                href={hero.buttonHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#3D8C13] px-8 py-3 text-base font-normal text-[#FFFFFF] transition-colors hover:bg-[#367c11] sm:px-10 sm:text-lg lg:text-[20px]"
              >
                {hero.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-0 bg-[#fdfbf6] py-8 sm:py-10">
        <div className="container">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 xl:gap-5">
            {benefits.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 rounded-lg border border-[#C88C39] bg-[#FFF6E7] p-4 sm:gap-4 sm:p-5"
              >
                <div className="flex shrink-0 items-center justify-center">
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    sizes="20px"
                    className="h-auto w-[20px] object-contain"
                  />
                </div>
                <p className="min-w-0 text-sm font-normal leading-snug text-black sm:text-[15px]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#fdfbf6] py-8 sm:py-10">
        <div className="container">
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-4 lg:gap-5">
            {highlights.map((item) => {
              const layout = HIGHLIGHT_LAYOUT[item.id] ?? {
                lgClass: '',
                tileSize: 'small' as const,
              }
              return (
                <li key={item.id} className={`min-w-0 ${layout.lgClass}`}>
                  <Link
                    href={`/catalog?category=${item.id}`}
                    className="group block h-full min-h-[200px] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf6] lg:min-h-0"
                    aria-label={`${item.title} — перейти в каталог`}
                  >
                    <article
                      className={`relative flex h-full min-h-[200px] overflow-hidden rounded-xl border border-[#C88C39] bg-[#FFF6E7] transition-shadow group-hover:shadow-md lg:min-h-0 ${
                        layout.tileSize === 'large' ? 'aspect-square' : ''
                      }`}
                    >
                      {item.backgroundImage ? (
                        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
                          <Image
                            src={item.backgroundImage}
                            alt=""
                            fill
                            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        </div>
                      ) : null}
                      <h3 className="relative z-10 w-full self-start p-[40px] text-left text-[20px] font-bold leading-snug text-black">
                        {item.title}
                      </h3>
                    </article>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <ReviewsSection />
      <AboutSection />
    </div>
  )
}
