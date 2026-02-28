import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')
  return { title: t('title'), description: t('subtitle') }
}

const stats = [
  { value: '20+', label: 'anni di esperienza' },
  { value: '100+', label: 'progetti consegnati' },
  { value: '10+', label: 'paesi serviti' },
  { value: '50+', label: 'collaboratori' },
]

export default async function ChiSiamoPage() {
  const t = await getTranslations('about')
  const values = t.raw('values') as Array<{ title: string; desc: string }>

  return (
    <div style={{ background: '#131210' }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: '#09080A' }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 80% 40%, rgba(212,151,58,0.07) 0%, transparent 70%)',
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
            — Chi siamo
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
            className="text-stone leading-relaxed max-w-lg"
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

      {/* Sigest origin — parchment light section */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#F0E9D8' }}
      >
        {/* Amber rules */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,151,58,0.35), transparent)' }}
        />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Text */}
            <div>
              <p
                className="font-mono text-[0.58rem] tracking-[0.26em] uppercase mb-4"
                style={{ color: 'rgba(212,151,58,0.7)' }}
              >
                — 01 / La nostra storia
              </p>
              <h2
                className="font-display font-extrabold leading-tight tracking-[-0.02em] mb-5"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  color: '#09080A',
                }}
              >
                {t('sigest_title')}
              </h2>
              <div
                className="mb-5"
                style={{
                  width: '3rem',
                  height: '1px',
                  background: 'linear-gradient(90deg, #D4973A, transparent)',
                }}
              />
              <p
                className="leading-relaxed"
                style={{ color: '#4a4540', fontSize: '0.9rem' }}
              >
                {t('sigest_desc')}
              </p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2"
              style={{ gap: '1px', background: 'rgba(212,151,58,0.18)' }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center py-10 px-6 text-center"
                  style={{ background: '#F0E9D8' }}
                >
                  <div
                    className="font-display font-extrabold mb-1"
                    style={{
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                      background: 'linear-gradient(135deg, #D4973A 0%, #F5C97A 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="font-mono text-[0.58rem] tracking-[0.16em] uppercase"
                    style={{ color: 'rgba(74,69,64,0.55)' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,151,58,0.25), transparent)' }}
        />
      </section>

      {/* Values — dark editorial index rows */}
      <section className="relative overflow-hidden" style={{ background: '#131210' }}>
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 100% 50%, rgba(212,151,58,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                className="font-mono text-[0.58rem] tracking-[0.26em] uppercase mb-3"
                style={{ color: 'rgba(212,151,58,0.55)' }}
              >
                — 02 / I nostri valori
              </p>
              <h2
                className="font-display font-extrabold text-white leading-tight tracking-[-0.02em]"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
              >
                {t('values_title')}
              </h2>
            </div>
          </div>

          {/* Index rows */}
          <div style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}>
            {values.map((v, i) => (
              <div
                key={i}
                className="group relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-7 transition-all duration-300"
                style={{ borderBottom: '1px solid rgba(212,151,58,0.10)' }}
              >
                {/* Hover bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: 'rgba(30,27,20,0.5)' }}
                />
                {/* Left amber reveal bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[2px] transition-all duration-300 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, #D4973A, #F5C97A)' }}
                />

                {/* Index number */}
                <span
                  className="relative font-mono text-[0.65rem] tracking-[0.2em] uppercase shrink-0 pt-0.5"
                  style={{ color: 'rgba(212,151,58,0.30)', minWidth: '2.5rem' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="relative flex-1">
                  <h3
                    className="font-display font-bold text-white group-hover:text-amber/90 transition-colors duration-300 mb-2"
                    style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-stone text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
