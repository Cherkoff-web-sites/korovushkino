'use client'

import type { ReactNode } from 'react'
import { ADMIN_PREVIEW } from '@/lib/adminPreview'
import AdminAuthGateInner from './AdminAuthGateInner'

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  if (ADMIN_PREVIEW) {
    return <>{children}</>
  }

  return <AdminAuthGateInner>{children}</AdminAuthGateInner>
}
