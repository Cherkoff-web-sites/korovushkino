'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { ProductData } from '@/lib/api/productsData'

interface ContentData {
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

type Product = ProductData

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'products'>('content')
  const [content, setContent] = useState<ContentData>({})
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Загрузка данных
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [contentRes, productsRes] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/products'),
      ])
      const contentData = await contentRes.json()
      const productsData = await productsRes.json()
      setContent(contentData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading data:', error)
      setMessage({ type: 'error', text: 'Ошибка загрузки данных' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const result = await response.json()
      if (result.success) {
        setMessage({ type: 'success', text: 'Контент успешно сохранен' })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сохранения контента' })
    } finally {
      setSaving(false)
    }
  }

  const saveProduct = async (product: Product) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const result = await response.json()
      if (result.success) {
        setProducts((prev) => ({ ...prev, [product.id]: product }))
        setMessage({ type: 'success', text: 'Товар успешно сохранен' })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сохранения товара' })
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        setProducts((prev) => {
          const newProducts = { ...prev }
          delete newProducts[productId]
          return newProducts
        })
        setMessage({ type: 'success', text: 'Товар успешно удален' })
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка удаления товара' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3B363C] flex items-center justify-center">
        <p className="text-white text-lg">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#3B363C] text-white">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#3D8C13]">Административная панель</h1>
          <Link href="/">
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              ← На главную
            </Button>
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-300 border border-green-500'
                : 'bg-amber-500/20 text-amber-200 border border-amber-500'
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Вкладки */}
        <div className="flex gap-4 border-b border-[#2A2529] mb-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-[#3D8C13] border-b-2 border-[#3D8C13]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Контент страниц
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-[#3D8C13] border-b-2 border-[#3D8C13]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Товары каталога
          </button>
        </div>

        {/* Контент страниц */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* О компании */}
            <div className="bg-[#2A2529] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#3D8C13]">О компании</h2>
              {content.about?.paragraphs.map((paragraph, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm text-white/80 mb-2">
                    Абзац {index + 1}:
                  </label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => {
                      const newParagraphs = [...(content.about?.paragraphs || [])]
                      newParagraphs[index] = e.target.value
                      setContent({
                        ...content,
                        about: { ...content.about, paragraphs: newParagraphs } as any,
                      })
                    }}
                    className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white resize-none"
                    rows={4}
                  />
                </div>
              ))}
            </div>

            {/* Контакты */}
            <div className="bg-[#2A2529] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-[#3D8C13]">Контакты</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80 mb-2">Адрес:</label>
                  <input
                    type="text"
                    value={content.contact?.address || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, address: e.target.value } as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">Режим работы:</label>
                  <input
                    type="text"
                    value={content.contact?.workingHours || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, workingHours: e.target.value } as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-2">E-mail:</label>
                  <input
                    type="email"
                    value={content.contact?.email || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value } as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <Button onClick={saveContent} disabled={saving} size="lg">
              {saving ? 'Сохранение...' : 'Сохранить контент'}
            </Button>
          </div>
        )}

        {/* Товары каталога */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#3D8C13]">Товары каталога</h2>
              <Button onClick={() => {
                const newProduct: Product = {
                  id: `new-${Date.now()}`,
                  name: 'Новый товар',
                  series: 'Серия',
                  category: 'Категория',
                  price: 0,
                  description: 'Описание товара',
                  images: ['/images/home/hero-bg.png'],
                  breadcrumbs: [
                    { label: 'Главная', href: '/' },
                    { label: 'Каталог', href: '/catalog' },
                    { label: 'Категория', href: '/catalog' },
                    { label: 'Серия', href: '#' },
                    { label: 'Новый товар', href: '#', active: true },
                  ],
                }
                setProducts((prev) => ({ ...prev, [newProduct.id]: newProduct }))
              }}>+ Добавить товар</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.values(products).map((product) => (
                <ProductEditor
                  key={product.id}
                  product={product}
                  onSave={saveProduct}
                  onDelete={deleteProduct}
                  saving={saving}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Компонент редактора товара
function ProductEditor({
  product,
  onSave,
  onDelete,
  saving,
}: {
  product: Product
  onSave: (product: Product) => void
  onDelete: (id: string) => void
  saving: boolean
}) {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-[#2A2529] rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-[#3D8C13] mb-1">{product.name}</h3>
          <p className="text-white/70 text-sm">{product.series} • {product.category}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#3D8C13] hover:text-[#3D8C13]/80 text-sm"
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-white/80 mb-2">ID:</label>
          <input
            type="text"
            value={editedProduct.id}
            onChange={(e) => setEditedProduct({ ...editedProduct, id: e.target.value })}
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-2">Название:</label>
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-2">Серия:</label>
          <input
            type="text"
            value={editedProduct.series}
            onChange={(e) => setEditedProduct({ ...editedProduct, series: e.target.value })}
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-2">Категория:</label>
          <input
            type="text"
            value={editedProduct.category}
            onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-2">Цена:</label>
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: Number(e.target.value) })
            }
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-white/80 mb-2">Описание:</label>
          <textarea
            value={editedProduct.description}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white resize-none"
            rows={3}
          />
        </div>
        {isExpanded && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/80 mb-2">Краткое описание:</label>
              <textarea
                value={editedProduct.briefDescription || ''}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, briefDescription: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white resize-none"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/80 mb-2">Изображения (JSON массив):</label>
              <textarea
                value={JSON.stringify(editedProduct.images, null, 2)}
                onChange={(e) => {
                  try {
                    const images = JSON.parse(e.target.value)
                    setEditedProduct({ ...editedProduct, images })
                  } catch {
                    // Игнорируем ошибки парсинга
                  }
                }}
                className="w-full px-4 py-2 bg-[#3B363C] border border-[#3D8C13] rounded-lg text-white font-mono text-sm resize-none"
                rows={3}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => onSave(editedProduct)} disabled={saving} size="md">
          Сохранить
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(product.id)}
          disabled={saving}
          size="md"
          className="border-white text-white hover:bg-white/10"
        >
          Удалить
        </Button>
        <Link href={`/catalog/${product.id}`}>
          <Button
            variant="outline"
            size="md"
            className="border-white text-white hover:bg-white/10"
          >
            Просмотр
          </Button>
        </Link>
      </div>
    </div>
  )
}
