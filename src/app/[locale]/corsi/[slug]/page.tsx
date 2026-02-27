import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContactForm from '@/components/courses/ContactForm'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, BookOpen, Users } from 'lucide-react'
import type {
  Course,
  LocalizedString,
  LocalizedStringArray,
  LocalizedProgram,
  ProgramSection,
} from '@/types/database'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return {}
  const supabase = await createClient()
  const { data } = await supabase.from('courses').select('*').eq('slug', slug).single()
  if (!data) return {}
  const c = data as Course
  const title =
    (c.title as LocalizedString)[locale as 'it' | 'en'] ?? (c.title as LocalizedString).it
  const description =
    (c.description as LocalizedString)[locale as 'it' | 'en'] ??
    (c.description as LocalizedString).it
  return { title, description }
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('course_detail')
  const tModules = await getTranslations('modules')
  const tLevels = await getTranslations('levels_map')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound()

  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) notFound()

  const c = data as Course
  const loc = locale as 'it' | 'en'

  const title = (c.title as LocalizedString)[loc] ?? (c.title as LocalizedString).it
  const description =
    (c.description as LocalizedString)[loc] ?? (c.description as LocalizedString).it
  const objectives =
    (c.objectives as LocalizedStringArray)?.[loc] ??
    (c.objectives as LocalizedStringArray)?.it ??
    []
  const program =
    (c.program as LocalizedProgram)?.[loc] ??
    (c.program as LocalizedProgram)?.it ??
    []
  const prerequisites =
    (c.prerequisites as LocalizedString)?.[loc] ??
    (c.prerequisites as LocalizedString)?.it ??
    ''

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 mesh-bg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 50%, #4F6EF7 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-brand-primary/20 text-white border-brand-primary/30">
              {tModules(c.module)}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20">
              {tLevels(c.level)}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{description}</p>
          {c.duration_hours && (
            <div className="flex items-center gap-1.5 mt-5 text-white/50 text-sm">
              <Clock size={14} />
              <span>
                {c.duration_hours}h — {t('duration')}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Objectives */}
              {objectives.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-bold text-deep mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                    {t('objectives')}
                  </h2>
                  <ul className="space-y-2">
                    {objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-text leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Program */}
              {program.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-bold text-deep mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-primary" />
                    {t('program')}
                  </h2>
                  <div className="space-y-6">
                    {program.map((section: ProgramSection, i: number) => (
                      <div key={i}>
                        <h3 className="font-semibold text-deep text-sm mb-2">{section.title}</h3>
                        <ul className="space-y-1.5">
                          {section.items.map((item: string, j: number) => (
                            <li key={j} className="flex gap-3 text-sm text-muted-text">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {prerequisites && (
                <div>
                  <h2 className="text-xl font-display font-bold text-deep mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-primary" />
                    {t('prerequisites')}
                  </h2>
                  <p className="text-sm text-muted-text leading-relaxed">{prerequisites}</p>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-display font-bold text-deep text-lg mb-1">
                  {t('register')}
                </h2>
                {c.price_info && (
                  <p className="text-muted-text text-xs mb-4">{c.price_info}</p>
                )}
                <ContactForm courseId={c.id} courseTitle={title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
