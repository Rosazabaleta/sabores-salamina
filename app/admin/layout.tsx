'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, userRole, loading, signOut } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!user || userRole !== 'admin') {
    router.push('/admin/login')
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            Sabores de Salamina - Admin
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            <Link href="/admin/dashboard" className="hover:opacity-80 transition">
              Dashboard
            </Link>
            <Link href="/admin/dishes" className="hover:opacity-80 transition">
              Platos
            </Link>
            <Link href="/admin/beverages" className="hover:opacity-80 transition">
              Bebidas
            </Link>
            <Link href="/admin/quotations" className="hover:opacity-80 transition">
              Cotizaciones
            </Link>
            <Link href="/admin/reservations" className="hover:opacity-80 transition">
              Reservaciones
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="hidden md:inline-flex gap-2"
          >
            <LogOut size={16} />
            Salir
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 p-4 space-y-3">
            <Link href="/admin/dashboard" className="block hover:opacity-80 transition">
              Dashboard
            </Link>
            <Link href="/admin/dishes" className="block hover:opacity-80 transition">
              Platos
            </Link>
            <Link href="/admin/beverages" className="block hover:opacity-80 transition">
              Bebidas
            </Link>
            <Link href="/admin/quotations" className="block hover:opacity-80 transition">
              Cotizaciones
            </Link>
            <Link href="/admin/reservations" className="block hover:opacity-80 transition">
              Reservaciones
            </Link>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Salir
            </Button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
