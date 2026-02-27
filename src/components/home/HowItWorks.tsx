'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  const t = useTranslations('how')
  const steps = t.raw('steps') as { step: string; title: string; desc: string }[]

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-text max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-14 left-[calc(33.3%-24px)] right-[calc(33.3%-24px)] h-px bg-gradient-to-r from-brand-primary/20 via-cyan/50 to-brand-primary/20" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {/* Circle */}
              <div className="relative z-10 w-28 h-28 rounded-full bg-midnight border border-brand-primary/20 flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/10">
                <span className="text-3xl font-display font-extrabold gradient-text">{step.step}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-deep mb-3">{step.title}</h3>
              <p className="text-muted-text text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
