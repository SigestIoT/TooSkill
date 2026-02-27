'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/types/database'
import CourseCard from './CourseCard'
import CourseFilters from './CourseFilters'

interface Props {
  courses: Course[]
  locale: string
}

export default function CourseGrid({ courses, locale }: Props) {
  const t = useTranslations('courses')
  const [moduleFilter, setModuleFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const filtered = courses.filter(
    (c) =>
      (!moduleFilter || c.module === moduleFilter) &&
      (!levelFilter || c.level === levelFilter)
  )

  return (
    <>
      <CourseFilters
        selectedModule={moduleFilter}
        selectedLevel={levelFilter}
        onModuleChange={setModuleFilter}
        onLevelChange={setLevelFilter}
      />

      {filtered.length === 0 ? (
        <p className="text-muted-text text-center py-20">{t('no_results')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <CourseCard
                  course={course}
                  locale={locale}
                  requestLabel={t('request_info')}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
