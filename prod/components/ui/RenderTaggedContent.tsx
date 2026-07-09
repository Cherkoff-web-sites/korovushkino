import type { ReactNode } from 'react'
import type { ContentBlock, HeadingTag } from '@/lib/contentBlocks'

type TaggedHeadingProps = {
  tag: HeadingTag
  children: ReactNode
  className?: string
}

export function TaggedHeading({ tag, children, className }: TaggedHeadingProps) {
  if (tag === 'h1') return <h1 className={className}>{children}</h1>
  if (tag === 'h2') return <h2 className={className}>{children}</h2>
  if (tag === 'h3') return <h3 className={className}>{children}</h3>
  return <p className={className}>{children}</p>
}

type RenderContentBlocksProps = {
  blocks: ContentBlock[]
  className?: string
  headingClassName?: string
  paragraphClassName?: string
}

export function RenderContentBlocks({
  blocks,
  className,
  headingClassName,
  paragraphClassName,
}: RenderContentBlocksProps) {
  if (!blocks.length) return null

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const text = block.text.trim()
        if (!text) return null
        if (block.type === 'h2') {
          return (
            <h2 key={index} className={headingClassName}>
              {text}
            </h2>
          )
        }
        if (block.type === 'h3') {
          return (
            <h3 key={index} className={headingClassName}>
              {text}
            </h3>
          )
        }
        return (
          <p key={index} className={paragraphClassName}>
            {text}
          </p>
        )
      })}
    </div>
  )
}
