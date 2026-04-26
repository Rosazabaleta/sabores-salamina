"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useCarrito } from "@/lib/carrito-context"
import { ShoppingCart } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { cartItems } = useCarrito()
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/")
  const cartCount = cartItems.length
  
  return (
    <header className="bg-stone-50/95 backdrop-blur-md border-b border-stone-200 shadow-sm fixed top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold font-serif text-green-900">
          Sabores de Salamina
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-serif text-lg tracking-tight">
          <Link 
            href="/menu" 
            className={`transition-colors ${isActive("/menu") ? "text-green-700 border-b-2 border-green-700 pb-1 font-semibold" : "text-stone-600 hover:text-green-700"}`}
          >
            Menú
          </Link>
          <Link 
            href="/eventos" 
            className={`transition-colors ${isActive("/eventos") ? "text-green-700 border-b-2 border-green-700 pb-1 font-semibold" : "text-stone-600 hover:text-green-700"}`}
          >
            Eventos
          </Link>
          <Link 
            href="/mi-cuenta" 
            className={`flex items-center gap-2 transition-colors ${isActive("/mi-cuenta") ? "text-green-700 border-b-2 border-green-700 pb-1 font-semibold" : "text-stone-600 hover:text-green-700"}`}
          >
            Mis Pedidos
            {cartCount > 0 && (
              <Badge className="bg-[#934b19] text-white text-xs font-bold">{cartCount}</Badge>
            )}
          </Link>
          {user ? (
            <>
              <span className="text-stone-400">•</span>
              <button 
                onClick={signOut}
                className="text-stone-600 hover:text-green-700 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link 
              href="/auth/login" 
              className="text-stone-600 hover:text-green-700 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </nav>
        
        <Button 
          asChild
          className="bg-[#154212] text-white hover:bg-[#2d5a27] transition-all duration-300"
        >
          <Link href="/eventos">Reservar</Link>
        </Button>
      </div>
    </header>
  )
}
