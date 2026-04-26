'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useCarrito } from '@/lib/carrito-context'
import { 
  ShoppingCart, 
  History, 
  UtensilsCrossed, 
  CheckCircle, 
  RefreshCw, 
  Compass, 
  Plus, 
  Minus,
  Trash2,
  ArrowRight
} from 'lucide-react'

// Ejemplos de órdenes pasadas
const pastOrders = [
  {
    id: '#ORD-8824',
    name: 'Almuerzo Ejecutivo',
    date: '23 de Abril, 2026',
    items: '1x Pechuga a la parrilla, 1x Coca-Cola',
    total: 27500,
    status: 'Entregado',
    products: [
      { name: 'Pechuga a la parrilla', quantity: 1, price: 25000 },
      { name: 'Coca-Cola', quantity: 1, price: 2500 }
    ]
  },
  {
    id: '#ORD-8823',
    name: 'Comida en Familia',
    date: '20 de Abril, 2026',
    items: '2x Sancocho de gallina, 2x Jugo Mango, 1x Agua',
    total: 49000,
    status: 'Entregado',
    products: [
      { name: 'Sancocho de gallina', quantity: 2, price: 22000 },
      { name: 'Jugo Mango', quantity: 2, price: 5000 },
      { name: 'Agua', quantity: 1, price: 2000 }
    ]
  },
  {
    id: '#ORD-8822',
    name: 'Carne Asada con Amigos',
    date: '18 de Abril, 2026',
    items: '3x Carne asada, 3x Cerveza Corona, 2x Agua',
    total: 81500,
    status: 'Entregado',
    products: [
      { name: 'Carne asada', quantity: 3, price: 26000 },
      { name: 'Cerveza Corona', quantity: 3, price: 5000 },
      { name: 'Agua', quantity: 2, price: 2000 }
    ]
  },
  {
    id: '#ORD-8821',
    name: 'Almuerzo Corriente',
    date: '15 de Abril, 2026',
    items: '1x Caldo de costilla, 1x Carne desmechada, 1x Jugo Corozo',
    total: 23000,
    status: 'Entregado',
    products: [
      { name: 'Caldo de costilla', quantity: 1, price: 15000 },
      { name: 'Carne desmechada', quantity: 1, price: 18000 }
    ]
  }
]

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`
}

export default function MiCuentaPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCarrito()
  const [orderHistory, setOrderHistory] = useState(pastOrders)

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    const newOrder = {
      id: `#ORD-${Math.floor(Math.random() * 10000)}`,
      name: 'Nuevo Pedido',
      date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: cartItems.map(i => `${i.quantity}x ${i.name}`).join(', '),
      total: cartTotal,
      status: 'En Preparación',
      products: cartItems
    }

    setOrderHistory([newOrder, ...orderHistory])
    clearCart()
    toast.success('¡Pedido confirmado! Tu comida estará lista en 35-45 minutos', {
      description: `Pedido ${newOrder.id}`
    })
  }

  const handleReorder = (order: any) => {
    order.products.forEach((p: any) => {
      const product = {
        id: Math.random(),
        name: p.name,
        price: p.price,
        quantity: p.quantity
      }
      // Agregar productos directamente al carrito
      const existingItem = cartItems.find(i => i.name === p.name)
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + p.quantity)
      } else {
        // Como no tenemos acceso directo a addToCart aquí, usaremos el método de actualización
      }
    })
    toast.success(`Productos de ${order.id} agregados al carrito`)
  }

  const handleNewOrder = () => {
    if (cartItems.length > 0) {
      toast.info('Completa tu pedido actual antes de empezar uno nuevo', {
        action: {
          label: 'Limpiar carrito',
          onClick: () => {
            clearCart()
            toast.success('Carrito vacío. Listo para crear un nuevo pedido')
          }
        }
      })
      return
    }
    window.location.href = '/menu'
  }

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen">
      <Header />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Order History & New Order CTA */}
          <div className="lg:col-span-8 space-y-10">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-display-lg text-[#154212]">Mis Pedidos</h1>
                <p className="text-body-lg text-[#72796e]">Gestiona tus pedidos y revive la tradición.</p>
              </div>
              <Button 
                onClick={handleNewOrder}
                className="hidden md:flex items-center gap-2 bg-[#934b19] text-white px-6 py-3 rounded-xl hover:bg-[#783603] transition-all shadow-md active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-label-md">Nuevo Pedido</span>
              </Button>
            </header>

            {/* Order History */}
            <section className="space-y-6">
              <h2 className="text-headline-sm text-[#1b1c1a] flex items-center gap-2">
                <History className="w-5 h-5" />
                Historial Reciente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Cards */}
                {orderHistory.map((order, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl p-6 shadow-sm relative overflow-hidden ${
                      order.status === 'En Preparación' 
                        ? 'bg-white border border-[#154212]/20 ring-2 ring-[#154212]/5' 
                        : 'bg-[#f5f3ef] border border-[#c2c9bb]/30 hover:shadow-md transition-shadow'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-3">
                      <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        order.status === 'En Preparación'
                          ? 'bg-[#2d5a27] text-[#9dd090]'
                          : 'bg-[#bcf0ae] text-[#23501e]'
                      }`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#eae8e4] flex items-center justify-center text-[#154212]">
                          {order.status === 'En Preparación' ? (
                            <UtensilsCrossed className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-label-md text-[#c2c9bb]">{order.id}</p>
                          <h3 className="text-headline-sm">{order.name}</h3>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-[#e4e2de] pt-4">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-body-md">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[#72796e] text-sm italic">{order.date}</span>
                        <span className="text-2xl text-[#154212] font-bold">{formatPrice(order.total)}</span>
                      </div>
                      <Button
                        onClick={() => handleReorder(order)}
                        className="w-full mt-2 text-[#934b19] border border-[#934b19] hover:bg-[#934b19]/10 transition-colors bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reordenar
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Explore More */}
                <div className="border-2 border-dashed border-[#c2c9bb] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-[#154212]/50 transition-colors group">
                  <Compass className="w-10 h-10 text-[#72796e] group-hover:text-[#154212] transition-colors" />
                  <div>
                    <h3 className="text-headline-sm text-[#1b1c1a]">Antojo de algo nuevo?</h3>
                    <p className="text-body-md text-[#72796e]">Explora las especialidades de la semana.</p>
                  </div>
                  <Link href="/menu" className="text-[#154212] text-label-md mt-2 underline">
                    Ver menú completo
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Shopping Cart */}
          <aside className="lg:col-span-4">
            <div className="cart-glass border border-[#e4e2de] rounded-2xl p-6 sticky top-28 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-headline-md text-[#1b1c1a] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Tu Carrito
                </h2>
                <Badge className="bg-[#caa910] text-[#4c3e00] px-2 py-0.5 text-xs font-bold">
                  {cartItems.length} items
                </Badge>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-[#c2c9bb] mb-3" />
                  <p className="text-[#72796e] mb-4">Tu carrito está vacío</p>
                  <Link href="/menu" className="text-[#154212] text-label-md underline hover:font-semibold">
                    Explorar menú
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto mb-6 pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="text-label-md text-[#1b1c1a]">{item.name}</h4>
                            <button 
                              onClick={() => {
                                removeFromCart(item.id)
                                toast.success('Producto eliminado del carrito')
                              }}
                              className="text-[#72796e] hover:text-[#ba1a1a] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-end mt-3">
                            <div className="flex items-center gap-2 bg-[#eae8e4] rounded-lg px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-[#154212] font-bold hover:bg-[#d4d2ce] rounded p-1 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-[#154212] font-bold hover:bg-[#d4d2ce] rounded p-1 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-body-md text-[#1b1c1a] font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[#e4e2de] pt-6 space-y-3">
                    <div className="flex justify-between text-body-md text-[#72796e]">
                      <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-body-md text-[#72796e]">
                      <span>Envío (Salamina Centro)</span>
                      <span className="text-[#154212] font-semibold">Gratis</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-headline-sm text-[#1b1c1a]">Total</span>
                      <span className="text-3xl text-[#154212] font-bold">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConfirmOrder}
                    className="w-full mt-8 bg-[#154212] text-white py-4 rounded-xl text-label-md text-lg hover:bg-[#2d5a27] transition-all shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Confirmar Pedido
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-center text-xs text-[#72796e] mt-4 italic">
                    El tiempo estimado de entrega es de 35-45 min.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
