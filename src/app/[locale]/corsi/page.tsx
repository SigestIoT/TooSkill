import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import CourseGrid from '@/components/courses/CourseGrid'
import type { Course } from '@/types/database'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('courses')
  return { title: t('title'), description: t('subtitle') }
}

export default async function CorsiPage() {
  const locale = await getLocale()
  const t = await getTranslations('courses')

  let courses: Course[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    courses = (data as Course[]) ?? []
  }

  return (
    <>
      {/* Hero — dark */}
      <section className="relative overflow-hidden" style={{ background: '#09080A' }}>
        {/* Ambient amber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 15% 50%, rgba(212,151,58,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Amber rule top */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.4), transparent)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
          <p
            className="font-mono text-[0.6rem] tracking-[0.28em] uppercase mb-6"
            style={{ color: 'rgba(212,151,58,0.55)' }}
          >
            — Corsi SAP
          </p>

          <h1
            className="font-display font-extrabold text-white leading-[0.92] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
          >
            {t('title')}
          </h1>

          <div
            className="mb-6"
            style={{
              width: '4rem',
              height: '1px',
              background: 'linear-gradient(90deg, #D4973A, transparent)',
            }}
          />

          <p
            className="text-stone leading-relaxed max-w-xl"
            style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Amber rule bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.20), transparent)',
          }}
        />
      </section>

      {/* Grid — light parchment */}
      <section style={{ background: '#F0E9D8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <CourseGrid courses={courses} locale={locale} />
        </div>
      </section>
    </>
  )
}
