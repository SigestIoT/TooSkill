'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function toggle() {
    router.replace(pathname, { locale: locale === 'it' ? 'en' : 'it' })
  }

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-md border border-white/10 hover:border-white/30"
    >
      {locale === 'it' ? 'EN' : 'IT'}
    </button>
  )
}
