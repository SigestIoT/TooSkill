'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

const STORAGE_KEY = 'tooskill_cookie_notice'

export default function CookieBanner() {
  const t = useTranslations('cookie')
  const locale = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  const privacyHref = locale === 'it' ? '/privacy' : '/en/privacy'

  return (
    <div
      role="region"
      aria-label={t('aria_label')}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: '#09080A',
        borderTop: '1px solid rgba(212,151,58,0.25)',
      }}
    >
      {/* Amber rule */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D4973A 30%, #F5C97A 60%, transparent 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Text */}
        <p
          className="flex-1 text-sm leading-relaxed"
          style={{ color: 'rgba(240,233,216,0.70)' }}
        >
          {t('text')}{' '}
          <Link
            href={privacyHref}
            className="underline underline-offset-2 transition-colors"
            style={{ color: '#D4973A' }}
          >
            {t('privacy_link')}
          </Link>
          .
        </p>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="shrink-0 font-mono text-[0.6rem] tracking-[0.18em] uppercase px-5 py-2.5 transition-opacity hover:opacity-80"
          style={{
            background: '#D4973A',
            color: '#09080A',
            fontWeight: 700,
          }}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
