'use client'

import { useState } from 'react'
import { ProductFilters } from '@/types/product'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface FiltersProps {
  onFilter: (filters: ProductFilters) => void
  categories: string[]
}

export default function Filters({ onFilter, categories }: FiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  })

  const handleChange = (field: keyof ProductFilters, value: string | number) => {
    const newFilters = { ...filters, [field]: value || undefined }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters: ProductFilters = {
      search: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
    }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <Card className="sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Поиск..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="От"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="До"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full"
        >
          Сбросить фильтры
        </Button>
      </div>
    </Card>
  )
}

