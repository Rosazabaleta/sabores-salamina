'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const CATEGORIES = [
  'Platos Principales',
  'Sopas',
  'Entradas',
  'Acompañamientos',
  'Postres',
  'Otros',
]

export default function NewDishPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Platos Principales')
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !price) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('dishes').insert([
        {
          name,
          description,
          price: parseFloat(price),
          category,
          available,
        },
      ])

      if (error) throw error
      toast.success('Plato creado exitosamente')
      router.push('/admin/dishes')
    } catch (error: any) {
      toast.error('Error al crear plato')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Nuevo Plato</h1>
        <p className="text-muted-foreground">Añade un nuevo plato al menú</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nombre
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Bandeja Paisa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              placeholder="Describe el plato..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Precio ($)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="45000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="available" className="text-sm font-medium">
              Disponible
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Crear Plato'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
