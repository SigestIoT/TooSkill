'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-smoke/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      style={scrolled ? { borderBottom: '1px solid rgba(212,151,58,0.12)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-display font-extrabold text-lg tracking-tight text-white uppercase">
              Too<span className="amber-text-gradient">Skill</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-white/50 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/corsi"
              className="font-display font-bold uppercase tracking-widest text-[0.65rem] text-smoke px-5 py-2.5 transition-all duration-300 hover:opacity-90"
              style={{ background: 'linear-gradient(115deg, #D4973A 0%, #F5C97A 100%)' }}
            >
              {t('cta')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden backdrop-blur-md"
          style={{ background: 'rgba(19,18,16,0.97)', borderBottom: '1px solid rgba(212,151,58,0.12)' }}
        >
          <div className="max-w-7xl mx-auto px-6 pb-6 pt-2">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-4 font-mono text-[0.68rem] tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors"
                style={i < links.length - 1 ? { borderBottom: '1px solid rgba(212,151,58,0.08)' } : {}}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-5">
              <LanguageSwitcher />
              <Link
                href="/corsi"
                className="flex-1 text-center font-display font-bold uppercase tracking-widest text-[0.65rem] text-smoke py-3 px-4"
                style={{ background: 'linear-gradient(115deg, #D4973A 0%, #F5C97A 100%)' }}
                onClick={() => setOpen(false)}
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
