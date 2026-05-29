/** Данные отзывов для главной и страницы отзывов по товару. */

export const REPLY_AUTHOR_LABEL = 'Семейная ферма «Коровушкино»' as const

export const HOME_REVIEW_BODY =
  'Очень вкусное, натуральное молоко. Без запаха, очень приятно пить его. Буду заказывать еще!' as const

export function replyTextForAuthor(name: string) {
  return `Здравствуйте, ${name}! Большое спасибо за положительный отзыв)`
}

export type ReviewVariant = {
  id: string
  authorName: string
  date: string
  replyDate: string
}

export type ReviewCardModel = {
  id: string
  authorName: string
  date: string
  rating: number
  text: string
  reply: {
    authorLabel: string
    date: string
    text: string
  }
}

/** Карусель на главной — 6 вкладок */
export const HOME_REVIEW_VARIANTS: readonly ReviewVariant[] = [
  { id: '1', authorName: 'Наталья', date: '15.03.2026', replyDate: '16.03.2026' },
  { id: '2', authorName: 'Яна', date: '19.10.2025', replyDate: '20.10.2025' },
  { id: '3', authorName: 'Елена', date: '08.11.2025', replyDate: '09.11.2025' },
  { id: '4', authorName: 'Евгения', date: '10.01.2026', replyDate: '11.01.2026' },
  { id: '5', authorName: 'Виктор', date: '19.02.2026', replyDate: '20.02.2026' },
  { id: '6', authorName: 'Ольга', date: '25.02.2026', replyDate: '26.02.2026' },
] as const

/** Страница отзывов к товару — блок из трёх карточек (как в макете). */
export const PRODUCT_PAGE_REVIEW_VARIANTS: readonly ReviewVariant[] = [
  { id: 'p1', authorName: 'Татьяна', date: '15.03.2026', replyDate: '16.03.2026' },
  { id: 'p2', authorName: 'Яна', date: '19.10.2025', replyDate: '20.10.2025' },
  { id: 'p3', authorName: 'Ксения', date: '08.11.2025', replyDate: '09.11.2025' },
] as const

export function buildReviewCards(
  variants: readonly ReviewVariant[],
  body: string,
): ReviewCardModel[] {
  return variants.map((v) => ({
    id: v.id,
    authorName: v.authorName,
    date: v.date,
    rating: 5,
    text: body,
    reply: {
      authorLabel: REPLY_AUTHOR_LABEL,
      date: v.replyDate,
      text: replyTextForAuthor(v.authorName),
    },
  }))
}
