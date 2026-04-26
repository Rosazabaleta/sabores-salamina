'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { toast } from 'sonner'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('¡Bienvenido!', {
        description: 'Inicio sesión correctamente'
      })
      router.push('/mi-cuenta')
    } catch (error: any) {
      toast.error('Error al iniciar sesión', {
        description: error.message || 'Por favor, intenta nuevamente'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fbf9f5] text-[#1b1c1a] min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-stone-50/95 backdrop-blur-md border-b border-stone-200 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold font-serif text-green-900">
            Sabores de Salamina
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-serif text-lg tracking-tight">
            <Link href="/menu" className="text-stone-600 hover:text-green-700 transition-colors">Menu</Link>
            <Link href="/eventos" className="text-stone-600 hover:text-green-700 transition-colors">Eventos</Link>
            <span className="text-green-700 border-b-2 border-green-700 pb-1 font-semibold">Mi Cuenta</span>
          </nav>
          <Button asChild className="bg-[#154212] text-white hover:bg-[#2d5a27] transition-all active:scale-95 shadow-md">
            <Link href="/eventos">Reservar</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-16 px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl overflow-hidden tonal-shadow border border-[#e4e2de]">
          {/* Left Side: Decorative/Welcome */}
          <div className="relative hidden lg:block overflow-hidden min-h-[500px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7e-MPd4HnnX7aq4P4vzUXONqSPUpljlzethIQOneAYlDv7IOZupYVUxa80UzgAtt5xwI18UgMgnb94Tzf_yIZ0Pa3S-aKfibxyRs0Yy7aktdVSmLyzCAvqafkFXllOy7XkzQrE7pWKpIRoYZbiKCwBNDYyXr72nZX9VWbKrHQy7okS1xzSzwlAPD2QqSXKSq6uVBVx6_NLTvqepHeJg6f3XcyT3P2Z_BN_UoOLECtmD9LwYxdN1Z8k3SgVRmwhOhwf-6gziAHDsOM"
              alt="Traditional Colombian courtyard"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#154212]/80 to-transparent flex flex-col justify-end p-10">
              <h1 className="text-display-lg text-white mb-2">Bienvenido de nuevo</h1>
              <p className="text-white/90 text-body-lg">
                Accede a tu cuenta para gestionar tus pedidos y reservas.
              </p>
            </div>
          </div>

          {/* Right Side: Auth Forms */}
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-headline-md text-[#154212] mb-1">Iniciar Sesion</h2>
              <p className="text-[#42493e]">Ingresa tus credenciales para acceder.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-label-md text-[#1b1c1a]">Correo Electronico</label>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-6 bg-[#f5f3ef] border border-[#72796e] rounded-lg form-input-focus transition-all text-[#1b1c1a]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-md text-[#1b1c1a]">Contrasena</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-6 bg-[#f5f3ef] border border-[#72796e] rounded-lg form-input-focus transition-all text-[#1b1c1a] pr-12"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#72796e] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#154212] text-white text-label-md py-6 rounded-lg shadow-md hover:bg-[#2d5a27] hover:scale-[1.01] transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  {loading ? 'Iniciando...' : 'Iniciar Sesion'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="mt-16 text-center">
              <p className="text-[#42493e] text-body-md">No tienes una cuenta?</p>
              <Link 
                href="/auth/signup" 
                className="mt-2 text-[#934b19] text-label-md hover:text-[#783603] transition-colors border-b border-transparent hover:border-[#934b19] inline-block"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
