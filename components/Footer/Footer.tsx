'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="overflow-x-hidden bg-white">
      <div className="border-t border-[#E5DECF]" />

      <div className="relative">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:flex-row lg:items-stretch lg:pb-20 lg:pl-4 lg:pr-0">
          {/* Левая колонка */}
          <div className="min-w-0 flex-1 lg:max-w-[min(100%,calc(1280px-400px))] lg:pr-10">
            <div className="max-w-xl">
              <h2 className="text-lg font-normal text-[#232326] sm:text-xl">
                Подписаться на рассылку
              </h2>
              <p className="mt-2 text-sm font-normal leading-relaxed text-[#232326]/70 sm:text-[15px]">
                Подпишитесь на рассылку и узнавайте первыми о новых продуктах и новостях нашей фермы.
              </p>
              <form
                className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Электронная почта
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="@mail.ru"
                  className="min-h-[48px] w-full flex-1 rounded-lg border border-[#E5DECF] bg-white px-4 text-[#232326] outline-none placeholder:text-[#232326]/40 focus:border-[#41801F] focus:ring-2 focus:ring-[#41801F]/25 sm:rounded-l-lg sm:rounded-r-none"
                />
                <button
                  type="submit"
                  className="min-h-[48px] shrink-0 rounded-lg bg-[#41801F] px-6 text-base font-medium text-white transition-colors hover:bg-[#356818] sm:rounded-l-none sm:rounded-r-lg"
                >
                  Подписаться
                </button>
              </form>
            </div>

            <div className="my-10 h-px w-full bg-[#E5DECF] sm:my-12" aria-hidden />

            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:divide-x sm:divide-[#E5DECF]">
              <nav className="border-b border-[#E5DECF] py-8 sm:border-b-0 sm:py-0 sm:pr-6">
                <h3 className="mb-3 text-base font-semibold text-[#232326]">Для клиентов</h3>
                <ul className="space-y-2 text-sm text-[#232326]/75">
                  <li>
                    <Link href="/delivery-payment" className="transition-colors hover:text-[#232326]">
                      Доставка и оплата
                    </Link>
                  </li>
                  <li>
                    <Link href="/return" className="transition-colors hover:text-[#232326]">
                      Возврат продукции
                    </Link>
                  </li>
                  <li>
                    <Link href="/#reviews" className="transition-colors hover:text-[#232326]">
                      Отзывы
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav className="border-b border-[#E5DECF] py-8 sm:border-b-0 sm:px-6 sm:py-0">
                <h3 className="mb-3 text-base font-semibold text-[#232326]">О компании</h3>
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
                <h3 className="mb-3 text-base font-semibold text-[#232326]">Контакты</h3>
                <p className="text-sm text-[#232326]/75">
                  <a
                    href="mailto:89251404805@mail.ru"
                    className="block transition-colors hover:text-[#232326]"
                  >
                    89251404805@mail.ru
                  </a>
                  <a href="tel:+79251404805" className="mt-2 block transition-colors hover:text-[#232326]">
                    8 (925) 140-48-05
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка: бежевый блок уходит вправо за пределы max-width контейнера */}
          <aside className="relative z-0 mt-10 w-full shrink-0 sm:mx-auto sm:max-w-lg lg:mx-0 lg:mt-0 lg:w-[min(100%,420px)] lg:max-w-[min(420px,36vw)] lg:self-stretch lg:pr-0 lg:mr-[calc(50%-50vw)]">
            <div className="h-full rounded-xl border border-[#E5DECF] bg-[#FFF9EF] p-6 sm:p-8 lg:flex lg:min-h-full lg:flex-col lg:justify-center lg:rounded-l-xl lg:rounded-r-none lg:border-r-0 lg:py-10 lg:pl-8 lg:pr-[max(1rem,calc((100vw-1280px)/2+1rem))]">
              <h3 className="text-2xl font-bold leading-tight text-[#232326] sm:text-3xl">Коровушкино</h3>
              <p className="mt-4 text-sm font-normal leading-relaxed text-[#232326] sm:text-base">
                <strong>«Коровушкино»</strong> — это свежие фермерские продукты с понятным происхождением:
                мы выращиваем и производим так, чтобы на вашем столе была натуральная еда и забота о
                качестве от поля до доставки.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </footer>
  )
}
