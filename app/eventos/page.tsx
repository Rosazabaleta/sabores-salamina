'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
  CardAction
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Cake,
  GraduationCap,
  Users,
  UtensilsCrossed,
  Send,
  ArrowRight,
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react'

const eventos = [
  {
    id: 'cumpleaños',
    nombre: 'Cumpleaños',
    descripcion: 'Celebración familiar con menú tradicional, bebidas y atención básica en un ambiente agradable.',
    precio: 20000,
    icon: Cake,
    image: '/img/evento-cumpleanos.jpeg'
  },
  {
    id: 'grado',
    nombre: 'Grado',
    descripcion: 'Servicio especial para celebraciones de grado, con platos completos y atencion para grupos medianos o grandes.',
    precio: 25000,
    icon: GraduationCap,
    image: '/img/evento-grado.jpeg'
  },
  {
    id: 'reunion',
    nombre: 'Reunion familiar',
    descripcion: 'Encuentros familiares con comida tradicional, bebidas y un ambiente tranquilo.',
    precio: 18000,
    icon: Users,
    image: '/img/evento-familiar.jpeg'
  },
  {
    id: 'buffet',
    nombre: 'Buffet',
    descripcion: 'Variedad de platos típicos tipo buffet, con acompañamientos y bebidas para mayor comodidad de los invitados.',
    precio: 30000,
    icon: UtensilsCrossed,
    image: '/img/evento-buffet.jpeg'
  }
]

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdpWLx6jkgQ6tDYSI6-tluSd0_JZ_8QICPTNyQN7ThANnUbxmLRONDAMQHsREkHRBWHS5AOqhaESa__pz85y8JsbPMI32eCwz-komrJC9EM7Xowa0_eCIuxtoOsLIoFrjECsZYD-8ROoClIfqOLrcmUNQ6V2pnW6ePLWitRHFqAj2qXPM3D4wZBvdu5zh-WyWmxoYrNTCtYmNytD1fKU8fpyxUIdybsHr5rZSztdPahB3gXGaSdfc4Eb1k_n2EraeSK0YcgYwvtk32",
    alt: "Wedding table setting",
    label: "Bodas"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtkJH4OoaPQo1zE4H1ieEKuWjKoh8Wj8svUi7hWAWVct-89ucWpM1BgD2P5qhAeXgbb6Mwc-ybEEYN27U9RyoZOsnMUJLRA9vpopZpAlCY2ZiXcuivXUyB9axtNpadGnzjIzRzXH0SJ_6e27GMK-hkRnvVnzZt3DXiOuh0msUBQ1EC-DKuMTqSKL-PhoYfEHXnho2_2CM5ZScybwLz1Q8dUlTLjSgPECxeLxYzffEt0msU207n35fgc571t8wryPbE9ikUPqgkL_HV",
    alt: "Corporate dinner",
    label: "Corporativos"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFZaffS3Obx5qgtrAS0IXCrlzz0bmhZFZWCkqfKCsjNbYSWNOIqU-dwmggpbz4qBwR2BsTX8jYbcVrGgjsoKVnCJbQWxMQrMKAtVCGQvjUnxZhHhAU57jWdcNYvE4tGOnOELeCG3s5DOnrySnJLcqrPUmnKLfn1vtGF-XSsL3WWptTmq97VlULnSgoEv0e6dzdad7SLb9vXKEwsaEWgze3t9Ycw_-S-2fqijcXJf4R6rsjQY6b1kMpqM_0Nyymsmeb6X3oC_I-Exjn",
    alt: "Birthday celebration",
    label: "Celebraciones"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUqbCrYzgbA7gj4DEsioDC6KTLI42xvkraZQ4CXc5IvjR_9evJRrHNmfbYgWU5L6yTlyfmOh9bXuuzLdSR_4etgJn3cO7L0DG5REKQNT1HkBdKz0Mc_5cgvUtGDSaj4bvli8lfd4xeD4aN5Ti8FdRDVikDu8f1b0pwPBmPRp4gQtX2vX-SJ5WEPxW3D13J0fuiO7sGZMietRoHamQ5WsFhMqnb97ncC7yiNij_CZLRyJJ-oOT4tJSNBTea8JiCIfk2PIBeaQmc65mx",
    alt: "Fine dining plate",
    label: "Platos de Autor"
  }
]

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-CO")}`
}

