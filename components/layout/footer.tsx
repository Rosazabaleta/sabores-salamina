import Link from "next/link"
import { MapPin, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#154212] text-white py-16 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-headline-sm font-serif">Sabores de Salamina</h2>
          <p className="text-white/80 text-body-md leading-relaxed">
            Preservando las tradiciones culinarias de nuestro pueblo para las nuevas generaciones.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Explora Column */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-label-md uppercase tracking-widest text-[#bcf0ae]">Explora</h4>
          <nav className="flex flex-col gap-3">
            <Link href="/menu" className="text-white/70 hover:text-white transition-colors">
              Menú
            </Link>
            <Link href="/eventos" className="text-white/70 hover:text-white transition-colors">
              Eventos
            </Link>
          </nav>
        </div>

        {/* Location Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-label-md uppercase tracking-widest text-[#bcf0ae]">Visitanos</h4>
          <div className="flex items-start gap-3 text-white/80">
            <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
            <address className="not-italic">
              Carrera 6 #4-22<br />
              Salamina, Magdalena<br />
              Colombia
            </address>
          </div>
          <p className="text-white/80 text-sm">
            <strong>Horario:</strong> Lun - Dom, 7:00 AM - 9:00 PM
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© 2026 Sabores de Salamina. Tradición y Bienvenida.</p>
          <div className="flex gap-6">
          </div>
        </div>
      </div>
    </footer>
  )
}
