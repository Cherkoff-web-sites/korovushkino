export type MoscowDistrict = {
  id: string
  name: string
  price: number
}

export type DeliverySettings = {
  moscowRegionPrice: number
  moscowDefaultPrice: number
  outsideMoscowPrice: number | null
  moscowDistricts: MoscowDistrict[]
  moscowKeywords: string[]
  regionKeywords: string[]
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  moscowRegionPrice: 500,
  moscowDefaultPrice: 400,
  outsideMoscowPrice: null,
  moscowDistricts: [
    { id: 'cao', name: 'Центральный (ЦАО)', price: 400 },
    { id: 'sao', name: 'Северный (САО)', price: 450 },
    { id: 'svao', name: 'Северо-Восточный (СВАО)', price: 450 },
    { id: 'vao', name: 'Восточный (ВАО)', price: 450 },
    { id: 'uvao', name: 'Юго-Восточный (ЮВАО)', price: 450 },
    { id: 'uao', name: 'Южный (ЮАО)', price: 450 },
    { id: 'uzao', name: 'Юго-Западный (ЮЗАО)', price: 450 },
    { id: 'zao', name: 'Западный (ЗАО)', price: 450 },
    { id: 'szao', name: 'Северо-Западный (СЗАО)', price: 450 },
    { id: 'zelao', name: 'Зеленоградский (ЗелАО)', price: 500 },
    { id: 'tinao', name: 'Троицкий и Новомосковский (ТиНАО)', price: 550 },
  ],
  moscowKeywords: ['москва'],
  regionKeywords: [
    'московская',
    'подмосков',
    'химки',
    'мытищ',
    'балаших',
    'люберц',
    'одинцов',
    'красногорск',
    'королёв',
    'королев',
  ],
}

const STORAGE_KEY = 'korovushkino_delivery_settings'

function mergeDeliverySettings(parsed: Partial<DeliverySettings>): DeliverySettings {
  return {
    ...DEFAULT_DELIVERY_SETTINGS,
    ...parsed,
    moscowDistricts: parsed.moscowDistricts?.length
      ? parsed.moscowDistricts
      : DEFAULT_DELIVERY_SETTINGS.moscowDistricts,
    moscowKeywords: parsed.moscowKeywords?.length
      ? parsed.moscowKeywords
      : DEFAULT_DELIVERY_SETTINGS.moscowKeywords,
    regionKeywords: parsed.regionKeywords?.length
      ? parsed.regionKeywords
      : DEFAULT_DELIVERY_SETTINGS.regionKeywords,
  }
}

export function readDeliverySettings(): DeliverySettings {
  if (typeof window === 'undefined') return DEFAULT_DELIVERY_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DELIVERY_SETTINGS
    return mergeDeliverySettings(JSON.parse(raw) as Partial<DeliverySettings>)
  } catch {
    return DEFAULT_DELIVERY_SETTINGS
  }
}

export function writeDeliverySettings(settings: DeliverySettings) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new Event('delivery-settings-updated'))
}
