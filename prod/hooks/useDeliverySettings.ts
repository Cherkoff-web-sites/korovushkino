'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADMIN_PREVIEW } from '@/lib/adminPreview'
import {
  adminSaveDeliverySettings,
  fetchPublicDeliverySettings,
} from '@/lib/api/adminSiteApi'
import {
  DEFAULT_DELIVERY_SETTINGS,
  type DeliverySettings,
  readDeliverySettings,
  writeDeliverySettings,
} from '@/lib/deliverySettings'

export function useDeliverySettings() {
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(async () => {
    if (ADMIN_PREVIEW) {
      setSettings(readDeliverySettings())
      setHydrated(true)
      return
    }

    try {
      const data = await fetchPublicDeliverySettings()
      writeDeliverySettings(data.settings)
      setSettings(data.settings)
    } catch {
      setSettings(readDeliverySettings())
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    void reload()
    const onUpdate = () => {
      void reload()
    }
    window.addEventListener('delivery-settings-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('delivery-settings-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [reload])

  const save = useCallback(async (next: DeliverySettings) => {
    writeDeliverySettings(next)
    setSettings(next)

    if (!ADMIN_PREVIEW) {
      try {
        await adminSaveDeliverySettings(next)
      } catch {
        // Настройки уже в localStorage — админ увидит их при следующей загрузке.
      }
    }
  }, [])

  const reset = useCallback(async () => {
    await save(DEFAULT_DELIVERY_SETTINGS)
  }, [save])

  return { settings, hydrated, save, reset }
}
