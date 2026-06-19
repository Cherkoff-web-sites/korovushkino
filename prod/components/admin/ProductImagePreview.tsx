import Image from 'next/image'
import { adminPanelClass } from './adminStyles'

export default function ProductImagePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={adminPanelClass}>
      <div className="border-b border-[#e8eaef] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#1F1F1F]">Фото товара</h3>
      </div>
      <div className="p-4">
        <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-lg border border-[#e8eaef] bg-[#f7f8fa]">
          <Image src={src} alt={alt} fill className="object-cover" sizes="220px" />
        </div>
        <button
          type="button"
          disabled
          className="mt-3 rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] px-4 py-2 text-sm text-[#232326]/45"
        >
          Заменить фото
        </button>
      </div>
    </div>
  )
}
