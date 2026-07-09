import { parseOrderItems } from '@/lib/userOrders'
import type { StoredOrder } from '@/lib/adminDataStore'
import { request } from '@/lib/api/httpClient'

export type ReviewModerationStatus = 'pending' | 'approved' | 'rejected'

export type UserReview = {
  id: string
  authorEmail: string
  authorName: string
  productId: string
  productLabel: string
  orderId?: string
  date: string
  rating: number
  text: string
  status: ReviewModerationStatus
  replyText?: string
  replyDate?: string
}

const STORAGE_KEY = 'korovushkino_user_reviews'

function normalizeReview(raw: Partial<UserReview>): UserReview {
  return {
    id: String(raw.id || `review-${Date.now()}`),
    authorEmail: String(raw.authorEmail || '').trim().toLowerCase(),
    authorName: String(raw.authorName || 'Покупатель'),
    productId: String(raw.productId || ''),
    productLabel: String(raw.productLabel || 'Товар'),
    orderId: raw.orderId,
    date: String(raw.date || new Date().toLocaleDateString('ru-RU')),
    rating: Math.min(5, Math.max(1, Number(raw.rating) || 5)),
    text: String(raw.text || ''),
    status: raw.status === 'approved' || raw.status === 'rejected' ? raw.status : 'pending',
    replyText: raw.replyText || '',
    replyDate: raw.replyDate || '',
  }
}

function readAll(): UserReview[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map((item) => normalizeReview(item as UserReview)) : []
  } catch {
    return []
  }
}

function writeAll(items: UserReview[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('user-reviews-updated'))
}

export function readUserReviews(): UserReview[] {
  return readAll()
}

export function readReviewsForUser(email: string): UserReview[] {
  const normalized = email.trim().toLowerCase()
  return readAll().filter((item) => item.authorEmail === normalized)
}

export function readApprovedReviews(): UserReview[] {
  return readAll().filter((item) => item.status === 'approved')
}

export function readPendingReviews(): UserReview[] {
  return readAll().filter((item) => item.status === 'pending')
}

export function writeUserReviews(items: UserReview[]) {
  writeAll(items.map((item) => normalizeReview(item)))
}

export function updateReviewStatus(
  id: string,
  status: ReviewModerationStatus,
  extra?: { replyText?: string; replyDate?: string }
) {
  const items = readAll()
  const index = items.findIndex((item) => item.id === id)
  if (index < 0) return false

  items[index] = {
    ...items[index]!,
    status,
    replyText: extra?.replyText ?? items[index]!.replyText,
    replyDate:
      extra?.replyDate ??
      (status === 'approved' ? new Date().toLocaleDateString('ru-RU') : items[index]!.replyDate),
  }
  writeAll(items)
  return true
}

export function deleteUserReview(id: string) {
  writeAll(readAll().filter((item) => item.id !== id))
}

export async function syncReviewsFromApi() {
  try {
    const data = await request<{ reviews: UserReview[] }>('/api/admin/reviews')
    writeAll(data.reviews.map((item) => normalizeReview(item)))
    return readAll()
  } catch {
    return readAll()
  }
}

export async function fetchPublishedReviews() {
  try {
    const data = await request<{ reviews: UserReview[] }>('/api/reviews/published')
    const published = data.reviews.map((item) => normalizeReview(item))
    const rest = readAll().filter((item) => item.status !== 'approved')
    writeAll([...published, ...rest])
    return published
  } catch {
    return readApprovedReviews()
  }
}

export async function fetchMyReviews() {
  try {
    const data = await request<{ reviews: UserReview[] }>('/api/reviews/mine')
    const mine = data.reviews.map((item) => normalizeReview(item))
    const other = readAll().filter(
      (item) => !mine.some((review) => review.id === item.id)
    )
    writeAll([...mine, ...other])
    return mine
  } catch {
    return readAll()
  }
}

export async function submitUserReview(review: Omit<UserReview, 'status'> & { status?: ReviewModerationStatus }) {
  const payload = normalizeReview({ ...review, status: review.status || 'pending' })

  try {
    const data = await request<{ ok: true; review: UserReview }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const saved = normalizeReview(data.review)
    writeAll([saved, ...readAll().filter((item) => item.id !== saved.id)])
    return saved
  } catch {
    writeAll([payload, ...readAll().filter((item) => item.id !== payload.id)])
    return payload
  }
}

export async function moderateReviewOnApi(
  id: string,
  status: ReviewModerationStatus,
  extra?: { replyText?: string }
) {
  const data = await request<{ ok: true; review: UserReview }>(`/api/admin/reviews/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, replyText: extra?.replyText }),
    })
  updateReviewStatus(id, data.review.status, {
    replyText: data.review.replyText,
    replyDate: data.review.replyDate,
  })
}

export function hasUserReviewedProduct(email: string, productId: string) {
  const normalized = email.trim().toLowerCase()
  return readAll().some(
    (item) =>
      item.authorEmail === normalized &&
      item.productId === productId &&
      item.status !== 'rejected'
  )
}

export function getReviewableProducts(orders: StoredOrder[], email: string) {
  const products = new Map<string, { id: string; name: string; orderId: string }>()

  for (const order of orders) {
    for (const item of parseOrderItems(order)) {
      if (hasUserReviewedProduct(email, item.id)) continue
      if (!products.has(item.id)) {
        products.set(item.id, { id: item.id, name: item.name, orderId: order.id })
      }
    }
  }

  return Array.from(products.values())
}

export const REVIEW_STATUS_LABELS: Record<ReviewModerationStatus, string> = {
  pending: 'На модерации',
  approved: 'Опубликован',
  rejected: 'Отклонён',
}
