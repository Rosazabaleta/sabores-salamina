'use client'

import Link from "next/link"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction
} from "@/components/ui/card"
import { AddToCartDialog } from "@/components/ui/add-to-cart-dialog"
import { useCarrito } from "@/lib/carrito-context"
import {
  CheckCircle,
  UtensilsCrossed,
  Sandwich,
  Wine,
  Heart,
  Sparkles,
  Clock,
  Flame,
  Leaf,
  ShoppingCart
} from "lucide-react"

// Menu data
const platosFuertes = [
  {
    id: 1,
    nombre: "Mojarra frita",
    descripcion: "Deliciosa mojarra frita, acompañada de arroz de coco, ensalada de aguacate, yuca y consomé de pescado.",
    precio: 25000,
    disponible: true,
    image: "/img/mojarra-frita.jpeg",
    tags: ["Popular", "Mariscos"]
  },
  {
    id: 2,
    nombre: "Pollo guisado",
    descripcion: "Pollo guisado en salsa casera, acompanado de arroz blanco, frijoles rojos y aguacate.",
    precio: 20000,
    disponible: true,
    image: "/img/Pollo-guisado.jpeg",
    tags: ["Tradicional"]
  },
  {
    id: 3,
    nombre: "Pechuga a la parrilla",
    descripcion: "Pechuga de pollo a la parrilla, acompañada de papas fritas y ensalada fresca.",
    precio: 25000,
    disponible: true,
    image: "/img/pechuga-parrilla.jpeg",
    tags: ["Saludable"]
  }
]

const menuCorriente = [
  {
    id: 6,
    opcion: "Opcion A",
    nombre: "Caldo de costilla",
    descripcion: "Sopa tradicional preparada con costilla de res, papa y condimentos caseros, ideal para empezar el dia.",
    precio: 15000,
    image: "/img/caldo-costilla.jpeg"
  },
  {
    id: 7,
    opcion: "Opcion B",
    nombre: "Carne desmechada",
    descripcion: "Carne de res desmechada, acompañada de arroz blanco, ensalada fresca y tajadas fritas.",
    precio: 18000,
    image: "/img/carne-desmechada.jpeg"
  },
  {
    id: 8,
    opcion: "Opcion C",
    nombre: "Chicharron con yuca",
    descripcion: "Crujiente chicharron de cerdo servido con yuca cocida y acompanamientos tradicionales.",
    precio: 15000,
    image: "/img/chicharron-yuca.jpeg"
  }
]

const jugos = [
  { id: 9, nombre: "Corozo", precio: 5000 },
  { id: 10, nombre: "Mango", precio: 5000 },
  { id: 11, nombre: "Mora con leche", precio: 5000 },
  { id: 12, nombre: "Zapote", precio: 5000 }
]

const bebidasSinAlcohol = [
  { id: 15, nombre: "Agua", precio: 2000 },
  { id: 16, nombre: "Aguapanela", precio: 5000 },
  { id: 17, nombre: "Coca-Cola", precio: 2500 },
  { id: 18, nombre: "Kola Roman", precio: 2500 }
]

