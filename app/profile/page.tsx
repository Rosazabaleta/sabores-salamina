'use client'

import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  company_name: string | null
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setCompanyName(data.company_name || '')
      } catch (error: any) {
        toast.error('Error al cargar perfil')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          phone,
          company_name: companyName,
          updated_at: new Date(),
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Perfil actualizado correctamente')
    } catch (error: any) {
      toast.error('Error al guardar perfil')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">Actualiza tu información personal</p>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" value={user?.email || ''} disabled />
            <p className="text-xs text-muted-foreground mt-1">No puede ser modificado</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Nombre Completo
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez García"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Teléfono
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 1234567"
            />
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-2">
              Empresa/Organización
            </label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Mi Empresa S.A.S"
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4">Información de Cuenta</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Rol:</span> <span className="text-primary">Cliente</span>
          </p>
          <p>
            <span className="font-medium">Miembro desde:</span>{' '}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('es-CO')
              : 'N/A'}
          </p>
        </div>
      </Card>
    </div>
  )
}
