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
    <div>
      {/* Hero */}
      <section className="py-20 mesh-bg relative overflow-hidden">
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
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-4 items-start p-5 rounded-2xl bg-white border border-border">
                <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-deep text-sm mb-1">Email</h3>
                  <p className="text-muted-text text-sm">info@tooskill.it</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-5 rounded-2xl bg-white border border-border">
                <Clock className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-deep text-sm mb-1">
                    {t('success').split('.')[0]}
                  </h3>
                  <p className="text-muted-text text-sm">24h</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
