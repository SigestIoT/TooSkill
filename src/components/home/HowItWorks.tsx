'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  const t = useTranslations('how')
  const steps = t.raw('steps') as { step: string; title: string; desc: string }[]

  return (
    <section className="py-28 bg-smoke relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #D4973A 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16 mb-24">
          <div className="lg:w-20 shrink-0">
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-amber/40">— 02</span>
          </div>
          <div>
            <h2
              className="font-display font-extrabold uppercase text-white leading-[0.88] tracking-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
            >
              {t('title')}
            </h2>
            <div className="amber-rule w-20 mb-5" />
            <p className="text-stone text-base sm:text-lg leading-relaxed max-w-xl">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal amber thread — desktop */}
          <div className="hidden lg:block absolute top-[3.6rem] left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,151,58,0.18) 15%, rgba(212,151,58,0.18) 85%, transparent)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0"
            style={{ gap: '1px', background: 'rgba(212,151,58,0.08)' }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative bg-smoke p-10 overflow-hidden hover:bg-ember/60 transition-colors duration-300"
              >
                {/* Ghost step number */}
                <span className="absolute -top-4 right-4 font-display font-extrabold text-[9rem] leading-none text-white/[0.025] select-none pointer-events-none">
                  {step.step}
                </span>

                {/* Step indicator dot */}
                <div className="relative z-10 flex items-center gap-4 mb-10">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ border: '1px solid rgba(212,151,58,0.4)', background: 'rgba(212,151,58,0.08)' }}
                  >
                    <span className="font-mono text-[0.52rem] text-amber tracking-widest">{step.step}</span>
                  </div>
                  <div className="h-px flex-1 bg-amber/10" />
                </div>

                {/* Content */}
                <h3
                  className="font-display font-extrabold uppercase text-white tracking-tight mb-4"
                  style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)' }}
                >
                  {step.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{step.desc}</p>

                {/* Bottom reveal bar */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: 'linear-gradient(90deg, #D4973A, #F5C97A)' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
