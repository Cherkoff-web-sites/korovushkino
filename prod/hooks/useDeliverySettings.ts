'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  adminSaveDeliverySettings,
  fetchPublicDeliverySettings,
} from '@/lib/api/adminSiteApi'
import {
  DEFAULT_DELIVERY_SETTINGS,
  type DeliverySettings,
  mergeDeliverySettings,
} from '@/lib/deliverySettings'

export function useDeliverySettings() {
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await fetchPublicDeliverySettings()
      setSettings(mergeDeliverySettings(data.settings))
    } catch {
      setSettings(DEFAULT_DELIVERY_SETTINGS)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    void reload()
    const onUpdate = () => {
      void reload()
    }
    window.addEventListener('delivery-settings-updated', onUpdate)
    return () => {
      window.removeEventListener('delivery-settings-updated', onUpdate)
    }
  }, [reload])

  const save = useCallback(async (next: DeliverySettings) => {
    setSettings(next)
    await adminSaveDeliverySettings(next)
    window.dispatchEvent(new Event('delivery-settings-updated'))
  }, [])

  const reset = useCallback(async () => {
    await save(DEFAULT_DELIVERY_SETTINGS)
  }, [save])

  return { settings, hydrated, save, reset }
}
