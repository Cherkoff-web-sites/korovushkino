'use client'

import AdminImageField from './AdminImageField'
import { adminPanelClass } from './adminStyles'

type ProductImagePreviewProps = {
  src: string
  alt: string
  onChange: (url: string) => void
}

export default function ProductImagePreview({ src, alt, onChange }: ProductImagePreviewProps) {
  return (
    <div className={adminPanelClass}>
      <div className="border-b border-[#e8eaef] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#1F1F1F]">Фото товара</h3>
        <p className="mt-0.5 text-xs text-[#707070]">{alt}</p>
      </div>
      <div className="p-4">
        <AdminImageField
          label="Основное фото"
          value={src}
          onChange={onChange}
          previewAspect="square"
        />
      </div>
    </div>
  )
}
