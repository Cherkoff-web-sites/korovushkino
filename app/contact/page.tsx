import type { Metadata } from 'next'
import { getContent } from '@/lib/api/contentApi'

// SSG страница для контактов
export const metadata: Metadata = {
  title: 'Контакты | CAREL Professional Service',
  description: 'Контактная информация CAREL Professional Service',
}

export default async function ContactPage() {
  const content = await getContent()
  const contactContent = content.contact || {
    address: 'Россия, Москва, ЗАО, Минская ул., д.2 "г", корп.1 БЦ КУТУЗОВ ХОЛЛ',
    workingHours: 'Пн-Пт 09:00 - 18:00',
    email: 'servicecarel@yandex.ru',
  }
  return (
    <div className="min-h-screen">
      {/* Секция "КОНТАКТЫ" */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-[#3D8C13]">
            КОНТАКТЫ
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Левая часть - Контактная информация */}
            <div className="space-y-6">
              {/* Адрес */}
              <div>
                <p className="text-[#232326] text-base sm:text-lg">
                  <span className="text-[#232326]/75">Адрес:</span>{' '}
                  <span>{contactContent.address}</span>
                </p>
              </div>

              {/* Режим работы */}
              <div>
                <p className="text-[#232326] text-base sm:text-lg">
                  <span className="text-[#232326]/75">Режим работы:</span>{' '}
                  <span>{contactContent.workingHours}</span>
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-[#232326] text-base sm:text-lg">
                  <span className="text-[#232326]/75">E-mail:</span>{' '}
                  <a
                    href={`mailto:${contactContent.email}`}
                    className="text-[#232326] hover:text-[#3D8C13] transition-colors"
                  >
                    {contactContent.email}
                  </a>
                </p>
              </div>

              {/* Иконки социальных сетей */}
              <div className="flex items-center gap-4 pt-4">
                <a
                  href="https://t.me/+79295385634"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3D8C13] hover:bg-[#3D8C13]/90 transition-colors"
                  aria-label="Telegram"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.06 14.14 10.67 13.81 11.2 13.25C11.35 13.09 14.2 10.45 14.27 10.19C14.28 10.14 14.29 10.01 14.2 9.94C14.12 9.87 14 9.9 13.93 9.92C13.82 9.95 11.85 11.18 8.87 12.87C8.35 13.13 7.87 13.26 7.44 13.25C6.96 13.24 6.06 13.03 5.36 12.85C4.52 12.63 3.83 12.51 3.88 12.08C3.9 11.91 4.19 11.74 4.64 11.56C8.78 9.88 11.91 8.65 14.02 7.88C14.37 7.77 14.69 7.72 14.97 7.72C15.28 7.72 15.87 7.82 16.15 8.12C16.39 8.36 16.48 8.66 16.64 8.8Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="tel:+79999999999"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3D8C13] hover:bg-[#3D8C13]/90 transition-colors"
                  aria-label="Телефон"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Правая часть - Карта */}
            <div className="bg-[#2A2529] rounded-lg overflow-hidden min-h-[400px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A80f5bd24b896059025511c8a84fa0ae344d2b14e86d022fb06304bc1495daf80&source=constructor"
                width="100%"
                height="400"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

