'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoritesRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/account/favorites')
  }, [router])

  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-[#fdfbf6] text-sm text-[#707070]">
      Переход в личный кабинет...
    </div>
  )
}
