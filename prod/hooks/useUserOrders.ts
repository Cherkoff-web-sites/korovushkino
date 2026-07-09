'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { StoredOrder } from '@/lib/adminDataStore'
import { getOrdersForUser, isActiveOrderStatus } from '@/lib/userOrders'

export function useUserOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [loading, setLoading] = useState(true)

  const email = user?.email || user?.login || ''

  const reload = useCallback(async () => {
    if (!email) {
      setOrders([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const next = await getOrdersForUser(email)
      setOrders(next)
    } finally {
      setLoading(false)
    }
  }, [email])

  useEffect(() => {
    void reload()
    window.addEventListener('admin-orders-updated', reload)
    window.addEventListener('storage', reload)
    return () => {
      window.removeEventListener('admin-orders-updated', reload)
      window.removeEventListener('storage', reload)
    }
  }, [reload])

  const activeOrders = orders.filter((order) => isActiveOrderStatus(order.status))
  const completedOrders = orders.filter((order) => !isActiveOrderStatus(order.status))

  return { orders, activeOrders, completedOrders, loading, reload }
}
