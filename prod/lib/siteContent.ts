export type SocialLink = {
  id: string
  label: string
  href: string
  enabled: boolean
}

export type SiteContent = {
  footer: {
    newsletterTitle: string
    newsletterText: string
    brandTitle: string
    brandDescription: string
    email: string
    phoneDisplay: string
    phoneHref: string
    socialLinks: SocialLink[]
  }
  returnsModal: {
    title: string
    intro: string
    phoneDisplay: string
    phoneHref: string
    steps: string[]
    step3Email: string
    paragraphRefund: string
    paragraphStorage: string
  }
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  footer: {
    newsletterTitle: 'Подписаться на рассылку',
    newsletterText:
      'Подпишитесь на рассылку и узнавайте первыми о новых продуктах и новостях нашей фермы.',
    brandTitle: 'Коровушкино',
    brandDescription:
      '«Коровушкино» — это вкус настоящих фермерских продуктов с малых хозяйств. Мы сотрудничаем с проверенными фермерами, которые производят натуральные продукты из качественного сырья. Наша задача — сохранить этот вкус и доставить его прямо к вашему столу, чтобы в каждом продукте чувствовалась настоящая деревенская свежесть и натуральность.',
    email: '89251404805@mail.ru',
    phoneDisplay: '8 (925) 140-48-05',
    phoneHref: 'tel:+79251404805',
    socialLinks: [
      { id: 'telegram', label: 'Telegram', href: 'https://t.me/+79295385634', enabled: true },
      { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/79251404805', enabled: true },
      { id: 'vk', label: 'ВКонтакте', href: 'https://vk.com/', enabled: true },
      { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/', enabled: true },
    ],
  },
  returnsModal: {
    title: 'Возврат продукции',
    intro:
      'Проверяйте товар в присутствии курьера. Если после принятия заказа вы остались недовольны качеством продукции, просим вас незамедлительно позвонить по телефону',
    phoneDisplay: '8 925 140 48 05',
    phoneHref: 'tel:+79251404805',
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
    paragraphStorage:
      'Обращаем внимание на соблюдение условий хранения и контроль сроков годности. Условия хранения для всех товаров указаны на карточках товаров на сайте.',
  },
}

const STORAGE_KEY = 'korovushkino_site_content'

function mergeSiteContent(parsed: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...parsed,
    footer: {
      ...DEFAULT_SITE_CONTENT.footer,
      ...parsed.footer,
      socialLinks: parsed.footer?.socialLinks?.length
        ? parsed.footer.socialLinks
        : DEFAULT_SITE_CONTENT.footer.socialLinks,
    },
    returnsModal: {
      ...DEFAULT_SITE_CONTENT.returnsModal,
      ...parsed.returnsModal,
      steps: parsed.returnsModal?.steps?.length
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
