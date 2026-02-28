'use client'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const statsData = [
  { value: 20, suffix: '+', key: 'years' },
  { value: 100, suffix: '+', key: 'projects' },
  { value: 10, suffix: '+', key: 'countries' },
  { value: 20, suffix: '+', key: 'collaborators' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = Math.max(1, Math.ceil(value / 40))
    const timer = setInterval(() => {
      current += step
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="font-display font-extrabold tabular-nums leading-none amber-text-gradient"
      style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}
    >
      {count}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const t = useTranslations('stats')

  return (
    <section className="py-0 bg-parchment relative overflow-hidden">
      {/* Top amber rule */}
      <div className="amber-rule w-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Grid: 4 columns separated by 1px amber gutters */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: '1px', background: 'rgba(212,151,58,0.12)' }}
        >
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-parchment px-8 py-12 flex flex-col items-start gap-3"
            >
              <Counter value={s.value} suffix={s.suffix} />
              <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-stone/60">
                {t(s.key)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom amber rule */}
      <div className="amber-rule w-full" />
    </section>
  )
}
