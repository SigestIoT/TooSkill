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
      <section className="py-20 mesh-bg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, #4F6EF7 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseGrid courses={courses} locale={locale} />
        </div>
      </section>
    </>
  )
}
