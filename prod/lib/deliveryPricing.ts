import type { DeliverySettings } from '@/lib/deliverySettings'

function normalizeCity(city: string) {
  return city.trim().toLowerCase().replace(/ё/g, 'е')
}

function matchesKeyword(city: string, keywords: string[]) {
  const normalized = normalizeCity(city)
  return keywords.some((keyword) => normalized.includes(keyword.trim().toLowerCase()))
}

export function isMoscowCity(city: string, settings: DeliverySettings) {
  return matchesKeyword(city, settings.moscowKeywords)
}

export function isMoscowRegion(city: string, settings: DeliverySettings) {
  if (isMoscowCity(city, settings)) return false
  return matchesKeyword(city, settings.regionKeywords)
}

export type DeliveryQuote = {
  cost: number | null
  zone: 'moscow' | 'region' | 'outside' | 'unknown'
  label: string
  requiresDistrict: boolean
}

export function calculateDeliveryQuote(
  city: string,
  districtId: string | undefined,
  settings: DeliverySettings
): DeliveryQuote {
  const trimmedCity = city.trim()
  if (!trimmedCity) {
    return {
      cost: null,
      zone: 'unknown',
      label: 'Укажите город',
      requiresDistrict: false,
    }
  }

  if (isMoscowCity(trimmedCity, settings)) {
    const district = settings.moscowDistricts.find((item) => item.id === districtId)
    if (district) {
      return {
        cost: district.price,
        zone: 'moscow',
        label: `Москва, ${district.name}`,
        requiresDistrict: false,
      }
    }
    return {
      cost: settings.moscowDefaultPrice,
      zone: 'moscow',
      label: 'Москва',
      requiresDistrict: true,
    }
  }

  if (isMoscowRegion(trimmedCity, settings)) {
    return {
      cost: settings.moscowRegionPrice,
      zone: 'region',
      label: 'Московская область',
      requiresDistrict: false,
    }
  }

  if (settings.outsideMoscowPrice === null) {
    return {
      cost: null,
      zone: 'outside',
      label: 'Доставка в этот город уточняется менеджером',
      requiresDistrict: false,
    }
  }

  return {
    cost: settings.outsideMoscowPrice,
    zone: 'outside',
    label: 'Другой регион',
    requiresDistrict: false,
  }
}
