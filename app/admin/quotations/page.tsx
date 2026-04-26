'use client'

import { useEffect, useState } from 'react'
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
  users: {
    email: string
    full_name: string
  }
}

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select(
          `
          *,
          users(email, full_name)
        `
        )
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      toast.success(`Cotización ${newStatus}`)
      fetchQuotations()
    } catch (error: any) {
      toast.error('Error al actualizar cotización')
      console.error(error)
    }
  }

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
    return <p className="text-muted-foreground">Cargando cotizaciones...</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestionar Cotizaciones</h1>
        <p className="text-muted-foreground">Total: {quotations.length} cotizaciones</p>
      </div>

      <div className="space-y-4">
        {quotations.map((quotation) => (
          <Card key={quotation.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{quotation.event_type}</h3>
                <p className="text-sm text-muted-foreground">
                  {quotation.users?.full_name || quotation.users?.email}
                </p>
              </div>
              <Badge className={getStatusColor(quotation.status)}>
                {getStatusLabel(quotation.status)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="font-semibold">
                  {new Date(quotation.event_date).toLocaleDateString('es-CO')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invitados</p>
                <p className="font-semibold">{quotation.guest_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Precio Total</p>
                <p className="font-semibold text-primary">
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

            <div className="flex gap-2 flex-wrap">
              {quotation.status !== 'approved' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(quotation.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Aprobar
                </Button>
              )}
              {quotation.status !== 'rejected' && quotation.status !== 'completed' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(quotation.id, 'rejected')}
                  variant="destructive"
                >
                  Rechazar
                </Button>
              )}
              {quotation.status === 'approved' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(quotation.id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Marcar Completada
                </Button>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/quotations/${quotation.id}`}>Ver Detalles</Link>
              </Button>
            </div>
          </Card>
        ))}

        {quotations.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No hay cotizaciones</p>
          </Card>
        )}
      </div>
    </div>
  )
}
