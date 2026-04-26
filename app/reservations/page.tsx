'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

interface Reservation {
  id: string
  event_date: string
  event_time: string | null
  guest_count: number
  status: string
  special_requests: string
  created_at: string
}

export default function ReservationsPage() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('client_id', user.id)
          .order('event_date', { ascending: true })

        if (error) throw error
        setReservations(data || [])
      } catch (error: any) {
        toast.error('Error al cargar reservaciones')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
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
      case 'confirmed':
        return 'Confirmada'
      case 'cancelled':
        return 'Cancelada'
      case 'completed':
        return 'Completada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando reservaciones...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Mis Reservaciones</h1>
        <p className="text-muted-foreground">Gestiona tus eventos reservados</p>
      </div>

      {reservations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-6">No tienes reservaciones aún</p>
          <p className="text-sm text-muted-foreground mb-6">
            Para crear una reservación, primero debes tener una cotización aprobada
          </p>
          <Button asChild>
            <Link href="/quotations">Ver Cotizaciones</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Reservación del {new Date(reservation.event_date).toLocaleDateString('es-CO')}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {reservation.id.slice(0, 8)}
                  </p>
                </div>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-semibold">
                    {new Date(reservation.event_date).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hora</p>
                  <p className="font-semibold">{reservation.event_time || 'Por confirmar'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invitados</p>
                  <p className="font-semibold">{reservation.guest_count}</p>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="mb-6 p-4 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Solicitudes Especiales</p>
                  <p className="text-sm">{reservation.special_requests}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
