'use client'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Props {
  courseId?: string
  courseTitle?: string
  /** Forces all fields to a single column — use in narrow sidebars */
  singleColumn?: boolean
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

const inputBase: React.CSSProperties = {
  background: 'rgba(9,8,10,0.7)',
  border: '1px solid rgba(212,151,58,0.16)',
  color: '#FAF6EE',
  outline: 'none',
  width: '100%',
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-[0.57rem] tracking-[0.22em] uppercase text-amber/45 block mb-1.5"
      >
        {label}
        {required && <span className="text-amber/60 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function ContactForm({ courseId, courseTitle, singleColumn }: Props) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [turnstileLoaded, setTurnstileLoaded] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileEnabled =
    Boolean(turnstileSiteKey) && turnstileSiteKey !== 'your_turnstile_site_key_here'

  useEffect(() => {
    if (!turnstileEnabled || !turnstileLoaded || !turnstileContainerRef.current || widgetIdRef.current) {
      return
    }

    if (!window.turnstile) {
      return
    }

    widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey!,
      theme: 'dark',
      callback: (token: string) => {
        setTurnstileToken(token)
        setStatus('idle')
      },
      'expired-callback': () => {
        setTurnstileToken('')
      },
      'error-callback': () => {
        setTurnstileToken('')
        setStatus('error')
      },
    })
  }, [turnstileEnabled, turnstileLoaded, turnstileSiteKey])

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'rgba(212,151,58,0.50)'
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'rgba(212,151,58,0.16)'
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (turnstileEnabled && !turnstileToken) {
      setStatus('error')
      return
    }

    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company') || null,
      phone: fd.get('phone') || null,
      message: fd.get('message'),
      course_id: courseId ?? null,
      course_title: courseTitle ?? null,
      type: courseId ? 'course_inquiry' : 'general',
      locale,
      turnstileToken: turnstileEnabled ? turnstileToken : null,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      if (turnstileEnabled && window.turnstile && widgetIdRef.current) {
        setTurnstileToken('')
        window.turnstile.reset(widgetIdRef.current)
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-5 py-14 text-center">
        <div
          className="w-12 h-12 flex items-center justify-center"
          style={{
            border: '1px solid rgba(212,151,58,0.40)',
            background: 'rgba(212,151,58,0.08)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10l4.5 4.5L16 6"
              stroke="#D4973A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-display font-bold text-white text-sm uppercase tracking-wider">
          {t('success')}
        </p>
      </div>
    )
  }

  // In singleColumn mode every field spans the full width.
  // In default mode name+email share a row, phone+company share a row.
  const gridClass = singleColumn ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {turnstileEnabled && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileLoaded(true)}
        />
      )}

      <div className={gridClass}>
        <Field id="name" label={t('name')} required>
          <input
            id="name"
            name="name"
            required
            style={inputBase}
            className="px-4 py-3 text-sm"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

        <Field id="email" label={t('email')} required>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={inputBase}
            className="px-4 py-3 text-sm"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

        <Field id="phone" label={t('phone')}>
          <input
            id="phone"
            name="phone"
            type="tel"
            style={inputBase}
            className="px-4 py-3 text-sm"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>

        <Field id="company" label={t('company')}>
          <input
            id="company"
            name="company"
            style={inputBase}
            className="px-4 py-3 text-sm"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Field>
      </div>

      <Field id="message" label={t('message')} required>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          style={inputBase}
          className="px-4 py-3 text-sm resize-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Field>

      {/* Privacy consent */}
      <label className="flex items-start gap-3 cursor-pointer group/privacy">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            name="privacy"
            id="privacy"
            required
            checked={privacyChecked}
            onChange={(e) => setPrivacyChecked(e.target.checked)}
            className="sr-only"
          />
          <div
            className="w-4 h-4 flex items-center justify-center transition-all duration-200"
            style={{
              border: privacyChecked
                ? '1px solid rgba(212,151,58,0.70)'
                : '1px solid rgba(212,151,58,0.25)',
              background: privacyChecked ? 'rgba(212,151,58,0.15)' : 'rgba(9,8,10,0.7)',
            }}
          >
            {privacyChecked && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M1.5 4.5l2 2 4-4"
                  stroke="#D4973A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        <span
          className="font-mono text-[0.57rem] tracking-[0.12em] leading-relaxed select-none"
          style={{ color: 'rgba(156,148,136,0.65)' }}
        >
          {t('privacy_before')}{' '}
          <Link
            href="/privacy"
            className="transition-colors duration-150"
            style={{ color: 'rgba(212,151,58,0.75)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {t('privacy_link')}
          </Link>
        </span>
      </label>

      {turnstileEnabled && (
        <div className="overflow-hidden" aria-live="polite">
          <div ref={turnstileContainerRef} />
        </div>
      )}

      {status === 'error' && (
        <p className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-red-400/80">
          {t('error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 font-display font-bold text-[0.75rem] uppercase tracking-[0.14em] transition-opacity duration-200 disabled:opacity-50"
        style={{
          background: 'linear-gradient(115deg, #D4973A 0%, #F5C97A 100%)',
          color: '#09080A',
        }}
      >
        {status === 'loading' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <ArrowRight size={14} />
        )}
        {t('submit')}
      </button>
    </form>
  )
}
