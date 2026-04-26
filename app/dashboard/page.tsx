'use client'

import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    quotations: 0,
    reservations: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      const [quotRes, resRes] = await Promise.all([
        supabase
          .from('quotations')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id),
        supabase
          .from('reservations')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id),
      ])

      setStats({
        quotations: quotRes.count || 0,
        reservations: resRes.count || 0,
      })
    }

    fetchStats()
  }, [user, supabase])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Bienvenido, {user?.user_metadata?.full_name || user?.email}</h1>
        <p className="text-muted-foreground">Gestiona tus cotizaciones y reservaciones</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Cotizaciones</h3>
          <p className="text-4xl font-bold text-primary mb-4">{stats.quotations}</p>
          <Button asChild>
            <Link href="/quotations">Ver Cotizaciones</Link>
          </Button>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Reservaciones</h3>
          <p className="text-4xl font-bold text-primary mb-4">{stats.reservations}</p>
          <Button asChild>
            <Link href="/reservations">Ver Reservaciones</Link>
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Button asChild className="h-auto py-4" variant="outline">
            <Link href="/menu" className="flex-col">
              <span>Explorar Menú</span>
              <span className="text-xs text-muted-foreground">Ver platos y bebidas</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-4" variant="outline">
            <Link href="/quotations/new" className="flex-col">
              <span>Nueva Cotización</span>
              <span className="text-xs text-muted-foreground">Crear solicitud de evento</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-4" variant="outline">
            <Link href="/profile" className="flex-col">
              <span>Mi Perfil</span>
              <span className="text-xs text-muted-foreground">Actualizar información</span>
            </Link>
          </Button>
        </div>
      </Card>

      {/* Info Section */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">¿Cómo funciona?</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Explora nuestro menú completo de platos y bebidas</li>
          <li>2. Crea una cotización personalizada para tu evento</li>
          <li>3. Revisa los precios y confirma tu reservación</li>
          <li>4. Nuestro equipo se contactará para confirmar los detalles</li>
        </ol>
      </Card>
    </div>
  )
}
