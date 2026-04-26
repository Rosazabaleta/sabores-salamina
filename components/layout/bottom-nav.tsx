"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UtensilsCrossed, Calendar, User, Plus } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/")
  
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-50/95 backdrop-blur-md shadow-lg border-t border-stone-200 z-50">
        <div className="flex justify-around items-center p-2">
          <Link 
            href="/menu" 
            className={`flex flex-col items-center p-2 ${isActive("/menu") ? "text-green-800" : "text-stone-600"}`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Menu</span>
          </Link>
          
          <Link 
            href="/eventos" 
            className={`flex flex-col items-center p-2 ${isActive("/eventos") ? "text-green-800" : "text-stone-600"}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Eventos</span>
          </Link>
          
          <Link 
            href="/mi-cuenta" 
            className={`flex flex-col items-center p-2 ${isActive("/mi-cuenta") ? "text-green-800" : "text-stone-600"}`}
          >
            <User className="w-5 h-5" fill={isActive("/mi-cuenta") ? "currentColor" : "none"} />
            <span className="text-[10px] font-semibold mt-1">Cuenta</span>
          </Link>
        </div>
      </nav>
      
      {/* Mobile FAB */}
      <Link 
        href="/eventos"
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-[#154212] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-[#2d5a27] transition-colors"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </>
  )
}
