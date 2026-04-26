'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

interface QuotationItem {
  id: string
  item_type: string
  quantity: number
  price: number
  dishes?: { name: string }
  beverages?: { name: string }
}

interface Quotation {
  id: string
  event_date: string
  event_type: string
  guest_count: number
  notes: string
  status: string
  total_price: number
  created_at: string
  quotation_items: QuotationItem[]
}

export default function QuotationDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchQuotation = async () => {
      if (!user || !id) return
      try {
        const { data, error } = await supabase
          .from('quotations')
          .select(
            `
            *,
            quotation_items(
              id,
              item_type,
              quantity,
              price,
              dishes(name),
              beverages(name)
            )
          `
          )
          .eq('id', id)
          .eq('client_id', user.id)
          .single()

        if (error) throw error
        setQuotation(data)
      } catch (error: any) {
        toast.error('Error al cargar cotización')
        router.push('/quotations')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotation()
  }, [user, id, supabase, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      case 'completed':
        return 'Completada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando cotización...</p>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="space-y-4">
        <p>Cotización no encontrada</p>
        <Button asChild>
          <Link href="/quotations">Volver a Cotizaciones</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Cotización #{quotation.id.slice(0, 8)}</h1>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(quotation.status)}>
              {getStatusLabel(quotation.status)}
            </Badge>
            <p className="text-muted-foreground">
              Creada: {new Date(quotation.created_at).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/quotations">Volver</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Fecha del Evento</p>
          <p className="text-lg font-semibold">
            {new Date(quotation.event_date).toLocaleDateString('es-CO')}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Tipo de Evento</p>
          <p className="text-lg font-semibold">{quotation.event_type}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-1">Invitados</p>
          <p className="text-lg font-semibold">{quotation.guest_count}</p>
        </Card>
      </div>

      {quotation.notes && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Notas Adicionales</h3>
          <p className="text-muted-foreground">{quotation.notes}</p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Elementos de la Cotización</h2>
        <div className="space-y-4">
          {quotation.quotation_items?.map((item) => {
            const itemName =
              item.item_type === 'dish'
                ? item.dishes?.[0]?.name
                : item.beverages?.[0]?.name
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{itemName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity}x ${item.price.toLocaleString('es-CO')}
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  ${(item.quantity * item.price).toLocaleString('es-CO')}
                </p>
              </div>
            )
          })}
        </div>

        <div className="border-t mt-6 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-3xl font-bold text-primary">
              ${quotation.total_price.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </Card>

      {quotation.status === 'pending' && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-blue-900">
            Tu cotización está pendiente de revisión. Nos contactaremos pronto para confirmar los detalles.
          </p>
        </Card>
      )}

      {quotation.status === 'approved' && (
        <Card className="p-6 bg-green-50 border-green-200 space-y-4">
          <p className="text-green-900 font-semibold">Tu cotización ha sido aprobada</p>
          <Button asChild className="w-full">
            <Link href="/reservations/new">Confirmar Reservación</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
