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
    <span ref={ref} className="text-4xl sm:text-5xl font-display font-extrabold gradient-text tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const t = useTranslations('stats')

  return (
    <section className="py-20 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Counter value={s.value} suffix={s.suffix} />
              <p className="text-muted-text text-sm mt-2">{t(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
