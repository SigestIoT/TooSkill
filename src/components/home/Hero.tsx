'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const statsData = [
  { value: '20+', key: 'years' },
  { value: '100+', key: 'projects' },
  { value: '10+', key: 'countries' },
]

export default function Hero() {
  const t = useTranslations('hero')
  const ts = useTranslations('stats')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center mesh-bg overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-100" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          {t('badge')}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.05] tracking-tight mb-6"
        >
          Trasforma il tuo team in{' '}
          <span className="gradient-text">esperti SAP</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('subheadline')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white glow-primary px-8 h-12 text-base font-medium"
          >
            <Link href="/corsi">
              {t('cta_primary')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white px-8 h-12 text-base"
          >
            <Link href="/contatti">{t('cta_secondary')}</Link>
          </Button>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {statsData.map((s) => (
            <div key={s.key} className="glass-card rounded-xl px-6 py-3 text-center min-w-[110px]">
              <p className="text-2xl font-display font-extrabold gradient-text">{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5">{ts(s.key)}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
