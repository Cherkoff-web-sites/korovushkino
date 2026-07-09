'use client'

import { adminInputClass } from '@/components/admin/adminStyles'
import type { HeadingTag } from '@/lib/contentBlocks'
import { HEADING_TAG_OPTIONS, PAGE_TITLE_TAG_OPTIONS } from '@/lib/contentBlocks'

type AdminTaggedTextFieldProps = {
  label: string
  value: string
  tag: HeadingTag
  onValueChange: (value: string) => void
  onTagChange: (tag: HeadingTag) => void
  multiline?: boolean
  rows?: number
  pageTitle?: boolean
}

export default function AdminTaggedTextField({
  label,
  value,
  tag,
  onValueChange,
  onTagChange,
  multiline = false,
  rows = 3,
  pageTitle = false,
}: AdminTaggedTextFieldProps) {
  const options = pageTitle ? PAGE_TITLE_TAG_OPTIONS : HEADING_TAG_OPTIONS

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[#707070]">{label}</span>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#707070]">Тег:</span>
        <select
          value={tag}
          onChange={(event) => onTagChange(event.target.value as HeadingTag)}
          className={`${adminInputClass} w-auto min-w-[160px]`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {multiline ? (
        <textarea
          rows={rows}
          className={`${adminInputClass} resize-y`}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
      ) : (
        <input className={adminInputClass} value={value} onChange={(event) => onValueChange(event.target.value)} />
      )}
    </label>
  )
}
