'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Zap, BookOpen, GraduationCap, Puzzle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const icons = [Zap, BookOpen, GraduationCap, Puzzle]
const borderClasses = [
  'hover:border-yellow-400/60',
  'hover:border-brand-primary/60',
  'hover:border-cyan/60',
  'hover:border-purple-400/60',
]

export default function TrainingLevels() {
  const t = useTranslations('levels')
  const items = t.raw('items') as { name: string; desc: string; duration: string }[]

  return (
    <section className="py-24 bg-midnight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
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
                className={`glass-card rounded-2xl p-6 border border-white/10 transition-all duration-300 ${borderClasses[i]}`}
              >
                <Icon className="w-8 h-8 text-white/50 mb-4" />
                <Badge
                  variant="outline"
                  className="text-white/50 border-white/15 text-xs mb-3"
                >
                  {item.duration}
                </Badge>
                <h3 className="text-xl font-display font-bold text-white mb-2">{item.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
