import { readFile } from 'fs/promises'
import { join } from 'path'
import { productsData, type ProductData } from './productsData'
import { productUrlSlug } from '@/lib/productSeo'

const PRODUCTS_FILE = join(process.cwd(), 'data', 'products.json')

function findProduct(
  products: Record<string, ProductData>,
  idOrSlug: string,
): ProductData | null {
  if (products[idOrSlug]) return products[idOrSlug]
  return (
    Object.values(products).find((product) => productUrlSlug(product) === idOrSlug) ?? null
  )
}

export async function getProducts(): Promise<Record<string, ProductData>> {
  try {
    const fileContent = await readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Возвращаем данные из productsData
    return productsData
  }
}

export async function getProduct(idOrSlug: string): Promise<ProductData | null> {
  const products = await getProducts()
  return findProduct(products, idOrSlug)
}
