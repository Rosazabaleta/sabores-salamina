'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCarrito } from '@/lib/carrito-context'
import { toast } from 'sonner'

interface AddToCartDialogProps {
  id: number
  nombre: string
  precio: number
  descripcion?: string
  triggerClassName?: string
}

export function AddToCartDialog({
  id,
  nombre,
  precio,
  descripcion,
  triggerClassName
}: AddToCartDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const { addToCart } = useCarrito()

  const handleAddToCart = () => {
    addToCart({
      id,
      name: nombre,
      price: precio,
      quantity
    })
    toast.success(`${nombre} agregado al carrito`, {
      description: `Cantidad: ${quantity} × ${precio.toLocaleString('es-CO')}`
    })
    setOpen(false)
    setQuantity(1)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const total = precio * quantity

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName || "w-full bg-[#154212] hover:bg-[#2d5a27] text-white"}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#154212]">{nombre}</DialogTitle>
          {descripcion && (
            <DialogDescription className="text-[#42493e] mt-2">
              {descripcion}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Price Badge */}
          <div className="flex justify-between items-center">
            <span className="text-[#72796e]">Precio unitario:</span>
            <Badge className="bg-[#154212] text-[#bcf0ae] text-lg px-4 py-2">
              ${precio.toLocaleString('es-CO')}
            </Badge>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#1b1c1a]">Cantidad</label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="border-[#154212] text-[#154212] hover:bg-[#f5f3ef] h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    if (val > 0) setQuantity(val)
                  }}
                  className="w-16 text-center py-2 text-lg font-bold border border-[#c2c9bb] rounded-lg focus:outline-none focus:border-[#154212]"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="border-[#154212] text-[#154212] hover:bg-[#f5f3ef] h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#f5f3ef] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm text-[#72796e]">
              <span>Subtotal</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-[#c2c9bb]">
              <span className="font-semibold text-[#1b1c1a]">Total</span>
              <span className="text-2xl font-bold text-[#154212]">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 border-[#c2c9bb] text-[#1b1c1a] hover:bg-[#f5f3ef]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-[#154212] text-white hover:bg-[#2d5a27]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al Carrito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
