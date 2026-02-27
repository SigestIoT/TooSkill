import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  const t = useTranslations('cta_section')

  return (
    <section className="py-28 mesh-bg relative overflow-hidden">
      {/* Center radial glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, #4F6EF7 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight mb-6 tracking-tight">
          {t('title')}
        </h2>
        <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          {t('subtitle')}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-brand-primary hover:bg-brand-primary-dark glow-primary text-white px-10 h-13 text-base font-medium group"
        >
          <Link href="/contatti">
            {t('button')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
