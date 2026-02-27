'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const params = useParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Password non corretta')
        return
      }
      router.push(`/admin/${params.guid}`)
    } catch {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-white font-display font-bold text-2xl">
            Too<span className="text-brand-primary">Skill</span>
          </span>
          <p className="text-muted-text text-sm mt-1">Area riservata</p>
        </div>

        <div className="bg-deep rounded-2xl border border-white/10 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-brand-primary" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white/70 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-midnight border-white/10 text-white placeholder:text-white/30 focus-visible:ring-brand-primary"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              Accedi
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
