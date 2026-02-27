import { getTranslations } from 'next-intl/server'
import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')
  return { title: t('title'), description: t('subtitle') }
}

export default async function ChiSiamoPage() {
  const t = await getTranslations('about')
  const values = t.raw('values') as Array<{ title: string; desc: string }>

  return (
    <div>
      {/* Hero */}
      <section className="py-24 mesh-bg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 50%, #4F6EF7 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Sigest origin */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-display font-bold text-deep mb-5">
                {t('sigest_title')}
              </h2>
              <p className="text-muted-text leading-relaxed">{t('sigest_desc')}</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '20+', label: 'anni di esperienza' },
                { value: '100+', label: 'progetti consegnati' },
                { value: '10+', label: 'paesi serviti' },
                { value: '50+', label: 'collaboratori' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border p-6 text-center bg-surface"
                >
                  <div className="text-3xl font-display font-extrabold gradient-text mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-text">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-deep text-center mb-12">
            {t('values_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-2xl bg-white border border-border hover:border-brand-primary/30 hover:shadow-md transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-deep mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-text leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
