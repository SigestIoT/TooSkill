import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/courses/ContactForm'
import { Mail, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact')
  return { title: t('title'), description: t('subtitle') }
}

export default async function ContattiPage() {
  const t = await getTranslations('contact')

  return (
    <div style={{ background: '#F0E9D8' }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: '#09080A' }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 70%, rgba(212,151,58,0.07) 0%, transparent 70%)',
          }}
        />
        {/* Amber rule top */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.4), transparent)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <p
            className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-6"
            style={{ color: 'rgba(212,151,58,0.55)' }}
          >
            — Contatti
          </p>

          <h1
            className="font-display font-extrabold text-white leading-[0.92] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
          >
            {t('title')}
          </h1>

          {/* Amber rule */}
          <div
            className="mb-6"
            style={{
              width: '4rem',
              height: '1px',
              background: 'linear-gradient(90deg, #D4973A, transparent)',
            }}
          />

          <p
            className="text-stone leading-relaxed max-w-md"
            style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Amber rule bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.15), transparent)',
          }}
        />
      </section>

      {/* Content */}
      <section style={{ background: '#F0E9D8' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* Email */}
              <div
                className="flex gap-4 items-start p-5"
                style={{
                  background: '#FAF6EE',
                  border: '1px solid rgba(212,151,58,0.22)',
                }}
              >
                <Mail
                  size={13}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#D4973A' }}
                />
                <div>
                  <h3
                    className="font-mono text-[0.58rem] tracking-[0.2em] uppercase mb-1.5"
                    style={{ color: 'rgba(212,151,58,0.7)' }}
                  >
                    Email
                  </h3>
                  <p className="text-sm" style={{ color: '#09080A' }}>info@tooskill.it</p>
                </div>
              </div>

              {/* Response time */}
              <div
                className="flex gap-4 items-start p-5"
                style={{
                  background: '#FAF6EE',
                  border: '1px solid rgba(212,151,58,0.22)',
                }}
              >
                <Clock
                  size={13}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#D4973A' }}
                />
                <div>
                  <h3
                    className="font-mono text-[0.58rem] tracking-[0.2em] uppercase mb-1.5"
                    style={{ color: 'rgba(212,151,58,0.7)' }}
                  >
                    Risposta entro
                  </h3>
                  <p className="text-sm" style={{ color: '#09080A' }}>24h</p>
                </div>
              </div>

              {/* Decorative editorial note */}
              <p
                className="font-mono text-[0.55rem] tracking-[0.16em] uppercase leading-relaxed pt-2"
                style={{ color: 'rgba(74,69,64,0.45)' }}
              >
                Ogni richiesta viene presa in carico personalmente dal team TooSkill.
              </p>
            </div>

            {/* Form — stays dark for strong contrast / CTA emphasis */}
            <div className="lg:col-span-3">
              <div
                className="p-8"
                style={{
                  background: '#1E1B14',
                  border: '1px solid rgba(212,151,58,0.18)',
                }}
              >
                {/* Amber accent top */}
                <div
                  className="-mt-8 -mx-8 mb-7"
                  style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, #D4973A, #F5C97A)',
                  }}
                />

                <h2
                  className="font-display font-extrabold text-white uppercase tracking-wider mb-6"
                  style={{ fontSize: '0.82rem' }}
                >
                  Invia un messaggio
                </h2>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
