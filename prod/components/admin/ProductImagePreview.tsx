'use client'

import Image from 'next/image'
import { adminInputClass, adminPanelClass } from './adminStyles'

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
      </div>
      <div className="p-4">
        <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-lg border border-[#e8eaef] bg-[#f7f8fa]">
          <Image src={src || '/images/home/hero-bg.png'} alt={alt} fill className="object-cover" sizes="220px" />
        </div>
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs text-[#707070]">URL изображения</span>
          <input
            type="text"
            value={src}
            onChange={(event) => onChange(event.target.value)}
            className={adminInputClass}
            placeholder="/images/home/hero-bg.png"
          />
        </label>
      </div>
    </div>
  )
}
