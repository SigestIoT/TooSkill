import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  const t = useTranslations('cta_section')

  return (
    <section className="py-32 bg-smoke relative overflow-hidden">
      {/* Amber radial glow — top right */}
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.12]"
        style={{ background: 'radial-gradient(circle, #F5C97A 0%, #D4973A 40%, transparent 70%)' }}
      />
      {/* Amber radial glow — bottom left */}
      <div
        className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #D4973A 0%, transparent 70%)' }}
      />

      {/* Decorative horizontal lines */}
      <div className="absolute top-0 left-0 right-0 amber-rule" />
      <div className="absolute bottom-0 left-0 right-0 amber-rule" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

          {/* Left: headline block */}
          <div className="lg:flex-1">
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-amber/50 block mb-6">
              — Ready?
            </span>
            <h2
              className="font-display font-extrabold uppercase text-white leading-[0.88] tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
            >
              {t('title')}
            </h2>
            <div className="amber-rule w-20" />
          </div>

          {/* Right: subtitle + CTA */}
          <div className="lg:w-[400px] shrink-0">
            <p className="text-stone text-base sm:text-lg leading-relaxed mb-10">
              {t('subtitle')}
            </p>

            <Link
              href="/contatti"
              className="group inline-flex items-center gap-3 px-8 py-4 font-display font-bold uppercase tracking-widest text-sm text-smoke transition-all duration-300"
              style={{
                background: 'linear-gradient(115deg, #D4973A 0%, #F5C97A 100%)',
                boxShadow: '0 0 40px rgba(212,151,58,0.25)',
              }}
            >
              {t('button')}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
