'use client'

import { useState } from 'react'
import type { ProductData } from '@/lib/api/productsData'

interface ProductTabsProps {
  product: ProductData
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div className="bg-[#2A2529] rounded-lg overflow-hidden">
      {/* Заголовки вкладок */}
      <div className="flex border-b border-[#3B363C] overflow-x-auto">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'description'
              ? 'text-[#3D8C13] border-b-2 border-[#3D8C13]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Описание
        </button>
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'parameters'
              ? 'text-[#3D8C13] border-b-2 border-[#3D8C13]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Параметры
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'delivery'
              ? 'text-[#3D8C13] border-b-2 border-[#3D8C13]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Поставка и гарантия
        </button>
      </div>

      {/* Содержимое вкладок */}
      <div className="p-6 sm:p-8">
        {activeTab === 'description' && (
          <div className="space-y-6 text-white/90 text-sm sm:text-base">
            {/* Для частотных преобразователей */}
            {product.id === 'converter' && (
              <>
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Назначение</h3>
                  <p>
                    Серия малогабаритных частотных преобразователей, предназначенных для эксплуатации 
                    в большинстве технологических процессов, связанных с необходимостью регулирования 
                    скорости вращения электродвигателя и автоматизации систем управления. Гибкость, 
                    простота настройки и ввода в эксплуатацию делают данную серию частотных 
                    преобразователей одним из лучших решений в своей области.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Преимущества</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Компактность и простота настройки</li>
                    <li>Для первоначального запуска частотного преобразователя достаточно 5 простых шагов</li>
                  </ul>
                </div>
              </>
            )}

            {/* Для устройств плавного пуска */}
            {product.id === 'soft-starter' && product.descriptionContent && (
              <>
                {product.descriptionContent.advantages && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Преимущества:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {product.descriptionContent.advantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.descriptionContent.mainFunctions && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Основные функции:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {product.descriptionContent.mainFunctions.map((func, index) => (
                        <li key={index}>{func}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.descriptionContent.characteristics && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Характеристики:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {product.descriptionContent.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Для электродвигателей */}
            {product.id === 'motor' && product.descriptionContent && (
              <>
                {product.descriptionContent.generalDescription && (
                  <div>
                    <p className="text-white/90 mb-4">
                      {product.descriptionContent.generalDescription}
                    </p>
                  </div>
                )}

                {product.descriptionContent.advantages && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Преимущества:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {product.descriptionContent.advantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.descriptionContent.structuralFeatures && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Особенности конструкции:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {product.descriptionContent.structuralFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.descriptionContent.motorProtection && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Защита двигателя:</h3>
                    <p className="text-white/90">
                      {product.descriptionContent.motorProtection}
                    </p>
                  </div>
                )}

                {product.descriptionContent.additionalOptions && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Дополнительные опции:</h3>
                    <p className="text-white/90">
                      {product.descriptionContent.additionalOptions}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Общие разделы для частотных преобразователей */}
            {product.id === 'converter' && (
              <>
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Точность поддержания</h3>
                  <ul className="space-y-2">
                    <li>±0.5% (V/F)</li>
                    <li>±0.02% (Векторное управление без ОС)</li>
                    <li>Диапазон регулирования: 1:200 (Векторное управление без ОС)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Перегрузочная способность</h3>
                  <ul className="space-y-2">
                    <li>150% от номинального тока в течение 60 секунд</li>
                    <li>180% от номинального тока в течение 5 секунд</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Высокий крутящий момент на низкой скорости</h3>
                  <ul className="space-y-2">
                    <li>Для моделей P-типа: 120% при 0.50 Гц</li>
                    <li>Для моделей G-типа (общепромышленный режим, высокая перегрузка): 180% при 0.5 Гц</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Особенность конструкции</h3>
                  <p>
                    Канал охлаждения радиатора полностью отделен от силовых элементов и плат частотного 
                    преобразователя. Такая конструкция эффективно предотвращает попадание пыли и агрессивных 
                    частиц внутрь корпуса, значительно повышая надежность. Высокопроизводительный вентилятор 
                    охлаждения с длительным сроком службы эффективно снижает внутренний перегрев в самых 
                    суровых климатических условиях, обеспечивая надежную, стабильную и долгосрочную работу.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Абсолютная защита</h3>
                  <p>
                    Все модели серии ENT-100 имеют широкий спектр защитных функций: защита от перенапряжения/ 
                    пониженного напряжения, короткого замыкания на землю и межфазного короткого замыкания, 
                    перегрузки по току, перегрузки двигателя (с встроенной математической моделью тепловой 
                    защиты), обрыва фаз на входе/выходе.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">Продвинутые функции управления</h3>
                  <p className="mb-3">
                    Позволяет использовать до 6 наборов функций задержки, до 4 наборов функций сравнения 
                    и до 4 наборов логических блоков.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Встроенный PID-регулятор с возможностью указания диапазона измерительного датчика (физические единицы, а не условные)</li>
                    <li>Многоскоростной режим, до 16 настроек скорости</li>
                    <li>Простой ПЛК (программируемый логический контроллер)</li>
                    <li>Запуск с подхватом скорости</li>
                    <li>Функция энергосбережения</li>
                    <li>Ручное построение кривой V/F по точкам</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="text-white/90 space-y-8">
            {/* Для частотных преобразователей */}
            {product.id === 'converter' && (
              <>
                {/* Секция 1: 220В 1 фаза вход/3 фазы выход */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">
                    220В (—15% ~ 20%) 1 фаза вход/3 фазы выход
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#3B363C]">
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Модель</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Входной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Выходной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Мощность электродвигателя (кВт)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2S-0.4G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">5.4</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.3</td>
                          <td className="border border-[#3D8C13] px-4 py-3">0.4</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2S-0.75G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">8.2</td>
                          <td className="border border-[#3D8C13] px-4 py-3">4.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">0.75</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2S-1.5G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">14.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">7.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">1.5</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2S-2.2G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">23.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">9.6</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Секция 2: 220В 3 фазы вход/3 фазы выход */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">
                    220В (—15% ~ 20%) 3 фазы вход/3 фазы выход
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#3B363C]">
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Модель</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Входной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Выходной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Мощность электродвигателя (кВт)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2T-0.4G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.7</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.3</td>
                          <td className="border border-[#3D8C13] px-4 py-3">0.4</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2T-0.7G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">4.2</td>
                          <td className="border border-[#3D8C13] px-4 py-3">4.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">0.75</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2T-1.5G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">7.7</td>
                          <td className="border border-[#3D8C13] px-4 py-3">7.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">1.5</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-2T-2.2G</td>
                          <td className="border border-[#3D8C13] px-4 py-3">12</td>
                          <td className="border border-[#3D8C13] px-4 py-3">9.6</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Секция 3: 380В 3 фазы вход/3 фазы выход */}
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">
                    380В (—15% ~ 20%) 3 фазы вход/3 фазы выход
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#3B363C]">
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Модель</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Входной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Выходной ток (A)</th>
                          <th className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">Мощность электродвигателя (кВт)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-4T-0.75G/1.5P</td>
                          <td className="border border-[#3D8C13] px-4 py-3">3.4</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.1</td>
                          <td className="border border-[#3D8C13] px-4 py-3">0.75</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-4T-1.5G/2.2P</td>
                          <td className="border border-[#3D8C13] px-4 py-3">5.0/5.8</td>
                          <td className="border border-[#3D8C13] px-4 py-3">3.8/5.1</td>
                          <td className="border border-[#3D8C13] px-4 py-3">1.5/2.2</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-4T-2.2G/3.7P</td>
                          <td className="border border-[#3D8C13] px-4 py-3">5.8/10.5</td>
                          <td className="border border-[#3D8C13] px-4 py-3">5.1/9.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">2.2/4.0</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-4T-4.0G/4.0P</td>
                          <td className="border border-[#3D8C13] px-4 py-3">10.5/14.6</td>
                          <td className="border border-[#3D8C13] px-4 py-3">9.0/13.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">4.0/5.5</td>
                        </tr>
                        <tr className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          <td className="border border-[#3D8C13] px-4 py-3">ENT-100-4T-5.5G/7.5P</td>
                          <td className="border border-[#3D8C13] px-4 py-3">14.6/20.5</td>
                          <td className="border border-[#3D8C13] px-4 py-3">13.0/17.0</td>
                          <td className="border border-[#3D8C13] px-4 py-3">5.5/7.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Для устройств плавного пуска */}
            {product.id === 'soft-starter' && product.parametersTable && product.parametersTable.map((table, tableIndex) => (
              <div key={tableIndex}>
                {table.title && (
                  <h3 className="text-white font-semibold mb-4 text-lg">
                    {table.title}
                  </h3>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#3B363C]">
                        {table.headers.map((header, index) => (
                          <th key={index} className="border border-[#3D8C13] px-4 py-3 text-left text-sm font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-[#2A2529] hover:bg-[#3B363C] transition-colors">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-[#3D8C13] px-4 py-3">
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
        )}

        {activeTab === 'delivery' && (
          <div className="text-white/90 space-y-8">
            {/* Доставка */}
            <div>
              {product.id === 'motor' ? (
                <>
                  <div className="w-16 h-1 bg-[#3D8C13] mb-4"></div>
                  <h3 className="text-white font-semibold mb-4 text-xl sm:text-2xl">
                    Доставка
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    Возможны различные способы доставки, как самовывоз с нашего склада, так и доставка непосредственно до места эксплуатации.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-white font-semibold mb-4 text-xl sm:text-2xl">
                    Доставка
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    Возможен как самовывоз со склада, так и доставка до Вашего склада или до места эксплуатации.
                  </p>
                </>
              )}
            </div>

            {/* Гарантия */}
            <div>
              {product.id !== 'motor' && <div className="w-16 h-1 bg-[#3D8C13] mb-4"></div>}
              <h3 className="text-white font-semibold mb-4 text-xl sm:text-2xl">
                Гарантия
              </h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                {product.id === 'motor' 
                  ? 'Наша компания предлагает разные условия как гарантийного так и постгарантийного обслуживания исходя из требований наших заказчиков.'
                  : 'Гарантийный срок изделия составляет 12 месяцев.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
