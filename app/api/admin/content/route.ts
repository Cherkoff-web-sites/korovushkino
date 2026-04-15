import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const CONTENT_FILE = join(process.cwd(), 'data', 'content.json')

// Получить контент страниц
export async function GET() {
  try {
    const content = await readFile(CONTENT_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch (error) {
    // Если файла нет, возвращаем дефолтные значения
    return NextResponse.json({
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
    })
  }
}

// Обновить контент страниц
export async function POST(request: NextRequest) {
  try {
    const content = await request.json()
    
    // Создаем директорию если её нет
    const { mkdir } = await import('fs/promises')
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
    
    await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save content' },
      { status: 500 }
    )
  }
}
