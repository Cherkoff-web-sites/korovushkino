'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTree from '@/components/admin/AdminTree'
import CatalogToolbar from '@/components/admin/CatalogToolbar'
import ProductEditorPanel from '@/components/admin/ProductEditorPanel'
import ProductGrid from '@/components/admin/ProductGrid'
import ProductTable from '@/components/admin/ProductTable'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminFetchProduct,
  adminFetchProducts,
  adminSuggestProductId,
  adminUpdateProduct,
} from '@/lib/api/adminProductsApi'
import { filterAdminProducts } from '@/lib/adminCatalogFilters'
import {
  ADMIN_PREVIEW,
  buildPreviewProduct,
  getPreviewProducts,
  suggestPreviewProductId,
} from '@/lib/adminPreview'
import { CATEGORY_LABELS, type CategorySlug, type ProductData } from '@/lib/api/productsData'
import { writePreviewProducts } from '@/lib/previewProductsStore'
import { useToast } from '@/contexts/ToastContext'

function persistPreviewProducts(products: ProductData[]) {
  writePreviewProducts(products)
}

export default function AdminCatalogWorkspace() {
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const queryHandledRef = useRef(false)
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [category, setCategory] = useState<CategorySlug | 'all'>('all')
  const [treeCollapsed, setTreeCollapsed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    if (ADMIN_PREVIEW) {
      setProducts(getPreviewProducts())
      setLoading(false)
      return
    }
    try {
      const data = await adminFetchProducts()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить каталог')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
    const onProductsUpdated = () => void loadProducts()
    window.addEventListener('preview-products-updated', onProductsUpdated)
    return () => window.removeEventListener('preview-products-updated', onProductsUpdated)
  }, [loadProducts])

  function openEditor(product: ProductData | null, createNew = false) {
    setSelectedProduct(product)
    setIsNew(createNew)
    setEditorOpen(true)
  }

  function closeEditor() {
    setEditorOpen(false)
    setSelectedProduct(null)
    setIsNew(false)
  }

  async function handleSelect(product: ProductData) {
    if (!ADMIN_PREVIEW) {
      try {
        const data = await adminFetchProduct(product.id)
        openEditor(data.product)
        return
      } catch {
        openEditor(product)
        return
      }
    }
    openEditor(product)
  }

  useEffect(() => {
    if (loading || queryHandledRef.current) return
    const editId = searchParams.get('edit')
    const createNew = searchParams.get('new') === '1'
    if (!createNew && !editId) return

    queryHandledRef.current = true
    if (createNew) {
      openEditor(null, true)
      return
    }
    if (editId) {
      const found = products.find((item) => item.id === editId)
      if (found) void handleSelect(found)
    }
  }, [loading, searchParams, products])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const slug of Object.keys(CATEGORY_LABELS)) counts[slug] = 0
    for (const product of products) {
      counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1
    }
    return counts
  }, [products])

  const filteredProducts = useMemo(
    () => filterAdminProducts(products, { categorySlug: category, query }),
    [products, category, query],
  )

  async function handleSave(payload: Record<string, unknown>) {
    let id = String(payload.id || '').trim()
    if (!id) {
      id = ADMIN_PREVIEW
        ? suggestPreviewProductId(String(payload.name))
        : (await adminSuggestProductId(String(payload.name))).id
    }

    const body = { ...payload, id }

    if (ADMIN_PREVIEW) {
      const product = buildPreviewProduct(body, isNew ? undefined : id)
      setProducts((prev) => {
        const next = prev.filter((item) => item.id !== product.id)
        const list = [...next, product]
        persistPreviewProducts(list)
        return list
      })
      setSelectedProduct(product)
      setIsNew(false)
      showToast(isNew ? 'Товар создан' : 'Изменения сохранены')
      return
    }

    if (isNew) {
      const { product } = await adminCreateProduct(body)
      setProducts((prev) => [...prev.filter((item) => item.id !== product.id), product])
      setSelectedProduct(product)
      setIsNew(false)
      showToast('Товар создан')
      return
    }

    const { product } = await adminUpdateProduct(id, body)
    setProducts((prev) => prev.map((item) => (item.id === product.id ? product : item)))
    setSelectedProduct(product)
    showToast('Изменения сохранены')
  }

  async function handleDelete() {
    if (!selectedProduct) return
    if (ADMIN_PREVIEW) {
      setProducts((prev) => {
        const list = prev.filter((item) => item.id !== selectedProduct.id)
        persistPreviewProducts(list)
        return list
      })
      showToast('Товар удалён')
      closeEditor()
      return
    }
    await adminDeleteProduct(selectedProduct.id)
    setProducts((prev) => prev.filter((item) => item.id !== selectedProduct.id))
    showToast('Товар удалён')
    closeEditor()
  }

  async function handleDeleteFromList(product: ProductData) {
    if (!window.confirm(`Удалить «${product.name}»?`)) return
    if (ADMIN_PREVIEW) {
      setProducts((prev) => {
        const list = prev.filter((item) => item.id !== product.id)
        persistPreviewProducts(list)
        return list
      })
      if (selectedProduct?.id === product.id) closeEditor()
      showToast('Товар удалён')
      return
    }
    await adminDeleteProduct(product.id)
    setProducts((prev) => prev.filter((item) => item.id !== product.id))
    if (selectedProduct?.id === product.id) closeEditor()
    showToast('Товар удалён')
  }

  return (
    <div>
      <AdminPageHeader
        title="Каталог товаров"
        description="Управление товарами, URL страниц и SEO-метаданными."
      />

      {loading ? <p className="text-sm text-[#707070]">Загрузка каталога...</p> : null}
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[240px_minmax(0,1fr)_400px]">
        <AdminTree
          selectedCategory={category}
          counts={categoryCounts}
          onSelect={setCategory}
          collapsed={treeCollapsed}
          onToggleCollapse={() => setTreeCollapsed((prev) => !prev)}
        />

        <div className="min-w-0 space-y-4">
          <CatalogToolbar
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={setView}
            onAddProduct={() => openEditor(null, true)}
          />

          {!loading && !error ? (
            view === 'table' ? (
              <ProductTable
                products={filteredProducts}
                selectedId={selectedProduct?.id ?? null}
                onSelect={(product) => void handleSelect(product)}
                onDelete={(product) => void handleDeleteFromList(product)}
              />
            ) : (
              <ProductGrid
                products={filteredProducts}
                selectedId={selectedProduct?.id ?? null}
                onSelect={(product) => void handleSelect(product)}
              />
            )
          ) : null}
        </div>

        {editorOpen ? (
          <div className="2xl:col-span-1">
            <ProductEditorPanel
              product={selectedProduct}
              isNew={isNew}
              onClose={closeEditor}
              onSubmit={handleSave}
              onDelete={!isNew && selectedProduct ? handleDelete : undefined}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
