'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { usePagesContent } from '@/hooks/usePagesContent'
import { useSiteContent } from '@/hooks/useSiteContent'
import { TaggedHeading } from '@/components/ui/RenderTaggedContent'
import { resolveHeadingTag } from '@/lib/contentBlocks'

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A4A4A] text-white transition-colors hover:bg-[#3d3d3d] sm:h-11 sm:w-11"
    >
      {children}
    </a>
  )
}

const SOCIAL_ICONS: Record<string, ReactNode> = {
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.96-.63-.35-.96.18-1.52.15-.16 3-2.8 3.07-3.06.01-.05.02-.18-.07-.25-.08-.07-.2-.04-.27-.02-.11.03-2.08 1.26-5.06 2.95-.52.26-1 .39-1.43.38-.45-.01-1.35-.22-2.05-.4-.84-.22-1.53-.34-1.48-.77.02-.17.31-.34.76-.52 4.14-1.68 7.27-2.91 9.38-3.68.35-.11.67-.16.95-.16.31 0 .9.1 1.18.4.24.24.33.54.49.68z" />
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  vk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.491 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.644v4.101c0 .373.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.575 2.15-3.575.17-.305.339-.491.78-.491h1.744c.525 0 .644.305.525.644-.22 1.033-2.35 4.084-2.35 4.084-.203.339-.271.508 0 .847.203.271.78 1.033 1.186 1.659.678 1.033 1.202 1.896 1.338 2.491.17.644-.085.966-.576.966z" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
}

export default function ContactPageContent() {
  const { content } = usePagesContent()
  const { content: siteContent } = useSiteContent()
  const { contact } = content
  const socialLinks = siteContent.footer.socialLinks.filter((link) => link.enabled)

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <section className="border-b border-[#E5DECF] pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12">
        <div className="container">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div>
              <TaggedHeading
                tag={resolveHeadingTag(contact.pageTitleTag, 'h1')}
                className="mb-6 text-[28px] font-normal leading-tight text-[#1F1F1F] sm:mb-8 sm:text-[32px] lg:text-[36px]"
              >
                {contact.pageTitle}
              </TaggedHeading>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
                <div>
                  <TaggedHeading
                    tag={resolveHeadingTag(contact.supportTitleTag, 'h2')}
                    className="mb-3 text-base font-semibold text-[#1F1F1F] sm:text-lg"
                  >
                    {contact.supportTitle}
                  </TaggedHeading>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={contact.phoneHref}
                      className="rounded-lg border border-[#C88C39] bg-[#FFF6E7] px-4 py-2.5 text-center text-sm font-medium text-[#232326] transition-colors hover:border-[#3D8C13] sm:text-[15px]"
                    >
                      {contact.phoneDisplay}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="rounded-lg border border-[#C88C39] bg-[#FFF6E7] px-4 py-2.5 text-center text-sm font-medium text-[#232326] transition-colors hover:border-[#3D8C13] sm:text-[15px]"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div>
                  <TaggedHeading
                    tag={resolveHeadingTag(contact.socialTitleTag, 'h2')}
                    className="mb-3 text-base font-semibold text-[#1F1F1F] sm:text-lg"
                  >
                    {contact.socialTitle}
                  </TaggedHeading>
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.map((link) => (
                      <SocialIcon key={link.id} href={link.href} label={link.label}>
                        {SOCIAL_ICONS[link.id] ?? (
                          <span className="text-xs font-medium">{link.label.slice(0, 1)}</span>
                        )}
                      </SocialIcon>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                <TaggedHeading
                  tag={resolveHeadingTag(contact.legalTitleTag, 'h2')}
                  className="mb-3 text-base font-semibold text-[#1F1F1F] sm:text-lg"
                >
                  {contact.legalTitle}
                </TaggedHeading>
                <div className="max-w-xl space-y-1 text-sm leading-relaxed text-[#232326]/75 sm:text-[15px]">
                  {contact.legalLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[min(100%,380px)] justify-center lg:mx-0 lg:max-w-none lg:justify-end">
              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-full border border-[#E5DECF] bg-[#3D8C13] shadow-md sm:max-w-[360px] lg:max-w-[min(100%,420px)]">
                <Image
                  src={contact.sideImage}
                  alt={contact.sideImageAlt}
                  fill
                  className="object-contain p-[10%]"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
