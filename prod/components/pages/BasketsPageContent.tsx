'use client'

import BasketProductCard from '@/app/baskets/BasketProductCard'
import { usePagesContent } from '@/hooks/usePagesContent'

export default function BasketsPageContent() {
  const { content } = usePagesContent()
  const { baskets } = content

  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8 sm:py-10 lg:py-12">
      <div className="container">
        <h1 className="mb-2 text-2xl font-bold text-[#1F1F1F] sm:text-3xl lg:text-4xl">{baskets.pageTitle}</h1>
        <p className="mb-8 max-w-2xl text-sm text-[#232326]/70 sm:mb-10 sm:text-base">{baskets.intro}</p>

        <div className="flex flex-col gap-8">
          {baskets.items.map((item, index) => (
            <BasketProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              nutritionPer100={item.nutritionPer100}
              calories={item.calories}
              price={item.price}
              imageSrc={item.image}
              imagePriority={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
