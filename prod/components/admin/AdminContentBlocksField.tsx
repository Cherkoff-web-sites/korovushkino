'use client'

import { adminInputClass } from '@/components/admin/adminStyles'
import type { ContentBlock, ContentBlockType } from '@/lib/contentBlocks'

type AdminContentBlocksFieldProps = {
  label: string
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function AdminContentBlocksField({ label, blocks, onChange }: AdminContentBlocksFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#707070]">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...blocks, { type: 'p', text: '' }])}
          className="rounded-lg border border-[#e2e4ea] px-3 py-1.5 text-xs text-[#707070] hover:bg-[#f7f8fa]"
        >
          Добавить блок
        </button>
      </div>
      {blocks.map((block, index) => (
        <div key={index} className="rounded-lg border border-[#e8eaef] p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <select
              value={block.type}
              onChange={(event) => {
                const next = [...blocks]
                next[index] = { ...block, type: event.target.value as ContentBlockType }
                onChange(next)
              }}
              className={adminInputClass}
            >
              <option value="p">Текст</option>
              <option value="h2">Заголовок H2</option>
              <option value="h3">Заголовок H3</option>
            </select>
            <button
              type="button"
              onClick={() => onChange(blocks.filter((_, i) => i !== index))}
              className="text-xs text-red-600 hover:underline"
            >
              Удалить
            </button>
          </div>
          <textarea
            rows={3}
            value={block.text}
            onChange={(event) => {
              const next = [...blocks]
              next[index] = { ...block, text: event.target.value }
              onChange(next)
            }}
            className={`${adminInputClass} resize-y`}
          />
        </div>
      ))}
    </div>
  )
}
