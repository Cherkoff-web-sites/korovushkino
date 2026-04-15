'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

// CSR страница - клиентский рендеринг для каталога
export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      id: 1,
      name: 'Частотные преобразователи',
      href: '/catalog/converter',
      image: '/images/categories/converter.png',
    },
    {
      id: 2,
      name: 'Устройства плавного пуска',
      href: '/catalog/soft-starter',
      image: '/images/categories/soft-starter.png',
    },
    {
      id: 3,
      name: 'Допоборудование к ПЧ и УПП',
      href: '/catalog?category=equipment',
      image: '/images/categories/equipment.png',
    },
    {
      id: 4,
      name: 'Электродвигатели',
      href: '/catalog/motor',
      image: '/images/categories/motor.png',
    },
    {
      id: 5,
      name: 'Проектные продажи',
      href: '/catalog?category=projects',
      image: '/images/categories/project.png',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Первый блок - Категории */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          {/* Заголовок и поиск */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D8C13]">
              КАТАЛОГ
            </h1>
            
            {/* Поиск */}
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск"
                className="w-full px-4 py-3 pl-12 bg-[#2A2529] border border-[#3D8C13] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#3D8C13]"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Категории */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group relative bg-[#2A2529] border-2 border-[#3D8C13] rounded-xl p-4 sm:p-6 hover:border-[#3D8C13]/80 transition-all"
              >
                <div className="aspect-square bg-[#3B363C] rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={193}
                      height={193}
                      className="object-contain rounded-lg max-w-[193px]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium text-center group-hover:text-[#3D8C13] transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* Кнопка "Скачать каталог" */}
          <div className="flex justify-end">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Скачать каталог
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

