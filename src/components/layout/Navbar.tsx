'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/corsi' as const, label: t('courses') },
    { href: '/chi-siamo' as const, label: t('about') },
    { href: '/contatti' as const, label: t('contact') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-deep/95 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-display font-extrabold text-white tracking-tight">
              Too<span className="gradient-text">Skill</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              asChild
              size="sm"
              className="bg-brand-primary hover:bg-brand-primary-dark text-white font-medium"
            >
              <Link href="/corsi">{t('cta')}</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-deep/98 backdrop-blur-md border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 pb-4 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-white/80 hover:text-white border-b border-white/5 text-sm"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <LanguageSwitcher />
              <Button
                asChild
                size="sm"
                className="bg-brand-primary hover:bg-brand-primary-dark text-white flex-1"
              >
                <Link href="/corsi" onClick={() => setOpen(false)}>
                  {t('cta')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
