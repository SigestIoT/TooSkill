'use client'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, MessageSquare, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const guid = params.guid as string

  const nav = [
    { href: `/admin/${guid}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/admin/${guid}/corsi`, label: 'Corsi', icon: BookOpen },
    { href: `/admin/${guid}/richieste`, label: 'Richieste', icon: MessageSquare },
  ]

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push(`/admin/${guid}/login`)
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-deep border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="text-white font-display font-bold text-lg">
            Too<span className="text-brand-primary">Skill</span>
          </span>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-brand-primary/20 text-brand-primary font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/50 hover:text-white hover:bg-white/5 gap-3"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Esci
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
