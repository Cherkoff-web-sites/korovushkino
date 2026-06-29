'use client'

import Image from 'next/image'
import { useHomeContent } from '@/hooks/useHomeContent'

export default function AboutSection() {
  const { content } = useHomeContent()
  const { about } = content
  const [block1, block2, block3, block4] = about.blocks

  return (
    <section className="bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
      <div className="container">
        <h2 className="mb-[40px] text-[36px] font-normal leading-tight text-black">{about.sectionTitle}</h2>

        <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-8 lg:gap-10">
            {block1 ? (
              <div className="ml-auto w-full max-w-[455px]">
                <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">{block1.title}</h3>
                <p className="text-[16px] font-normal leading-relaxed text-black">{block1.text}</p>
              </div>
            ) : null}
            {block2 ? (
              <div>
                <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">{block2.title}</h3>
                <p className="text-[16px] font-normal leading-relaxed text-black">{block2.text}</p>
              </div>
            ) : null}
          </div>

          <div className="relative min-h-[220px] w-full overflow-hidden rounded-xl lg:col-span-4 lg:min-h-0">
            <Image
              src={about.row1RightImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative min-h-[260px] w-full overflow-hidden rounded-xl sm:min-h-[320px] lg:col-span-8 lg:min-h-[420px]">
            <Image
              src={about.row2LeftImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <div className="grid min-h-0 grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:col-span-4 lg:min-h-[420px] lg:grid-cols-2 lg:gap-6">
            {block3 ? (
              <div className="flex min-h-0 flex-col justify-start lg:justify-end">
                <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">{block3.title}</h3>
                <p className="text-[16px] font-normal leading-relaxed text-black">{block3.text}</p>
              </div>
            ) : null}
            {block4 ? (
              <div className="flex min-h-0 flex-col justify-start">
                <h3 className="mb-3 text-[20px] font-bold leading-snug text-black">{block4.title}</h3>
                <p className="text-[16px] font-normal leading-relaxed text-black">{block4.text}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
