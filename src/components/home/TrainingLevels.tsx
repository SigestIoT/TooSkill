'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const accentColors = [
  'rgba(212,151,58,0.55)',   // amber
  'rgba(212,151,58,0.40)',
  'rgba(212,151,58,0.65)',
  'rgba(212,151,58,0.30)',
]

const levelNums = ['01', '02', '03', '04']

export default function TrainingLevels() {
  const t = useTranslations('levels')
  const items = t.raw('items') as { name: string; desc: string; duration: string }[]

  return (
    <section className="py-28 bg-void relative overflow-hidden">
      {/* Decorative vertical amber rules */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-[25%] w-px opacity-[0.04]"
          style={{ background: 'linear-gradient(180deg, transparent, #D4973A 30%, #D4973A 70%, transparent)' }}
        />
        <div className="absolute top-0 bottom-0 left-[50%] w-px opacity-[0.04]"
          style={{ background: 'linear-gradient(180deg, transparent, #D4973A 30%, #D4973A 70%, transparent)' }}
        />
        <div className="absolute top-0 bottom-0 left-[75%] w-px opacity-[0.04]"
          style={{ background: 'linear-gradient(180deg, transparent, #D4973A 30%, #D4973A 70%, transparent)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16 mb-20">
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

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '1px', background: 'rgba(212,151,58,0.07)' }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative bg-void p-8 overflow-hidden hover:bg-ember/50 transition-colors duration-300"
              style={{ borderTop: `2px solid ${accentColors[i]}` }}
            >
              {/* Ghost name behind card */}
              <span className="absolute -bottom-3 -right-2 font-display font-extrabold text-[4.5rem] leading-none text-white/[0.03] select-none pointer-events-none uppercase">
                {item.name}
              </span>

              {/* Level number */}
              <span className="font-mono text-[0.58rem] tracking-[0.22em] text-amber/45 block mb-6">
                {levelNums[i]}
              </span>

              {/* Duration badge */}
              <div
                className="inline-flex items-center px-2.5 py-1 mb-6"
                style={{ border: '1px solid rgba(212,151,58,0.22)', background: 'rgba(212,151,58,0.06)' }}
              >
                <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-amber/70">
                  {item.duration}
                </span>
              </div>

              {/* Name */}
              <h3
                className="font-display font-extrabold uppercase text-white tracking-tight leading-none mb-4"
                style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)' }}
              >
                {item.name}
              </h3>

              {/* Description */}
              <p className="text-stone text-sm leading-relaxed">{item.desc}</p>

              {/* Bottom reveal */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: 'linear-gradient(90deg, #D4973A, #F5C97A)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
