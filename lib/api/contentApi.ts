import { readFile } from 'fs/promises'
import { join } from 'path'
import { unstable_noStore as noStore } from 'next/cache'

const CONTENT_FILE = join(process.cwd(), 'data', 'content.json')

export interface ContentData {
  about?: {
    title: string
    paragraphs: string[]
  }
  contact?: {
    address: string
    workingHours: string
    email: string
  }
  services?: {
    title: string
    services: Array<{ id: number; name: string }>
  }
}

export async function getContent(): Promise<ContentData> {
  // Отключаем кэширование, чтобы админка обновляла контент сразу
  noStore()
  try {
    const content = await readFile(CONTENT_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    // Возвращаем дефолтные значения
    return {
      about: {
        title: 'О КОМПАНИИ',
        paragraphs: [
          'Наша компания специализируется на разработке и реализации решения для электропривода. Обеспечиваем полный цикл ввода оборудования в эксплуатацию, а также его последующее обслуживание.',
          'Мы ценим время наших клиентов, поэтому наши инженеры готовы оперативно решить любые вопросы и обеспечить бесперебойную работу вашего оборудования. Вся продукция сертифицирована и производится под строгим контролем на наших партнерских заводах. Мы используем только лучшие комплектующие мировых брендов, таких как FAG, SKF, ZWZ, TDK, Vishay и др. Каждый компонент проходит строгий контроль, что гарантирует надежность и долговечность поставляемого оборудования.',
          'Выбирая CAREL Professional Service, вы выбираете надёжного партнёра по сервису увлажнителей CAREL — от подбора оборудования до монтажа и обслуживания.',
        ],
      },
      contact: {
        address: 'Россия, Москва, ЗАО, Минская ул., д.2 "г", корп.1 БЦ КУТУЗОВ ХОЛЛ',
        workingHours: 'Пн-Пт 09:00 - 18:00',
        email: 'servicecarel@yandex.ru',
      },
      services: {
        title: 'УСЛУГИ',
        services: [
          { id: 1, name: 'Шефмонтаж' },
          { id: 2, name: 'Пусконаладка' },
          { id: 3, name: 'Обучение персонала' },
        ],
      },
    }
  }
}
