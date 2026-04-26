'use client'

import { useEffect, useState } from 'react'
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
  users: {
    email: string
    full_name: string
  }
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(
          `
          *,
          users(email, full_name)
        `
        )
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      toast.success(`Reservación ${newStatus}`)
      fetchReservations()
    } catch (error: any) {
      toast.error('Error al actualizar reservación')
      console.error(error)
    }
  }

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
    return <p className="text-muted-foreground">Cargando reservaciones...</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestionar Reservaciones</h1>
        <p className="text-muted-foreground">Total: {reservations.length} reservaciones</p>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {reservation.users?.full_name || reservation.users?.email}
                </h3>
                <p className="text-sm text-muted-foreground">{reservation.users?.email}</p>
              </div>
              <Badge className={getStatusColor(reservation.status)}>
                {getStatusLabel(reservation.status)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="font-semibold">
                  {new Date(reservation.event_date).toLocaleDateString('es-CO')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hora</p>
                <p className="font-semibold">{reservation.event_time || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invitados</p>
                <p className="font-semibold">{reservation.guest_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Creada</p>
                <p className="text-sm">
                  {new Date(reservation.created_at).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>

            {reservation.special_requests && (
              <div className="mb-6 p-4 bg-muted rounded">
                <p className="text-xs text-muted-foreground mb-1">Solicitudes Especiales</p>
                <p className="text-sm">{reservation.special_requests}</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {reservation.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    variant="destructive"
                  >
                    Cancelar
                  </Button>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => updateStatus(reservation.id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Marcar Completada
                </Button>
              )}
            </div>
          </Card>
        ))}

        {reservations.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No hay reservaciones</p>
          </Card>
        )}
      </div>
    </div>
  )
}
