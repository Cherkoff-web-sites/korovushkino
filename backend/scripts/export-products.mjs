/**
 * Экспорт каталога из prod/lib/api/productsData.ts в backend/data/products.json
 * Запуск из корня site/prod:
 * npx tsx ../backend/scripts/export-products.mjs
 */
import { productsData, allCatalogProductIds } from '../../prod/lib/api/productsData.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')

const ordered = {}
for (const id of allCatalogProductIds) {
  ordered[id] = productsData[id]
}

fs.mkdirSync(dataDir, { recursive: true })
fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(ordered, null, 2))
fs.writeFileSync(path.join(dataDir, 'product-order.json'), JSON.stringify([...allCatalogProductIds], null, 2))

console.log(`Exported ${allCatalogProductIds.length} products to backend/data/`)
