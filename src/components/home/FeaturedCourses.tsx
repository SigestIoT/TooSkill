import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import CourseCard from '@/components/courses/CourseCard'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export default async function FeaturedCourses() {
  const t = await getTranslations('featured')
  const locale = await getLocale()

  // Only fetch if Supabase is configured
  let courses = null
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)
    courses = data
  }

  if (!courses?.length) return null

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-deep">
              {t('title')}
            </h2>
            <p className="mt-2 text-muted-text">{t('subtitle')}</p>
          </div>
          <Button asChild variant="outline" className="shrink-0 group">
            <Link href="/corsi">
              {t('cta')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              locale={locale}
              requestLabel={t('request')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
