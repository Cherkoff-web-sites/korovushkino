import type { Metadata } from 'next'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { getContent } from '@/lib/api/contentApi'

// SSG страница - генерируется статически для SEO
export const metadata: Metadata = {
  title: 'О компании | CAREL Professional Service',
  description: 'Информация о компании CAREL Professional Service',
}

export default async function AboutPage() {
  const content = await getContent()
  const aboutContent = content.about || {
    paragraphs: [
      'Наша компания специализируется на разработке и реализации решения для электропривода. Обеспечиваем полный цикл ввода оборудования в эксплуатацию, а также его последующее обслуживание.',
      'Мы ценим время наших клиентов, поэтому наши инженеры готовы оперативно решить любые вопросы и обеспечить бесперебойную работу вашего оборудования. Вся продукция сертифицирована и производится под строгим контролем на наших партнерских заводах. Мы используем только лучшие комплектующие мировых брендов, таких как FAG, SKF, ZWZ, TDK, Vishay и др. Каждый компонент проходит строгий контроль, что гарантирует надежность и долговечность поставляемого оборудования.',
      'Выбирая CAREL Professional Service, вы выбираете надёжного партнёра по сервису увлажнителей CAREL — от подбора оборудования до монтажа и обслуживания.',
    ],
  }
  return (
    <div className="min-h-screen">
      {/* Секция "О КОМПАНИИ" */}
      <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        {/* Фоновый градиент */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#3D8C13]/20 to-transparent pointer-events-none"></div>
        
        <div className="container relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-[#3D8C13]">
            О КОМПАНИИ
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Левая часть - Текст и кнопка */}
            <div>
              <div className="space-y-6 text-[#232326]/90 text-base sm:text-lg leading-relaxed mb-8">
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Кнопка "Скачать презентацию" */}
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Скачать презентацию
              </Button>
            </div>

            {/* Правая часть - Изображение */}
            <div className="relative">
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/about.webp"
                  alt="О компании"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

