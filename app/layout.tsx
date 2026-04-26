import type { Metadata } from 'next'
import { Newsreader } from 'next/font/google'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/carrito-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const newsreader = Newsreader({ 
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap"
});
const beVietnam = Be_Vietnam_Pro({ 
  subsets: ["latin"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: 'Sabores de Salamina',
  description: 'Restaurante colombiano especializado en eventos y catering',
  generator: 'v0.app',
  icons: {
    icon: 'data:,',
    shortcut: 'data:,',
    apple: 'data:,',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${newsreader.variable} ${beVietnam.variable}`}>
      <body className="font-be-vietnam antialiased bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
