'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminEditRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')?.trim()
    if (id) {
      router.replace(`/admin/catalog?edit=${encodeURIComponent(id)}`)
      return
    }
    router.replace('/admin/catalog')
  }, [router, searchParams])

  return <p className="text-sm text-[#707070]">Переход к редактору...</p>
}
