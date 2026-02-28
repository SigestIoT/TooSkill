'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const levelNums = ['01', '02', '03', '04']

export default function TrainingLevels() {
  const t = useTranslations('levels')
  const items = t.raw('items') as { name: string; desc: string; duration: string }[]

  return (
    <section className="py-28 bg-void relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-[0.05]"
        style={{ background: 'radial-gradient(ellipse, #D4973A 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16 mb-16">
          <div className="lg:w-20 shrink-0">
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-amber/40">— 03</span>
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

        {/* Index rows */}
        <div style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 py-8 cursor-default"
              style={{ borderBottom: '1px solid rgba(212,151,58,0.10)' }}
            >
              {/* Hover background fill */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'rgba(30,27,20,0.6)' }}
              />

              {/* Left amber reveal bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[2px] transition-all duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, #D4973A, #F5C97A)' }}
              />

              {/* Number */}
              <span className="relative font-mono text-[0.62rem] tracking-[0.22em] text-amber/40 shrink-0 lg:w-20 group-hover:text-amber/70 transition-colors duration-300">
                {levelNums[i]}
              </span>

              {/* Level name — the anchor */}
              <h3
                className="relative font-display font-extrabold uppercase text-white tracking-tight leading-none shrink-0 group-hover:text-amber/90 transition-colors duration-300"
                style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)', minWidth: '11rem' }}
              >
                {item.name}
              </h3>

              {/* Duration badge */}
              <div
                className="relative inline-flex items-center self-start sm:self-auto px-2.5 py-1 shrink-0 transition-colors duration-300"
                style={{
                  border: '1px solid rgba(212,151,58,0.22)',
                  background: 'rgba(212,151,58,0.06)',
                }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-amber/70">
                  {item.duration}
                </span>
              </div>

              {/* Thin separator line — desktop only */}
              <div className="relative hidden sm:block h-px flex-shrink-0 w-8 bg-amber/10" />

              {/* Description */}
              <p className="relative text-stone text-sm leading-relaxed flex-1 max-w-lg">
                {item.desc}
              </p>

              {/* Arrow — appears on hover */}
              <ArrowRight
                size={14}
                className="relative hidden sm:block shrink-0 text-amber/0 group-hover:text-amber/50 transition-all duration-300 group-hover:translate-x-1"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
