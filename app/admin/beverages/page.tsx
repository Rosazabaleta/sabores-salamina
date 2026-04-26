'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Trash2, Edit2 } from 'lucide-react'

interface Beverage {
  id: string
  name: string
  description: string
  price: number
  category: string
  volume: string
  available: boolean
}

export default function BeveragesPage() {
  const [beverages, setBeverages] = useState<Beverage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBeverages()
  }, [])

  const fetchBeverages = async () => {
    try {
      const { data, error } = await supabase
        .from('beverages')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setBeverages(data || [])
    } catch (error: any) {
      toast.error('Error al cargar bebidas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBeverage = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta bebida?')) return

    try {
      const { error } = await supabase.from('beverages').delete().eq('id', id)
      if (error) throw error
      toast.success('Bebida eliminada')
      fetchBeverages()
    } catch (error: any) {
      toast.error('Error al eliminar bebida')
      console.error(error)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Cargando bebidas...</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestionar Bebidas</h1>
          <p className="text-muted-foreground">Total: {beverages.length} bebidas</p>
        </div>
        <Button asChild>
          <Link href="/admin/beverages/new">Nueva Bebida</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {beverages.map((beverage) => (
          <Card key={beverage.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{beverage.name}</h3>
                <p className="text-muted-foreground mb-3">{beverage.description}</p>
                <div className="flex gap-4 flex-wrap">
                  <span className="text-sm bg-primary/10 px-3 py-1 rounded">
                    {beverage.category}
                  </span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
                    {beverage.volume}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                    ${beverage.price.toLocaleString('es-CO')}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded ${
                      beverage.available
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {beverage.available ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/beverages/${beverage.id}`} className="gap-2">
                    <Edit2 size={16} />
                    Editar
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBeverage(beverage.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {beverages.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-6">No hay bebidas creadas aún</p>
            <Button asChild>
              <Link href="/admin/beverages/new">Crear Primera Bebida</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
