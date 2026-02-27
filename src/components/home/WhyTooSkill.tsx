'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lightbulb, Users, Settings2, TrendingUp } from 'lucide-react'

const icons = [Lightbulb, Users, Settings2, TrendingUp]

export default function WhyTooSkill() {
  const t = useTranslations('why')
  const items = t.raw('items') as { title: string; desc: string }[]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep">
            {t('title')}
          </h2>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-border hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-display font-bold text-deep text-lg mb-2">{item.title}</h3>
                <p className="text-muted-text text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
