'use client'

import { useState } from 'react'
import { adminInputClass } from './adminStyles'

type AdminImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  previewAspect?: 'square' | 'video' | 'wide'
}

export default function AdminImageField({
  label,
  value,
  onChange,
  placeholder = '/images/home/hero-bg.png',
  previewAspect = 'video',
}: AdminImageFieldProps) {
  const [loadError, setLoadError] = useState(false)
  const trimmed = value.trim()
  const aspectClass =
    previewAspect === 'square'
      ? 'aspect-square max-w-[220px]'
      : previewAspect === 'wide'
        ? 'aspect-[21/9] w-full'
        : 'aspect-video w-full max-w-[320px]'

  return (
    <div className="space-y-2">
      <span className="block text-xs text-[#707070]">{label}</span>

      <div
        className={`relative overflow-hidden rounded-lg border border-[#e2e4ea] bg-[#f7f8fa] ${aspectClass}`}
      >
        {trimmed && !loadError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trimmed}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setLoadError(true)}
            onLoad={() => setLoadError(false)}
          />
        ) : (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-[#707070]">
            {loadError ? (
              <>
                <span className="text-red-600">Не удалось загрузить превью</span>
                <span className="break-all text-xs">{trimmed}</span>
              </>
            ) : (
              <span>Изображение не выбрано</span>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-[#e8eaef] bg-[#f7f8fa] px-3 py-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#707070]">
          Текущее изображение
        </p>
        <p className="mt-1 break-all font-mono text-xs text-[#1F1F1F]">
          {trimmed || '— не задано —'}
        </p>
      </div>

      <input
        type="text"
        value={value}
        onChange={(event) => {
          setLoadError(false)
          onChange(event.target.value)
        }}
        className={adminInputClass}
        placeholder={placeholder}
      />
    </div>
  )
}
