'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

interface Quotation {
  id: string
  event_date: string
  event_type: string
  guest_count: number
  status: string
  total_price: number
  created_at: string
}

export default function QuotationsPage() {
  const { user } = useAuth()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchQuotations = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('quotations')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setQuotations(data || [])
      } catch (error: any) {
        toast.error('Error al cargar cotizaciones')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [user, supabase])

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
        <p className="text-muted-foreground">Cargando cotizaciones...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mis Cotizaciones</h1>
          <p className="text-muted-foreground">Visualiza todas tus solicitudes de eventos</p>
        </div>
        <Button asChild>
          <Link href="/quotations/new">Nueva Cotización</Link>
        </Button>
      </div>

      {quotations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-6">No tienes cotizaciones aún</p>
          <Button asChild>
            <Link href="/quotations/new">Crear Primera Cotización</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotations.map((quotation) => (
            <Card key={quotation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{quotation.event_type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(quotation.event_date).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <Badge className={getStatusColor(quotation.status)}>
                  {getStatusLabel(quotation.status)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Invitados</p>
                  <p className="text-xl font-semibold">{quotation.guest_count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Precio Total</p>
                  <p className="text-xl font-semibold text-primary">
                    ${quotation.total_price?.toLocaleString('es-CO') || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Creada</p>
                  <p className="text-sm">
                    {new Date(quotation.created_at).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href={`/quotations/${quotation.id}`}>Ver Detalles</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
