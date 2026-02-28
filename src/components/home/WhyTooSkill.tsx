'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lightbulb, Users, Settings2, TrendingUp } from 'lucide-react'

const icons  = [Lightbulb, Users, Settings2, TrendingUp]
const nums   = ['01', '02', '03', '04']

export default function WhyTooSkill() {
  const t = useTranslations('why')
  const items = t.raw('items') as { title: string; desc: string }[]

  return (
    <section className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16 mb-20">
          <div className="lg:w-20 shrink-0">
            <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-stone/40">— 01</span>
          </div>
          <div>
            <h2
              className="font-display font-extrabold uppercase text-smoke leading-[0.88] tracking-tight mb-5"
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

        {/* Cards — seamless grid with 1-px amber lines as gutters */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: '1px', background: 'rgba(212,151,58,0.12)' }}
        >
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                className="group relative bg-cream p-10 overflow-hidden hover:bg-parchment/70 transition-colors duration-300"
              >
                {/* Ghost number behind card */}
                <span className="absolute top-5 right-7 font-display font-extrabold text-[5.5rem] leading-none text-smoke/[0.038] select-none pointer-events-none">
                  {nums[i]}
                </span>

                {/* Top: number label + icon */}
                <div className="flex items-start justify-between mb-8">
                  <span className="font-mono text-[0.62rem] tracking-[0.2em] text-amber/55">
                    {nums[i]}
                  </span>
                  <div
                    className="w-9 h-9 flex items-center justify-center"
                    style={{ border: '1px solid rgba(212,151,58,0.35)' }}
                  >
                    <Icon size={16} className="text-amber" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="font-display font-bold text-smoke text-xl uppercase tracking-wide mb-3">
                  {item.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{item.desc}</p>

                {/* Bottom reveal bar */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: 'linear-gradient(90deg, #D4973A, #F5C97A)' }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
