import type { Metadata } from 'next'
import BasketProductCard from './BasketProductCard'

export const metadata: Metadata = {
  title: 'Продуктовые корзины | Коровушкино',
  description: 'Готовые продуктовые корзины: мясная, молочная и недельная — доставка фермерских продуктов.',
}

const HERO_IMAGE = '/images/home/hero-bg.png'

const baskets = [
  {
    id: 'meat',
    title: 'Корзина мясная',
    description:
      'Свежие мясные продукты с нашей фермы: натуральный состав, бережная упаковка и вкус, к которому хочется возвращаться. Идеально, чтобы познакомиться с ассортиментом или собрать основу для семейных ужинов.',
    nutritionPer100: 'Белки — 18 г. Жиры — 12 г. Углеводы — 0 г.',
    calories: '198 ккал',
    price: 3499,
  },
  {
    id: 'dairy',
    title: 'Корзина молочная',
    description:
      'Молоко, творог, сметана и сыры — всё из цельного молока без лишних добавок. Подходит для завтраков и перекусов: натуральный вкус и привычные продукты в одном наборе.',
    nutritionPer100: 'Белки — 3,6 г. Жиры — 3–5 г. Углеводы — 4,5 г.',
    calories: '69 ккал',
    price: 2799,
  },
  {
    id: 'weekly',
    title: 'Корзина недельная',
    description:
      'Сбалансированный набор на несколько дней: молочное, мясо, яйца и базовые продукты для стола. Удобно заказать разом и не думать о списке покупок на неделю вперёд.',
    nutritionPer100: 'Белки — 12 г. Жиры — 8 г. Углеводы — 6 г.',
    calories: '145 ккал',
    price: 4999,
  },
] as const

export default function BasketsPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8 sm:py-10 lg:py-12">
      <div className="container">
        <h1 className="mb-2 text-2xl font-bold text-[#1F1F1F] sm:text-3xl lg:text-4xl">Продуктовые корзины</h1>
        <p className="mb-8 max-w-2xl text-sm text-[#232326]/70 sm:mb-10 sm:text-base">
          Готовые наборы нашей фермы — выберите корзину или соберите свой рацион из каталога.
        </p>

        <div className="flex flex-col gap-8">
          {baskets.map((item, index) => (
            <BasketProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              nutritionPer100={item.nutritionPer100}
              calories={item.calories}
              price={item.price}
              imageSrc={HERO_IMAGE}
              imagePriority={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
