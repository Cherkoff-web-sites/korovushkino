import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { productsData } from '@/lib/api/productsData'

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json')

// Получить все товары
export async function GET() {
  try {
    const fileContent = await readFile(PRODUCTS_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(fileContent))
  } catch (error) {
    // Если файла нет, возвращаем данные из productsData
    return NextResponse.json(productsData)
  }
}

// Создать или обновить товар
export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    
    // Создаем директорию если её нет
    const { mkdir } = await import('fs/promises')
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
    
    // Читаем существующие товары
    let products: Record<string, any> = {}
    try {
      const fileContent = await readFile(PRODUCTS_FILE, 'utf-8')
      products = JSON.parse(fileContent)
    } catch {
      products = productsData
    }
    
    // Обновляем или добавляем товар
    products[product.id] = product
    
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save product' },
      { status: 500 }
    )
  }
}

// Удалить товар
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Читаем существующие товары
    let products: Record<string, any> = {}
    try {
      const fileContent = await readFile(PRODUCTS_FILE, 'utf-8')
      products = JSON.parse(fileContent)
    } catch {
      products = productsData
    }
    
    // Удаляем товар
    delete products[productId]
    
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
