'use client'

import type { ReactNode } from 'react'
import AdminAuthGateInner from './AdminAuthGateInner'

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  return <AdminAuthGateInner>{children}</AdminAuthGateInner>
}