const bebidasAlcoholicas = [
  { id: 21, nombre: "Cerveza Corona", precio: 5000 }
]

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`
}

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [loadingNewsletter, setLoadingNewsletter] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido')
      return
    }

    setLoadingNewsletter(true)
    try {
      // Simular envío del correo
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('¡Suscripción exitosa!', {
        description: `Hemos enviado un correo de confirmación a ${email}`
      })
      setEmail('')
    } catch (error) {
      toast.error('Error al suscribirse', {
        description: 'Por favor intenta nuevamente'
      })
    } finally {
      setLoadingNewsletter(false)
    }
  }

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[716px] flex items-center overflow-hidden hero-pattern">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-16">
            <div className="z-10">
              <Badge className="bg-[#934b19] text-white mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Tradicion Cafetera
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#154212] mb-6 leading-tight">
                El Corazon de Salamina en cada Bocado
              </h1>
              <p className="text-lg text-[#42493e] mb-8 max-w-lg">
                Bienvenidos a un rincon donde las recetas ancestrales se encuentran con la calidez de nuestra gente. Descubre la verdadera esencia de la cocina caldense.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#154212] text-white px-8 rounded-xl shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <a href="#menu">
                    Explorar Menu
                    <UtensilsCrossed className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#934b19] text-[#934b19] hover:bg-[#934b19] hover:text-white rounded-xl"
                >
                  <Link href="/eventos">
                    Cotizar Evento
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-[#efeeea]">
                <img
                  alt="Traditional Colombian Dish"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbOqA6QY_UH_g2TS4y55kNeRL8ucXblIZzfmzwlck6_VBC6ABunP6lJ8VZ4vBF4xZV6BpRkknHsHwrr_qX6dzZB4Tl-OTw0W__iGN02KI-V_xeDafMBizEF6MwwiawW1TDPqzwobAVmJm_7gKlwyIYEcagFYF5jh4YgFuxe39fuqPDGmQLo5iHS_nyIAtZ-rX4lY18Ddpv2Jzp7EER-ABgJYM1vfuhMoWSYZHCypeYwNV7a2HsTruOTm0ysEQUvlZYne46FVRapXTB"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#fbf9f5] p-6 rounded-2xl shadow-xl border border-[#c2c9bb] max-w-[200px]">
                <p className="font-serif text-[#154212] italic font-bold">&quot;Como en el patio de la abuela&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section with Tabs */}
        <section className="py-16 bg-[#fbf9f5]" id="menu">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="bg-[#bcf0ae] text-[#154212] mb-4">
                <UtensilsCrossed className="w-3 h-3 mr-1" />
                Nuestra Carta
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#154212] mb-4">
                Sabores Tradicionales
              </h2>
              <p className="text-[#42493e] max-w-xl mx-auto">
                Descubre nuestra selección de platos preparados con recetas ancestrales y los mejores ingredientes de la región.
              </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs defaultValue="fuertes" className="w-full">
              <TabsList className="w-full max-w-xl mx-auto grid grid-cols-3 bg-[#f5f3ef] p-1.5 rounded-xl mb-10 h-auto">
                <TabsTrigger
                  value="fuertes"
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#154212] data-[state=active]:text-white rounded-lg transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>Platos Fuertes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="corriente"
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#154212] data-[state=active]:text-white rounded-lg transition-all"
                >
                  <Sandwich className="w-4 h-4" />
                  <span>Menú del Día</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bebidas"
                  className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#154212] data-[state=active]:text-white rounded-lg transition-all"
                >
                  <Wine className="w-4 h-4" />
                  <span>Bebidas</span>
                </TabsTrigger>
              </TabsList>

              {/* Platos Fuertes Tab */}
              <TabsContent value="fuertes" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                  {platosFuertes.map((plato, index) => (
                    <Card key={index} className="relative overflow-hidden pt-0 border-0 shadow-md hover:shadow-xl transition-shadow group w-full flex flex-col">
                      <div className="absolute inset-0 z-10 aspect-[4/3] bg-gradient-to-b from-transparent to-black/30" />
                      <img
                        src={plato.image}
                        alt={plato.nombre}
                        className="relative z-0 aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-[#154212] text-[#bcf0ae] font-bold text-sm shadow-lg border-2 border-[#bcf0ae]">
                          {formatPrice(plato.precio)}
                        </Badge>
                      </div>
                      <CardHeader className="relative z-20">
                        <CardTitle className="text-lg font-serif text-[#1b1c1a]">
                          {plato.nombre}
                        </CardTitle>
                        <CardDescription className="text-[#42493e] text-sm line-clamp-2">
                          {plato.descripcion}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex-col gap-3 pt-0 mt-auto">
                        <div className="flex flex-wrap gap-2 w-full">
                          {plato.disponible && (
                            <Badge variant="secondary" className="bg-[#bcf0ae] text-[#23501e] text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Disponible
                            </Badge>
                          )}
                          {plato.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-[#c2c9bb] text-[#42493e]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <AddToCartDialog
                          id={plato.id}
                          nombre={plato.nombre}
                          precio={plato.precio}
                          descripcion={plato.descripcion}
                          triggerClassName="w-full"
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Menu Corriente Tab */}
              <TabsContent value="corriente" className="mt-0">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-[#934b19]" />
                  <Badge className="bg-[#705d00] text-white">Solo Almuerzo: 11:30 AM - 3:00 PM</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  {menuCorriente.map((item, index) => (
                    <Card key={index} className="relative overflow-hidden pt-0 border-0 shadow-md hover:shadow-xl transition-shadow w-full flex flex-col">
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className="bg-[#934b19] text-white font-bold">
                          {item.opcion}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-[#154212] text-[#bcf0ae] font-bold text-sm shadow-lg border-2 border-[#bcf0ae]">
                          {formatPrice(item.precio)}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 z-10 aspect-[4/3] bg-gradient-to-b from-transparent to-black/40" />
                      <img
                        src={item.image}
                        alt={item.nombre}
                        className="relative z-0 aspect-[4/3] w-full object-cover"
                      />
                      <CardHeader className="relative z-20">
                        <CardTitle className="text-xl font-serif text-[#1b1c1a]">
                          {item.nombre}
                        </CardTitle>
                        <CardDescription className="text-[#42493e]">
                          {item.descripcion}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto">
                        <AddToCartDialog
                          id={item.id}
                          nombre={item.nombre}
                          precio={item.precio}
                          descripcion={item.descripcion}
                          triggerClassName="w-full"
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Bebidas Tab */}
              <TabsContent value="bebidas" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  {/* Jugos Card */}
                  <Card className="bg-gradient-to-br from-[#bcf0ae] to-[#7de066] text-[#154212] border-0 shadow-lg w-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Leaf className="w-6 h-6" />
                        <CardTitle className="text-xl font-serif">Jugos Naturales</CardTitle>
                      </div>
                      <CardDescription className="text-[#2d5a27]">
                        Preparados con frutas frescas de la región
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-4 mt-auto">
                      {jugos.map((jugo, index) => (
                        <div key={index} className="flex justify-between items-center w-full py-2 border-b border-[#154212]/20 last:border-0 gap-2">
                          <span className="font-medium text-sm">{jugo.nombre}</span>
                          <AddToCartDialog
                            id={jugo.id}
                            nombre={jugo.nombre}
                            precio={jugo.precio}
                            triggerClassName="bg-[#154212] hover:bg-[#2d5a27] text-white px-4 py-2 h-auto text-xs font-medium whitespace-nowrap"
                          />
                        </div>
                      ))}
                    </CardFooter>
                  </Card>

                  {/* Sin Alcohol Card */}
                  <Card className="bg-[#f5f3ef] border-[#c2c9bb] shadow-lg w-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Wine className="w-6 h-6 text-[#934b19]" />
                        <CardTitle className="text-xl font-serif text-[#154212]">Sin Alcohol</CardTitle>
                      </div>
                      <CardDescription className="text-[#42493e]">
                        Refrescantes opciones para toda la familia
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-4 mt-auto">
                      {bebidasSinAlcohol.map((bebida, index) => (
                        <div key={index} className="flex justify-between items-center w-full py-2 border-b border-[#c2c9bb] last:border-0 gap-2">
                          <span className="font-medium text-sm text-[#1b1c1a]">{bebida.nombre}</span>
                          <AddToCartDialog
                            id={bebida.id}
                            nombre={bebida.nombre}
                            precio={bebida.precio}
                            triggerClassName="bg-[#154212] hover:bg-[#2d5a27] text-white px-4 py-2 h-auto text-xs font-medium whitespace-nowrap"
                          />
                        </div>
                      ))}
                    </CardFooter>
                  </Card>

                  {/* Alcoholicas Card */}
                  <Card className="bg-[#2d5a27] text-white border-0 shadow-lg w-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Wine className="w-6 h-6 text-[#bcf0ae]" />
                        <CardTitle className="text-xl font-serif">Alcoholicas</CardTitle>
                      </div>
                      <CardDescription className="text-[#bcf0ae]">
                        Seleccion de cervezas
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-4 mt-auto">
                      {bebidasAlcoholicas.map((bebida, index) => (
                        <div key={index} className="flex justify-between items-center w-full py-2 border-b border-white/20 last:border-0 gap-2">
                          <span className="font-medium text-sm">{bebida.nombre}</span>
                          <AddToCartDialog
                            id={bebida.id}
                            nombre={bebida.nombre}
                            precio={bebida.precio}
                            triggerClassName="bg-[#bcf0ae] hover:bg-white text-[#154212] px-4 py-2 h-auto text-xs font-semibold whitespace-nowrap"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-[#bcf0ae] italic mt-2">
                        * Solo para mayores de 18 anos
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Events CTA Section */}
        <section className="py-16 bg-[#154212] text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="bg-[#934b19] text-white mb-4">
                  <Heart className="w-3 h-3 mr-1" />
                  Eventos Especiales
                </Badge>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  Quieres celebrar con nosotros?
                </h2>
                <p className="text-[#bcf0ae] mb-8">
                  Organizamos eventos especiales, bautizos, grados y reuniones familiares con el sabor de siempre. Cotiza tu evento ahora.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#934b19] hover:bg-[#ffa26a] hover:text-[#783603] text-white rounded-xl"
                  >
                    <Link href="/eventos">
                      Cotizar Evento
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src="/img/evento-cumpleanos.jpeg"
                    alt="Evento"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden translate-y-8">
                  <img
                    src="/img/evento-familiar.jpeg"
                    alt="Evento"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-[#efeeea]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Badge className="bg-[#154212] text-white mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Notificar
            </Badge>
            <h2 className="text-3xl font-serif font-bold text-[#154212] mb-4">
              Recibe nuestras promociones
            </h2>
            <p className="text-[#42493e] mb-8 max-w-xl mx-auto">
              Suscríbete para recibir ofertas exclusivas, nuevos platos y eventos especiales directamente en tu correo.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loadingNewsletter}
                className="px-6 py-3 rounded-xl border border-[#72796e] focus:border-[#154212] focus:ring-1 focus:ring-[#154212] bg-white outline-none"
              />
              <Button 
                type="submit"
                disabled={loadingNewsletter}
                className="bg-[#934b19] hover:bg-[#783603] text-white px-8 py-3 rounded-xl disabled:opacity-50"
              >
                {loadingNewsletter ? 'Enviando...' : 'Suscribirme'}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
