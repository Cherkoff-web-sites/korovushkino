'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import InfoModal from '@/components/ui/InfoModal'
import FooterSocialLinks from '@/components/Footer/FooterSocialLinks'
import { useSiteContent } from '@/hooks/useSiteContent'
import { subscribeToNewsletter } from '@/lib/leadsService'
import { useToast } from '@/contexts/ToastContext'

export default function Footer() {
  const pathname = usePathname()
  const { content } = useSiteContent()
  const { showToast } = useToast()
  const { footer, returnsModal } = content
  const [returnModalOpen, setReturnModalOpen] = useState(false)

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()
    if (!email) {
      showToast('Укажите email')
      return
    }

    const added = await subscribeToNewsletter(email, 'footer')
    form.reset()
    if (added) {
      showToast('Вы подписаны на рассылку')
    } else {
      showToast('Этот email уже в списке подписчиков')
    }
  }

  function goToReviews() {
    if (pathname === '/') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.location.href = '/#reviews'
  }

  return (
    <>
      <footer className="overflow-x-hidden bg-white">
        <div className="relative">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:flex-row lg:items-stretch lg:gap-8 lg:pb-20 lg:pt-14">
            <div className="min-w-0 flex-1 lg:max-w-[min(100%,58%)] lg:pr-4">
              <div className="max-w-2xl">
                <h2 className="text-lg font-bold text-[#1F1F1F] sm:text-xl">{footer.newsletterTitle}</h2>
                <p className="mt-2 text-sm font-normal leading-relaxed text-[#232326]/70 sm:text-[15px]">
                  {footer.newsletterText}
                </p>
                <form className="mt-5" onSubmit={handleNewsletterSubmit}>
                  <label htmlFor="footer-email" className="sr-only">
                    Электронная почта
                  </label>
                  <div className="flex min-h-[52px] w-full max-w-xl overflow-hidden rounded-full border border-[#E5DECF] bg-white transition-[box-shadow] focus-within:border-[#438E1B] focus-within:ring-2 focus-within:ring-[#438E1B]/25 sm:min-h-[56px]">
                    <input
                      id="footer-email"
                      type="email"
                      name="email"
                      placeholder="@mail.ru"
                      className="min-w-0 flex-1 border-0 bg-transparent px-5 py-3 text-[#232326] outline-none placeholder:text-[#232326]/40 sm:px-6 sm:text-[15px]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 bg-[#438E1B] px-5 text-sm font-medium text-white transition-colors hover:bg-[#3a7a17] sm:px-8 sm:text-base"
                    >
                      Подписаться
                    </button>
                  </div>
                </form>
              </div>

              <div className="my-10 h-px w-full bg-[#E5DECF] sm:my-12" aria-hidden />

              <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#E5DECF]">
                <nav className="border-b border-[#E5DECF] py-8 sm:border-b-0 sm:py-0 sm:pr-6">
                  <h3 className="mb-3 text-base font-bold text-[#1F1F1F]">Для клиентов</h3>
                  <ul className="space-y-2 text-sm text-[#232326]/75">
                    <li>
                      <Link href="/account/favorites" className="transition-colors hover:text-[#232326]">
                        Избранное
                      </Link>
                    </li>
                    <li>
                      <Link href="/delivery-payment" className="transition-colors hover:text-[#232326]">
                        Доставка и оплата
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setReturnModalOpen(true)}
                        className="text-left transition-colors hover:text-[#232326]"
                      >
                        Возврат продукции
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={goToReviews}
                        className="text-left transition-colors hover:text-[#232326]"
                      >
                        Отзывы
                      </button>
                    </li>
                  </ul>
                </nav>
                <nav className="border-b border-[#E5DECF] py-8 sm:border-b-0 sm:px-6 sm:py-0">
                  <h3 className="mb-3 text-base font-bold text-[#1F1F1F]">О компании</h3>
                  <ul className="space-y-2 text-sm text-[#232326]/75">
                    <li>
                      <Link href="/contact" className="transition-colors hover:text-[#232326]">
                        Контакты
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="transition-colors hover:text-[#232326]">
                        О нас
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div className="py-8 sm:py-0 sm:pl-6">
                  <h3 className="mb-3 text-base font-bold text-[#1F1F1F]">Контакты</h3>
                  <p className="text-sm text-[#232326]/75">
                    <a
                      href={`mailto:${footer.email}`}
                      className="block transition-colors hover:text-[#232326]"
                    >
                      {footer.email}
                    </a>
                    <a href={footer.phoneHref} className="mt-2 block transition-colors hover:text-[#232326]">
                      {footer.phoneDisplay}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <aside className="w-full shrink-0 lg:mt-0 lg:w-[min(100%,42%)] lg:max-w-[480px] lg:self-stretch">
              <div className="flex h-full min-h-[240px] flex-col justify-center rounded-2xl border border-[#E5DECF] bg-[#FFF8ED] p-6 sm:min-h-[280px] sm:p-8 lg:py-10">
                <h3 className="text-2xl font-bold leading-tight text-[#1F1F1F] sm:text-3xl">
                  {footer.brandTitle}
                </h3>
                <p className="mt-4 text-sm font-normal leading-relaxed text-[#232326] sm:text-base">
                  {footer.brandDescription}
                </p>
                <FooterSocialLinks links={footer.socialLinks} />
              </div>
            </aside>
          </div>
        </div>
      </footer>

      <InfoModal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title={returnsModal.title}
      >
        <p>
          {returnsModal.intro}{' '}
          <a href={returnsModal.phoneHref} className="text-[#438E1B] hover:underline">
            {returnsModal.phoneDisplay}
          </a>
          . Заявка будет рассмотрена в течение двух суток, в зависимости от сложности ситуации и
          обратной связи от поставщика. Компенсация возможна только в рамках срока годности товара.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          {returnsModal.steps.map((step, index) => (
            <li key={index}>
              {step}
              {index === 2 ? (
                <>
                  {' '}
                  <a
                    href={`mailto:${returnsModal.step3Email}`}
                    className="text-[#438E1B] hover:underline"
                  >
                    {returnsModal.step3Email}
                  </a>
                  .
                </>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-4">{returnsModal.paragraphRefund}</p>
        <p className="mt-4">{returnsModal.paragraphStorage}</p>
      </InfoModal>

    </>
  )
}
