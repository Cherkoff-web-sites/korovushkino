'use client'

import type { DescriptionBlock } from '@/lib/api/productsData'

export function ProductDescription({ description, blocks }: { description: string; blocks?: DescriptionBlock[] }) {
  if (blocks && blocks.length > 0) {
    return (
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-black sm:text-[15px]">
        {blocks.map((block, index) => {
          const text = block.text.trim()
          if (!text) return null
          if (block.type === 'h2') {
            return (
              <h2 key={index} className="text-lg font-semibold text-[#1F1F1F] sm:text-xl">
                {text}
              </h2>
            )
          }
          if (block.type === 'h3') {
            return (
              <h3 key={index} className="text-base font-semibold text-[#1F1F1F] sm:text-lg">
                {text}
              </h3>
            )
          }
          return <p key={index}>{text}</p>
        })}
      </div>
    )
  }

  if (!description.trim()) return null
  return <p className="mt-4 text-sm leading-relaxed text-black sm:text-[15px]">{description}</p>
}
