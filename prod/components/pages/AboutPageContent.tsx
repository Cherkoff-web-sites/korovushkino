'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { usePagesContent } from '@/hooks/usePagesContent'

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

export default function AboutPageContent() {
  const { content } = usePagesContent()
  const { about } = content

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="py-10 sm:py-12 lg:py-14">
        <div className="container">
          <h1 className="mb-10 text-[36px] font-normal leading-tight text-black sm:mb-[40px] lg:mb-[40px]">
            {about.pageTitle}
          </h1>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <AboutImage src={about.origin.image} alt={about.origin.imageAlt} />
            </div>
            <div className="lg:col-span-5">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">{about.origin.title}</h2>
              <BodyBlock>
                {about.origin.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </BodyBlock>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">{about.farm.title}</h2>
              <BodyBlock>
                {about.farm.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </BodyBlock>
            </div>
            <div className="lg:col-span-5">
              <AboutImage
                src={about.farm.image}
                alt={about.farm.imageAlt}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <AboutImage src={about.production.image} alt={about.production.imageAlt} />
            </div>
            <div className="lg:col-span-5">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">{about.production.title}</h2>
              <BodyBlock>
                {about.production.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </BodyBlock>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="mb-3 text-[20px] font-bold leading-snug text-black">{about.why.title}</h2>
              <BodyBlock>
                {about.why.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </BodyBlock>
            </div>
            <div className="hidden min-h-[1px] lg:col-span-5 lg:block" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  )
}
