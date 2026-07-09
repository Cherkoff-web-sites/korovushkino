'use client'

import { useRef, useState } from 'react'
import { adminInputClass } from '@/components/admin/adminStyles'
import { readImageAsDataUrl } from '@/lib/imageFile'

type AdminImageFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  alt?: string
  onAltChange?: (alt: string) => void
  onRemove?: () => void
  previewAspect?: 'square' | 'video' | 'wide'
}

export default function AdminImageField({
  label,
  value,
  onChange,
  alt = '',
  onAltChange,
  onRemove,
  previewAspect = 'video',
}: AdminImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loadError, setLoadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const trimmed = value.trim()
  const aspectClass =
    previewAspect === 'square'
      ? 'aspect-square max-w-[220px]'
      : previewAspect === 'wide'
        ? 'aspect-[21/9] w-full'
        : 'aspect-video w-full max-w-[320px]'

  async function handleFileSelect(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const dataUrl = await readImageAsDataUrl(file)
      setLoadError(false)
      onChange(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить изображение')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleRemove() {
    setLoadError(false)
    setError('')
    if (onRemove) {
      onRemove()
      return
    }
    onChange('')
  }

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
            alt={alt.trim() || label}
            className="h-full w-full object-cover"
            onError={() => setLoadError(true)}
            onLoad={() => setLoadError(false)}
          />
        ) : (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-[#707070]">
            {loadError ? (
              <span className="text-red-600">Не удалось показать превью</span>
            ) : (
              <span>Изображение не выбрано</span>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleFileSelect(event.target.files?.[0])}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-[#e2e4ea] bg-white px-3 py-2 text-sm text-[#1F1F1F] transition-colors hover:bg-[#f7f8fa] disabled:opacity-60"
        >
          {uploading ? 'Загрузка...' : trimmed ? 'Заменить' : 'Загрузить'}
        </button>
        {trimmed ? (
          <button
            type="button"
            disabled={uploading}
            onClick={handleRemove}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            Удалить
          </button>
        ) : null}
      </div>

      {onAltChange ? (
        <label className="block">
          <span className="mb-1.5 block text-xs text-[#707070]">Подпись к изображению (alt)</span>
          <input
            className={adminInputClass}
            value={alt}
            onChange={(event) => onAltChange(event.target.value)}
            placeholder="Опишите изображение для SEO и доступности"
          />
        </label>
      ) : null}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
