'use client'

import { useState } from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AddToCartDialog } from "@/components/ui/add-to-cart-dialog"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction
} from "@/components/ui/card"
import {
  CheckCircle,
  UtensilsCrossed,
  Sandwich,
  Wine,
  Flame,
  Leaf,
  Clock,
  Plus
} from "lucide-react"
import { useCarrito } from "@/lib/carrito-context"

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
  },
  {
    id: 4,
    nombre: "Sancocho de gallina",
    descripcion: "Sopa tradicional con gallina criolla, yuca, platano, papa y mazorca en caldo de hierbas.",
    precio: 22000,
    disponible: true,
    image: "/img/sanchocho-gallina.jpeg",
    tags: ["Tradicional", "Sopa"]
  },
  {
    id: 5,
    nombre: "Carne asada",
    descripcion: "Jugosa carne de res asada al carbon, servida con arepas, papa salada y guacamole casero.",
    precio: 26000,
    disponible: true,
    image: "/img/carne-asada.jpeg",
    tags: ["Parrilla"]
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
  { id: 12, nombre: "Zapote", precio: 5000 },
  { id: 13, nombre: "Lulo", precio: 5000 },
  { id: 14, nombre: "Maracuya", precio: 5000 }
]

const bebidasSinAlcohol = [
  { id: 15, nombre: "Agua", precio: 2000 },
  { id: 16, nombre: "Aguapanela", precio: 5000 },
  { id: 17, nombre: "Coca-Cola", precio: 2500 },
  { id: 18, nombre: "Kola Roman", precio: 2500 },
  { id: 19, nombre: "Cafe", precio: 3000 },
  { id: 20, nombre: "Tinto", precio: 1500 }
]

const bebidasAlcoholicas = [
  { id: 21, nombre: "Cerveza Corona", precio: 5000 },
  { id: 22, nombre: "Cerveza Club Colombia", precio: 4500 },
  { id: 23, nombre: "Aguardiente Antioqueno", precio: 8000 },
  { id: 24, nombre: "Ron Medellin", precio: 10000 }
]

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`
}

export default function MenuPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { cartItems } = useCarrito()

  const allTags = [...new Set(platosFuertes.flatMap(p => p.tags))]
  const filteredPlatos = selectedTag
    ? platosFuertes.filter(p => p.tags.includes(selectedTag))
    : platosFuertes

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen">
      <Header />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <Badge className="bg-[#bcf0ae] text-[#154212] mb-4">
              <UtensilsCrossed className="w-3 h-3 mr-1" />
              Carta Completa
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#154212] mb-4">
              Nuestro Menú
            </h1>
            <p className="text-lg text-[#42493e] max-w-2xl mx-auto">
              Explora nuestra seleccion de platos tradicionales de la region cafetera,
              preparados con ingredientes frescos y recetas de generaciones.
            </p>
          </div>
        </div>

        {/* Menu Content with Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <Tabs defaultValue="fuertes" className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 bg-[#f5f3ef] p-1.5 rounded-xl mb-10 h-auto">
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
              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className={selectedTag === null ? "bg-[#154212] text-white hover:bg-[#2d5a27]" : "border-[#154212] text-[#154212] hover:bg-[#f5f3ef]"}
                >
                  Todos ({platosFuertes.length})
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? "bg-[#154212] text-white hover:bg-[#2d5a27]" : "border-[#154212] text-[#154212] hover:bg-[#f5f3ef]"}
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlatos.map((plato, index) => (
                  <Card key={index} className="relative overflow-hidden pt-0 border-0 shadow-md hover:shadow-xl transition-all group flex flex-col">
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
                      <CardTitle className="text-xl font-serif text-[#1b1c1a]">
                        {plato.nombre}
                      </CardTitle>
                      <CardDescription className="text-[#42493e]">
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
              <div className="mb-8 flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-[#934b19]" />
                <Badge className="bg-[#705d00] text-white text-sm px-4 py-1">
                  Solo Almuerzo: 11:30 AM - 3:00 PM
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuCorriente.map((item, index) => (
                  <Card key={index} className="relative overflow-hidden pt-0 border-0 shadow-md hover:shadow-xl transition-shadow flex flex-col">
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-[#934b19] text-white font-bold text-sm">
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

              <div className="mt-8 p-6 bg-[#f5f3ef] rounded-xl text-center">
                <p className="text-[#42493e]">
                  <strong>Incluye:</strong> Sopa del dia, plato principal, bebida natural y postre
                </p>
              </div>
            </TabsContent>

            {/* Bebidas Tab */}
            <TabsContent value="bebidas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Jugos Card */}
                <Card className="bg-gradient-to-br from-[#bcf0ae] to-[#7de066] text-[#154212] border-0 shadow-lg flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Leaf className="w-6 h-6" />
                      <CardTitle className="text-xl font-serif">Jugos Naturales</CardTitle>
                    </div>
                    <CardDescription className="text-[#2d5a27]">
                      Preparados con frutas frescas de la region
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
                <Card className="bg-[#f5f3ef] border-[#c2c9bb] shadow-lg flex flex-col">
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
                <Card className="bg-[#2d5a27] text-white border-0 shadow-lg flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Wine className="w-6 h-6 text-[#bcf0ae]" />
                      <CardTitle className="text-xl font-serif">Alcoholicas</CardTitle>
                    </div>
                    <CardDescription className="text-[#bcf0ae]">
                      Seleccion de cervezas y licores regionales
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
                    <p className="text-xs text-[#bcf0ae] italic mt-2 pt-2 border-t border-white/20 w-full">
                      * Solo para mayores de 18 anos. Prohibida su venta a menores.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
