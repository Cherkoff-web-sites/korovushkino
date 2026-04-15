import type { Metadata } from 'next'
import Image from 'next/image'

// SSG страница - генерируется статически для SEO
export const metadata: Metadata = {
  title: 'Услуги | CAREL Professional Service',
  description:
    'Услуги CAREL Professional Service: шефмонтаж, пусконаладка, обучение персонала, сервис увлажнителей.',
}

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: 'Шефмонтаж',
      image: '/images/services/preproject.webp',
    },
    {
      id: 2,
      name: 'Пусконаладка',
      image: '/images/services/commissioning.webp',
    },
    {
      id: 3,
      name: 'Обучение персонала',
      image: '/images/services/training.webp',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Секция "УСЛУГИ" */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12">
            <span className="bg-gradient-to-r from-[#3D8C13] to-[#3D8C13] bg-clip-text text-transparent">
              УСЛУГИ
            </span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative bg-[#2A2529] rounded-lg p-6 sm:p-8 flex flex-col items-center hover:opacity-90 transition-all"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(#2A2529, #2A2529), linear-gradient(to right, #3D8C13, #3D8C13)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
                {/* Иконка */}
                <div className="mb-6 flex items-center justify-center">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                    sizes="80px"
                  />
                </div>

                {/* Название услуги */}
                <h3 className="text-white text-lg sm:text-xl font-medium text-center">
                  {service.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
