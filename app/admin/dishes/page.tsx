'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Trash2, Edit2 } from 'lucide-react'

interface Dish {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDishes()
  }, [])

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setDishes(data || [])
    } catch (error: any) {
      toast.error('Error al cargar platos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDish = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este plato?')) return

    try {
      const { error } = await supabase.from('dishes').delete().eq('id', id)
      if (error) throw error
      toast.success('Plato eliminado')
      fetchDishes()
    } catch (error: any) {
      toast.error('Error al eliminar plato')
      console.error(error)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Cargando platos...</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestionar Platos</h1>
          <p className="text-muted-foreground">Total: {dishes.length} platos</p>
        </div>
        <Button asChild>
          <Link href="/admin/dishes/new">Nuevo Plato</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {dishes.map((dish) => (
          <Card key={dish.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                <p className="text-muted-foreground mb-3">{dish.description}</p>
                <div className="flex gap-4 flex-wrap">
                  <span className="text-sm bg-primary/10 px-3 py-1 rounded">
                    {dish.category}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                    ${dish.price.toLocaleString('es-CO')}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded ${
                      dish.available
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {dish.available ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/dishes/${dish.id}`} className="gap-2">
                    <Edit2 size={16} />
                    Editar
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteDish(dish.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {dishes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-6">No hay platos creados aún</p>
            <Button asChild>
              <Link href="/admin/dishes/new">Crear Primer Plato</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
