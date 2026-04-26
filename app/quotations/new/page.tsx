'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Dish {
  id: string
  name: string
  price: number
  category: string
}

interface Beverage {
  id: string
  name: string
  price: number
  category: string
}

interface QuotationItem {
  id: string
  itemType: 'dish' | 'beverage'
  itemId: string
  name: string
  quantity: number
  price: number
}

export default function NewQuotationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [eventDate, setEventDate] = useState('')
  const [eventType, setEventType] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [notes, setNotes] = useState('')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [beverages, setBeverages] = useState<Beverage[]>([])
  const [selectedItems, setSelectedItems] = useState<QuotationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [dishesRes, beveragesRes] = await Promise.all([
          supabase.from('dishes').select('id, name, price, category').eq('available', true),
          supabase.from('beverages').select('id, name, price, category').eq('available', true),
        ])

        if (dishesRes.error) throw dishesRes.error
        if (beveragesRes.error) throw beveragesRes.error

        setDishes(dishesRes.data || [])
        setBeverages(beveragesRes.data || [])
      } catch (error: any) {
        toast.error('Error al cargar menú')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [supabase])

  const addItem = (item: Dish | Beverage, type: 'dish' | 'beverage') => {
    const newItem: QuotationItem = {
      id: Math.random().toString(),
      itemType: type,
      itemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
    }
    setSelectedItems([...selectedItems, newItem])
    toast.success(`${item.name} agregado`)
  }

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventDate || !eventType || !guestCount || selectedItems.length === 0) {
      toast.error('Por favor completa todos los campos y selecciona al menos un item')
      return
    }

    if (!user) {
      toast.error('Debes estar autenticado')
      return
    }

    setSubmitting(true)
    try {
      // Create quotation
      const { data: quotation, error: quotError } = await supabase
        .from('quotations')
        .insert([
          {
            client_id: user.id,
            event_date: eventDate,
            event_type: eventType,
            guest_count: parseInt(guestCount),
            notes,
            total_price: totalPrice,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (quotError) throw quotError

      // Create quotation items
      const itemsToInsert = selectedItems.map((item) => ({
        quotation_id: quotation.id,
        item_type: item.itemType,
        item_id: item.itemId,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      toast.success('Cotización creada exitosamente')
      router.push(`/quotations/${quotation.id}`)
    } catch (error: any) {
      toast.error('Error al crear cotización')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Nueva Cotización</h1>
        <p className="text-muted-foreground">Crea una cotización personalizada para tu evento</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Menu Selection */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="dishes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dishes">Platos</TabsTrigger>
              <TabsTrigger value="beverages">Bebidas</TabsTrigger>
            </TabsList>

            <TabsContent value="dishes" className="space-y-4 mt-6">
              <div className="grid gap-3">
                {dishes.map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{dish.name}</p>
                      <p className="text-sm text-muted-foreground">${dish.price.toLocaleString('es-CO')}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addItem(dish, 'dish')}
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="beverages" className="space-y-4 mt-6">
              <div className="grid gap-3">
                {beverages.map((beverage) => (
                  <div key={beverage.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{beverage.name}</p>
                      <p className="text-sm text-muted-foreground">${beverage.price.toLocaleString('es-CO')}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addItem(beverage, 'beverage')}
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quotation Summary */}
        <div>
          <Card className="p-6 sticky top-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha del Evento</label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Evento</label>
                <Input
                  type="text"
                  placeholder="Boda, Conferencia, Cumpleaños..."
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cantidad de Invitados</label>
                <Input
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notas Adicionales</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Requisitos especiales, restricciones alimentarias, etc."
                  className="w-full p-2 border rounded text-sm"
                  rows={3}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Resumen</h3>
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-red-600 p-0"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="py-3 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Guardando...' : 'Crear Cotización'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
