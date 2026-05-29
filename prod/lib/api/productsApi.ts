import { readFile } from 'fs/promises'
import { join } from 'path'
import { productsData, type ProductData } from './productsData'

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json')

export async function getProducts(): Promise<Record<string, ProductData>> {
  try {
    const fileContent = await readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Возвращаем данные из productsData
    return productsData
  }
}

export async function getProduct(id: string): Promise<ProductData | null> {
  const products = await getProducts()
  return products[id] || null
}
