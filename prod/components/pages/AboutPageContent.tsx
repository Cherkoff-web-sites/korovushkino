'use client'

import { usePagesContent } from '@/hooks/usePagesContent'
import ContentImage from '@/components/ui/ContentImage'
import { RenderContentBlocks, TaggedHeading } from '@/components/ui/RenderTaggedContent'
import { resolveHeadingTag } from '@/lib/contentBlocks'

function AboutImage({ src, alt, sizes }: { src: string; alt: string; sizes?: string }) {
  return (
    <div className="relative min-h-[220px] w-full overflow-hidden rounded-xl sm:min-h-[280px] lg:min-h-[360px]">
      <ContentImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes ?? '(max-width: 1024px) 100vw, 58vw'}
      />
    </div>
  )
}

export default function AboutPageContent() {
  const { content } = usePagesContent()
  const { about } = content

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="py-10 sm:py-12 lg:py-14">
        <div className="container">
          <TaggedHeading
            tag={resolveHeadingTag(about.pageTitleTag, 'h1')}
            className="mb-10 text-[36px] font-normal leading-tight text-black sm:mb-[40px] lg:mb-[40px]"
          >
            {about.pageTitle}
          </TaggedHeading>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <AboutImage src={about.origin.image} alt={about.origin.imageAlt} />
            </div>
            <div className="lg:col-span-5">
              <TaggedHeading
                tag={resolveHeadingTag(about.origin.titleTag, 'h2')}
                className="mb-3 text-[20px] font-bold leading-snug text-black"
              >
                {about.origin.title}
              </TaggedHeading>
              <RenderContentBlocks
                blocks={about.origin.blocks}
                className="space-y-4 text-[16px] font-normal leading-relaxed text-black"
              />
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:mb-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-7">
              <TaggedHeading
                tag={resolveHeadingTag(about.farm.titleTag, 'h2')}
                className="mb-3 text-[20px] font-bold leading-snug text-black"
              >
                {about.farm.title}
              </TaggedHeading>
              <RenderContentBlocks
                blocks={about.farm.blocks}
                className="space-y-4 text-[16px] font-normal leading-relaxed text-black"
              />
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
              <TaggedHeading
                tag={resolveHeadingTag(about.production.titleTag, 'h2')}
                className="mb-3 text-[20px] font-bold leading-snug text-black"
              >
                {about.production.title}
              </TaggedHeading>
              <RenderContentBlocks
                blocks={about.production.blocks}
                className="space-y-4 text-[16px] font-normal leading-relaxed text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <TaggedHeading
                tag={resolveHeadingTag(about.why.titleTag, 'h2')}
                className="mb-3 text-[20px] font-bold leading-snug text-black"
              >
                {about.why.title}
              </TaggedHeading>
              <RenderContentBlocks
                blocks={about.why.blocks}
                className="space-y-4 text-[16px] font-normal leading-relaxed text-black"
              />
            </div>
            <div className="hidden min-h-[1px] lg:col-span-5 lg:block" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  )
}