export default function EventosPage() {
  const [selectedEvento, setSelectedEvento] = useState(eventos[0])
  const [personas, setPersonas] = useState(50)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(undefined)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingAdvisor, setLoadingAdvisor] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Initialize dates only on client side to prevent hydration mismatch
    setDate(addDays(new Date(), 7))
    setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    setIsLoaded(true)
  }, [])

  const total = useMemo(() => {
    return selectedEvento.precio * personas
  }, [selectedEvento, personas])

  const handleSolicitarCotizacion = async () => {
    setLoadingQuote(true)
    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('¡Cotización solicitada!', {
        description: 'Nuestro equipo se pondrá en contacto pronto con los detalles de tu evento.'
      })
    } catch (error) {
      toast.error('Error', {
        description: 'No pudimos procesar tu solicitud. Intenta nuevamente.'
      })
    } finally {
      setLoadingQuote(false)
    }
  }

  const handleHablarAsesor = async () => {
    setLoadingAdvisor(true)
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('¡Solicitud enviada!', {
        description: 'Un asesor se comunicará contigo en los próximos 30 minutos.'
      })
    } catch (error) {
      toast.error('Error', {
        description: 'No pudimos enviar tu solicitud. Intenta nuevamente.'
      })
    } finally {
      setLoadingAdvisor(false)
    }
  }

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-16 text-center">
          <Badge className="bg-[#934b19] text-white mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Eventos Especiales
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#154212] mb-4">
            Cotiza tu evento inolvidable
          </h1>
          <p className="text-lg text-[#42493e] max-w-2xl mx-auto">
            Desde celebraciones familiares íntimas hasta grandes eventos corporativos,
            llevamos la esencia y tradicion de Salamina a tu mesa.
          </p>
        </header>

        {/* Tabs for event types with CardImage */}
        <Tabs defaultValue="cumpleaños" className="mb-16">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4 bg-[#f5f3ef] p-1 rounded-xl mb-8">
            {eventos.map((evento) => {
              const Icon = evento.icon
              return (
                <TabsTrigger
                  key={evento.id}
                  value={evento.id}
                  onClick={() => setSelectedEvento(evento)}
                  className="flex items-center gap-2 data-[state=active]:bg-[#154212] data-[state=active]:text-white rounded-lg transition-all"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{evento.nombre}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {eventos.map((evento) => (
            <TabsContent key={evento.id} value={evento.id}>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Event Card with Image */}
                <Card className="relative overflow-hidden pt-0 border-0 shadow-lg">
                  <div className="absolute inset-0 z-10 aspect-video bg-gradient-to-b from-black/10 to-black/40" />
                  <img
                    src={evento.image}
                    alt={evento.nombre}
                    className="relative z-0 aspect-video w-full object-cover"
                  />
                  <CardHeader className="relative z-20">
                    <CardAction>
                      <Badge className="bg-[#bcf0ae] text-[#154212]">
                        {formatPrice(evento.precio)} p/p
                      </Badge>
                    </CardAction>
                    <CardTitle className="text-2xl font-serif text-[#154212]">
                      {evento.nombre}
                    </CardTitle>
                    <CardDescription className="text-[#42493e] text-base">
                      {evento.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-[#42493e]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#934b19]" />
                        <span>4-6 horas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#934b19]" />
                        <span>20-200 personas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#934b19]" />
                        <span>Salamina, Magdalena</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quotation Form */}
                <div className="space-y-6">
                  {/* Calendar with Presets */}
                  <Card className="border-[#c2c9bb]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#154212]">
                        <CalendarDays className="w-5 h-5" />
                        Selecciona la fecha
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoaded && (
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          month={currentMonth}
                          onMonthChange={setCurrentMonth}
                          locale={es}
                          fixedWeeks
                          className="p-0 mx-auto"
                        />
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                      {[
                        { label: "Hoy", value: 0 },
                        { label: "Mañana", value: 1 },
                        { label: "En 3 dias", value: 3 },
                        { label: "En 1 semana", value: 7 },
                        { label: "En 2 semanas", value: 14 },
                      ].map((preset) => (
                        <Button
                          key={preset.value}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#154212] text-[#154212] hover:bg-[#bcf0ae] hover:border-[#154212] hover:text-[#154212]"
                          onClick={() => {
                            const newDate = addDays(new Date(), preset.value)
                            setDate(newDate)
                            setCurrentMonth(
                              new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                            )
                          }}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </CardFooter>
                  </Card>

                  {/* Guests Input */}
                  <Card className="border-[#c2c9bb]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#154212]">
                        <Users className="w-5 h-5" />
                        Numero de Invitados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="number"
                        min="1"
                        max="500"
                        value={personas}
                        onChange={(e) => setPersonas(parseInt(e.target.value) || 1)}
                        className="text-center text-2xl font-bold h-16 border-[#c2c9bb] focus:border-[#154212]"
                      />
                      <p className="text-sm text-[#42493e] text-center mt-2">
                        Minimo 20 personas para eventos
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary Card - Sticky */}
        <div className="sticky bottom-20 z-40 max-w-4xl mx-auto">
          <Card className="bg-[#154212] text-white border-0 shadow-2xl">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div>
                    <p className="text-sm opacity-80">Evento seleccionado</p>
                    <p className="font-bold text-lg">{selectedEvento.nombre}</p>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-white/20" />
                  <div>
                    <p className="text-sm opacity-80">Fecha</p>
                    <p className="font-bold text-lg">
                      {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </p>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-white/20" />
                  <div>
                    <p className="text-sm opacity-80">Invitados</p>
                    <p className="font-bold text-lg">{personas} personas</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm opacity-80">Total estimado</p>
                    <p className="font-bold text-2xl">{formatPrice(total)}</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSolicitarCotizacion}
                    disabled={loadingQuote}
                    className="bg-[#934b19] hover:bg-[#ffa26a] hover:text-[#783603] text-white font-bold px-8 disabled:opacity-70"
                  >
                    {loadingQuote ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Solicitar Cotizacion
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <Card className="bg-[#f5f3ef] border-dashed border-2 border-[#c2c9bb] py-12">
            <CardContent>
              <h3 className="text-2xl font-serif font-bold text-[#154212] mb-4">
                Necesitas algo especial?
              </h3>
              <p className="text-[#42493e] mb-6 max-w-xl mx-auto">
                Contactanos para servicios personalizados de decoración, música en vivo,
                transporte y más. Hacemos tu evento único.
              </p>
              <Button 
                variant="outline" 
                onClick={handleHablarAsesor}
                disabled={loadingAdvisor}
                className="border-[#934b19] text-[#934b19] hover:bg-[#934b19] hover:text-white disabled:opacity-70"
              >
                {loadingAdvisor ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  <>
                    Hablar con un asesor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
