import { checkoutSectionClass } from '@/components/checkout/checkoutStyles'

export default function CheckoutSuccess() {
  return (
    <section className={`${checkoutSectionClass} py-8 text-center sm:py-10`}>
      <h2 className="text-xl font-semibold text-[#1F1F1F] sm:text-2xl">Ваш заказ оформлен!</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#232326]/80 sm:text-[15px]">
        В ближайшее время наш менеджер свяжется с Вами
      </p>
    </section>
  )
}
