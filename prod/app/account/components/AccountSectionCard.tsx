import type { ReactNode } from 'react'

export default function AccountSectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-8">
      <h1 className="mb-6 text-xl font-bold text-black sm:mb-8 sm:text-2xl">{title}</h1>
      {children}
    </section>
  )
}
