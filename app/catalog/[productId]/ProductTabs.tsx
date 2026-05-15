'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ProductData } from '@/lib/api/productsData'

interface ProductTabsProps {
  product: ProductData
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'parameters' | 'delivery'>('description')

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5DECF] bg-white">
      <div className="flex overflow-x-auto border-b border-[#E5DECF]">
        {(
          [
            { id: 'description' as const, label: 'Описание' },
            { id: 'parameters' as const, label: 'Состав и хранение' },
            { id: 'delivery' as const, label: 'Доставка' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors sm:px-6 sm:text-base ${
              activeTab === tab.id
                ? 'border-b-2 border-[#3D8C13] text-[#3D8C13]'
                : 'text-[#232326]/60 hover:text-[#232326]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-8">
        {activeTab === 'description' && (
          <div className="space-y-4 text-sm leading-relaxed text-[#232326] sm:text-base">
            <p>{product.description}</p>
            {product.briefDescription ? <p className="text-[#232326]/80">{product.briefDescription}</p> : null}
            {product.advantages?.length ? (
              <div>
                <h3 className="mb-2 font-semibold text-[#1F1F1F]">Преимущества</h3>
                <ul className="list-inside list-disc space-y-1 text-[#232326]/90">
                  {product.advantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="text-sm leading-relaxed text-[#232326] sm:text-base">
            {product.parametersTable?.length ? (
              <div className="space-y-8">
                {product.parametersTable.map((table, tableIndex) => (
                  <div key={tableIndex}>
                    {table.title ? <h3 className="mb-3 font-semibold text-[#1F1F1F]">{table.title}</h3> : null}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[320px] border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#FFF6E7]">
                            {table.headers.map((header, i) => (
                              <th
                                key={i}
                                className="border border-[#E5DECF] px-3 py-2 text-left font-semibold text-[#1F1F1F]"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, ri) => (
                            <tr key={ri} className="odd:bg-white even:bg-[#fdfbf6]">
                              {row.map((cell, ci) => (
                                <td key={ci} className="border border-[#E5DECF] px-3 py-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#232326]/80">
                Подробный состав, энергетическая ценность, срок годности и условия хранения указаны на этикетке
                упаковки.
              </p>
            )}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-4 text-sm leading-relaxed text-[#232326] sm:text-base">
            <p>
              Доставляем по Москве и Московской области. Условия и стоимость — в разделе{' '}
              <Link href="/delivery-payment" className="font-medium text-[#3D8C13] underline-offset-2 hover:underline">
                Доставка и оплата
              </Link>
              .
            </p>
            <p className="text-[#232326]/80">
              Если нужна консультация по заказу, напишите нам на почту или позвоните — подскажем по срокам и
              упаковке.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
