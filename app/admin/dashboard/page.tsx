'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  Home, 
  ClipboardList, 
  UtensilsCrossed, 
  Calendar, 
  Settings,
  CircleDollarSign,
  Clock,
  TrendingUp,
  ChevronRight,
  Users,
  RefreshCw,
  Eye
} from 'lucide-react'

// Sample orders data based on HTML
const sampleOrders = [
  {
    id: '#ORD-3215',
    customer: 'Maria Cardona',
    items: '2x Arroz con Frijoles, 1x Sancocho de Gallina...',
    total: 32500,
    status: 'Pendiente',
    time: 'Hace 5 min'
  },
  {
    id: '#ORD-3214',
    customer: 'Jorge Ramirez',
    items: '1x Bandeja Paisa, 2x Jugo de Lulo',
    total: 28000,
    status: 'En Cocina',
    time: 'Hace 15 min'
  },
  {
    id: '#ORD-3213',
    customer: 'Luisa Betancourt',
    items: '3x Tamales Tolimenses, 1x Chocolate Santafereno',
    total: 45000,
    status: 'Listo',
    time: 'Hace 25 min'
  }
]

const orderHistory = [
  {
    id: '#ORD-3210',
    customer: 'Andres Ochoa',
    items: '1x Caldo de Costilla',
    total: 15000,
    status: 'Entregado',
    time: 'Hoy, 11:30 AM'
  },
  {
    id: '#ORD-3209',
    customer: 'Camila Zapata',
    items: '2x Empanadas, 1x Agua de Panela',
    total: 8500,
    status: 'Entregado',
    time: 'Hoy, 10:45 AM'
  }
]

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Pendiente':
      return 'bg-[#e7c433] text-[#4c3e00]'
    case 'En Cocina':
      return 'bg-[#5ca3f2] text-white'
    case 'Listo':
      return 'bg-[#bcf0ae] text-[#23501e]'
    case 'Entregado':
      return 'bg-[#eae8e4] text-[#42493e]'
    default:
      return 'bg-[#eae8e4] text-[#42493e]'
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalBeverages: 0,
    pendingQuotations: 0,
    pendingReservations: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dishes, beverages, quotations, reservations] = await Promise.all([
          supabase.from('dishes').select('id', { count: 'exact', head: true }),
          supabase.from('beverages').select('id', { count: 'exact', head: true }),
          supabase
            .from('quotations')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase
            .from('reservations')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ])

        setStats({
          totalDishes: dishes.count || 0,
          totalBeverages: beverages.count || 0,
          pendingQuotations: quotations.count || 0,
          pendingReservations: reservations.count || 0,
        })
      } catch (error: any) {
        toast.error('Error al cargar estadisticas')
        console.error(error)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#154212] text-white p-6 flex flex-col gap-6 hidden lg:flex">
        <div className="font-serif text-2xl font-bold border-b border-white/20 pb-4">
          Sabores Admin
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-white/10 font-bold">
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </Link>
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <ClipboardList className="w-5 h-5" />
            <span>Pedidos</span>
            <Badge className="bg-[#934b19] text-white text-xs ml-auto">3</Badge>
          </Link>
          <Link href="/admin/dishes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <UtensilsCrossed className="w-5 h-5" />
            <span>Menu</span>
          </Link>
          <Link href="/admin/reservations" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Reservas</span>
          </Link>
          <Link href="/admin/quotations" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Ajustes</span>
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/20 text-xs text-white/70">
          Conectado como <span className="font-bold text-white">admin@sabores.co</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-display-lg text-[#154212]">Gestion de Pedidos</h1>
          <p className="text-body-lg text-[#42493e]">Vista general de la actividad del restaurante.</p>
        </header>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#e4e2de] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#bcf0ae] flex items-center justify-center text-[#154212]">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#72796e] uppercase tracking-widest">Ventas Hoy</p>
              <p className="text-headline-md text-[#154212]">$485.500</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e4e2de] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#fdeaa8] flex items-center justify-center text-[#705d00]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#72796e] uppercase tracking-widest">Pedidos Activos</p>
              <p className="text-headline-md text-[#705d00]">{sampleOrders.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e4e2de] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#eae8e4] flex items-center justify-center text-[#42493e]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#72796e] uppercase tracking-widest">Completados</p>
              <p className="text-headline-md text-[#1b1c1a]">18</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e4e2de] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#ffd5c2] flex items-center justify-center text-[#934b19]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#72796e] uppercase tracking-widest">Reservas Pendientes</p>
              <p className="text-headline-md text-[#934b19]">{stats.pendingReservations}</p>
            </div>
          </div>
        </section>

        {/* Active Orders Section */}
        <section className="bg-white rounded-xl border border-[#e4e2de] p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-headline-sm text-[#154212]">Pedidos Activos</h2>
            <Button variant="outline" size="sm" className="text-[#154212] border-[#154212] hover:bg-[#154212]/5">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
          <div className="space-y-4">
            {sampleOrders.map((order) => (
              <div 
                key={order.id} 
                className="grid grid-cols-12 items-center gap-4 p-4 rounded-lg border border-[#e4e2de] hover:bg-[#f5f3ef] transition-colors"
              >
                <div className="col-span-3 md:col-span-2">
                  <p className="text-label-md font-bold">{order.id}</p>
                  <p className="text-xs text-[#72796e]">{order.time}</p>
                </div>
                <div className="col-span-9 md:col-span-3">
                  <p className="font-semibold">{order.customer}</p>
                </div>
                <div className="col-span-6 md:col-span-3 hidden md:block">
                  <p className="text-sm text-[#42493e] truncate">{order.items}</p>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <p className="text-headline-sm">{formatPrice(order.total)}</p>
                </div>
                <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2">
                  <Badge className={`${getStatusColor(order.status)} text-xs font-bold`}>
                    {order.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-[#154212]">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order History Section */}
        <section className="bg-[#f5f3ef] rounded-xl p-6 border border-[#e4e2de]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-headline-sm text-[#1b1c1a]">Historial Reciente</h2>
            <button className="text-[#934b19] text-label-md flex items-center gap-1 hover:underline">
              Ver todo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {orderHistory.map((order) => (
              <div 
                key={order.id} 
                className="flex justify-between items-center p-3 rounded-lg bg-white/50"
              >
                <div className="flex items-center gap-4">
                  <p className="text-label-md text-[#72796e]">{order.id}</p>
                  <p className="font-semibold">{order.customer}</p>
                  <p className="text-sm text-[#42493e] hidden md:block">{order.items}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#72796e]">{order.time}</span>
                  <Badge className={`${getStatusColor(order.status)} text-xs`}>
                    {order.status}
                  </Badge>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
