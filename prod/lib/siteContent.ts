import type { HeadingTag } from '@/lib/contentBlocks'
import { resolveHeadingTag } from '@/lib/contentBlocks'

export type SocialLink = {
  id: string
  label: string
  href: string
  enabled: boolean
}

export type SiteContent = {
  footer: {
    newsletterTitle: string
    newsletterTitleTag?: HeadingTag
    newsletterText: string
    newsletterTextTag?: HeadingTag
    brandTitle: string
    brandTitleTag?: HeadingTag
    brandDescription: string
    brandDescriptionTag?: HeadingTag
    email: string
    phoneDisplay: string
    phoneHref: string
    socialLinks: SocialLink[]
  }
  returnsModal: {
    title: string
    titleTag?: HeadingTag
    intro: string
    introTag?: HeadingTag
    phoneDisplay: string
    phoneHref: string
    afterPhoneText: string
    afterPhoneTextTag?: HeadingTag
    steps: string[]
    step3Email: string
    paragraphRefund: string
    paragraphRefundTag?: HeadingTag
    paragraphStorage: string
    paragraphStorageTag?: HeadingTag
  }
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  footer: {
    newsletterTitle: 'Подписаться на рассылку',
    newsletterTitleTag: 'h2',
    newsletterText:
      'Подпишитесь на рассылку и узнавайте первыми о новых продуктах и новостях нашей фермы.',
    newsletterTextTag: 'p',
    brandTitle: 'Коровушкино',
    brandTitleTag: 'h3',
    brandDescription:
      '«Коровушкино» — это вкус настоящих фермерских продуктов с малых хозяйств. Мы сотрудничаем с проверенными фермерами, которые производят натуральные продукты из качественного сырья. Наша задача — сохранить этот вкус и доставить его прямо к вашему столу, чтобы в каждом продукте чувствовалась настоящая деревенская свежесть и натуральность.',
    brandDescriptionTag: 'p',
    email: '89251404805@mail.ru',
    phoneDisplay: '8 (925) 140-48-05',
    phoneHref: 'tel:+79251404805',
    socialLinks: [
      { id: 'telegram', label: 'Telegram', href: 'https://telegram.org', enabled: true },
      { id: 'whatsapp', label: 'WhatsApp', href: 'https://www.whatsapp.com', enabled: true },
      { id: 'vk', label: 'ВКонтакте', href: 'https://vk.com/', enabled: true },
      { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/', enabled: true },
    ],
  },
  returnsModal: {
    title: 'Возврат продукции',
    titleTag: 'h2',
    intro:
      'Проверяйте товар в присутствии курьера. Если после принятия заказа вы остались недовольны качеством продукции, просим вас незамедлительно позвонить по телефону',
    introTag: 'p',
    phoneDisplay: '8 925 140 48 05',
    phoneHref: 'tel:+79251404805',
    afterPhoneText:
      'Заявка будет рассмотрена в течение двух суток, в зависимости от сложности ситуации и обратной связи от поставщика. Компенсация возможна только в рамках срока годности товара.',
    afterPhoneTextTag: 'p',
    steps: [
      'Сохраните полученный товар до выяснения обстоятельств, даже если он уже был приготовлен.',
      'По просьбе специалистов заморозьте товар, чтобы сохранить его состояние.',
      'Направьте фото и видео продукции вместе с данными по заказу на почту:',
      'При необходимости сохраните товар до прибытия курьера для оформления возврата.',
      'Будет проведена экспертная оценка качества, о результатах сообщим.',
    ],
    step3Email: 'feedback@esh-derevenskoe.ru',
    paragraphRefund:
      'Возврат денежных средств осуществляется на карту клиента или на депозитный счёт в личном профиле — по выбору клиента.',
    paragraphRefundTag: 'p',
    paragraphStorage:
      'Обращаем внимание на соблюдение условий хранения и контроль сроков годности. Условия хранения для всех товаров указаны на карточках товаров на сайте.',
    paragraphStorageTag: 'p',
  },
}

const STORAGE_KEY = 'korovushkino_site_content'

function normalizeSocialHref(id: string, href: string): string {
  const defaultLink = DEFAULT_SITE_CONTENT.footer.socialLinks.find((link) => link.id === id)
  if (!defaultLink) return href
  if (id === 'telegram' && /t\.me\//i.test(href)) return defaultLink.href
  if (id === 'whatsapp' && /wa\.me\//i.test(href)) return defaultLink.href
  return href
}

function mergeSocialLinks(stored?: SocialLink[]): SocialLink[] {
  const defaults = DEFAULT_SITE_CONTENT.footer.socialLinks
  if (!stored?.length) return defaults
  return defaults.map((defaultLink) => {
    const storedLink = stored.find((link) => link.id === defaultLink.id)
    if (!storedLink) return defaultLink
    return {
      ...defaultLink,
      ...storedLink,
      href: normalizeSocialHref(defaultLink.id, storedLink.href),
    }
  })
}

function mergeSiteContent(parsed: Partial<SiteContent>): SiteContent {
  const footer = { ...DEFAULT_SITE_CONTENT.footer, ...parsed.footer }
  const returnsModal = { ...DEFAULT_SITE_CONTENT.returnsModal, ...parsed.returnsModal }

  return {
    ...DEFAULT_SITE_CONTENT,
    ...parsed,
    footer: {
      ...footer,
      newsletterTitleTag: resolveHeadingTag(
        footer.newsletterTitleTag,
        DEFAULT_SITE_CONTENT.footer.newsletterTitleTag
      ),
      newsletterTextTag: resolveHeadingTag(
        footer.newsletterTextTag,
        DEFAULT_SITE_CONTENT.footer.newsletterTextTag
      ),
      brandTitleTag: resolveHeadingTag(footer.brandTitleTag, DEFAULT_SITE_CONTENT.footer.brandTitleTag),
      brandDescriptionTag: resolveHeadingTag(
        footer.brandDescriptionTag,
        DEFAULT_SITE_CONTENT.footer.brandDescriptionTag
      ),
      socialLinks: mergeSocialLinks(parsed.footer?.socialLinks),
    },
    returnsModal: {
      ...returnsModal,
      titleTag: resolveHeadingTag(returnsModal.titleTag, DEFAULT_SITE_CONTENT.returnsModal.titleTag),
      introTag: resolveHeadingTag(returnsModal.introTag, DEFAULT_SITE_CONTENT.returnsModal.introTag),
      afterPhoneTextTag: resolveHeadingTag(
        returnsModal.afterPhoneTextTag,
        DEFAULT_SITE_CONTENT.returnsModal.afterPhoneTextTag
      ),
      paragraphRefundTag: resolveHeadingTag(
        returnsModal.paragraphRefundTag,
        DEFAULT_SITE_CONTENT.returnsModal.paragraphRefundTag
      ),
      paragraphStorageTag: resolveHeadingTag(
        returnsModal.paragraphStorageTag,
        DEFAULT_SITE_CONTENT.returnsModal.paragraphStorageTag
      ),
      steps:
        parsed.returnsModal?.steps !== undefined
          ? parsed.returnsModal.steps
          : DEFAULT_SITE_CONTENT.returnsModal.steps,
    },
  }
}

export function readSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_CONTENT
    return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>)
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

export function writeSiteContent(content: SiteContent) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event('site-content-updated'))
}
