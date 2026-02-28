import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContactForm from '@/components/courses/ContactForm'
import { Clock, BookOpen, Users, CheckCircle2 } from 'lucide-react'
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
    <div className="min-h-screen" style={{ background: '#131210' }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: '#09080A' }}>
        {/* Ambient amber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(212,151,58,0.07) 0%, transparent 70%)',
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-28">
          {/* Module + Level tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className="font-mono text-[0.58rem] tracking-[0.18em] uppercase px-2.5 py-1"
              style={{
                color: '#D4973A',
                border: '1px solid rgba(212,151,58,0.30)',
                background: 'rgba(212,151,58,0.07)',
              }}
            >
              {tModules(c.module)}
            </span>
            <span
              className="font-mono text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1"
              style={{
                color: 'rgba(156,148,136,0.7)',
                border: '1px solid rgba(156,148,136,0.20)',
              }}
            >
              {tLevels(c.level)}
            </span>
          </div>

          <h1
            className="font-display font-extrabold text-white leading-[0.94] tracking-[-0.02em] mb-5"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)' }}
          >
            {title}
          </h1>

          {/* Amber rule */}
          <div
            className="mb-5"
            style={{
              width: '3.5rem',
              height: '1px',
              background: 'linear-gradient(90deg, #D4973A, transparent)',
            }}
          />

          <p
            className="text-stone leading-relaxed max-w-2xl"
            style={{ fontSize: 'clamp(0.85rem, 1.3vw, 0.97rem)' }}
          >
            {description}
          </p>

          {c.duration_hours && (
            <div className="flex items-center gap-2 mt-6">
              <Clock size={12} style={{ color: 'rgba(212,151,58,0.45)' }} />
              <span
                className="font-mono text-[0.6rem] tracking-[0.18em] uppercase"
                style={{ color: 'rgba(212,151,58,0.45)' }}
              >
                {c.duration_hours}h — {t('duration')}
              </span>
            </div>
          )}
        </div>

        {/* Amber rule bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,151,58,0.15), transparent)',
          }}
        />
      </section>

      {/* Body */}
      <section style={{ background: '#F0E9D8' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
            {/* Main content */}
            <div className="space-y-12">
              {/* Objectives */}
              {objectives.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <CheckCircle2 size={14} style={{ color: '#D4973A' }} />
                    <h2
                      className="font-display font-extrabold uppercase tracking-wider"
                      style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)', color: '#09080A' }}
                    >
                      {t('objectives')}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex gap-4 text-sm leading-relaxed" style={{ color: '#4a4540' }}>
                        <span
                          className="rounded-full flex-shrink-0"
                          style={{ background: '#D4973A', width: '4px', height: '4px', minWidth: '4px', marginTop: '0.45rem' }}
                        />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Divider */}
              {objectives.length > 0 && program.length > 0 && (
                <div style={{ height: '1px', background: 'rgba(212,151,58,0.20)' }} />
              )}

              {/* Program */}
              {program.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen size={14} style={{ color: '#D4973A' }} />
                    <h2
                      className="font-display font-extrabold uppercase tracking-wider"
                      style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)', color: '#09080A' }}
                    >
                      {t('program')}
                    </h2>
                  </div>
                  <div className="space-y-8">
                    {program.map((section: ProgramSection, i: number) => (
                      <div key={i}>
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="font-mono text-[0.56rem] tracking-[0.2em] uppercase"
                            style={{ color: 'rgba(212,151,58,0.60)' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h3
                            className="font-display font-bold text-sm"
                            style={{ color: '#09080A' }}
                          >
                            {section.title}
                          </h3>
                        </div>
                        <ul className="space-y-2 pl-8">
                          {section.items.map((item: string, j: number) => (
                            <li key={j} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#4a4540' }}>
                              <span
                                className="rounded-full flex-shrink-0"
                                style={{
                                  background: 'rgba(212,151,58,0.45)',
                                  width: '4px',
                                  height: '4px',
                                  minWidth: '4px',
                                  marginTop: '0.45rem',
                                }}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {prerequisites && program.length > 0 && (
                <div style={{ height: '1px', background: 'rgba(212,151,58,0.20)' }} />
              )}

              {/* Prerequisites */}
              {prerequisites && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Users size={14} style={{ color: '#D4973A' }} />
                    <h2
                      className="font-display font-extrabold uppercase tracking-wider"
                      style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)', color: '#09080A' }}
                    >
                      {t('prerequisites')}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a4540' }}>{prerequisites}</p>
                </div>
              )}
            </div>

            {/* Sticky sidebar — stays dark for CTA contrast */}
            <div>
              <div
                className="sticky top-24 p-7"
                style={{
                  background: '#1E1B14',
                  border: '1px solid rgba(212,151,58,0.18)',
                }}
              >
                {/* Amber accent top */}
                <div
                  style={{
                    height: '2px',
                    background: 'linear-gradient(90deg, #D4973A, #F5C97A)',
                    marginTop: '-1.75rem',
                    marginLeft: '-1.75rem',
                    marginRight: '-1.75rem',
                    marginBottom: '1.5rem',
                  }}
                />

                <h2
                  className="font-display font-extrabold text-white mb-1 uppercase tracking-wider"
                  style={{ fontSize: '0.82rem' }}
                >
                  {t('register')}
                </h2>
                {c.price_info && (
                  <p
                    className="font-mono text-[0.57rem] tracking-[0.14em] uppercase mb-5"
                    style={{ color: 'rgba(212,151,58,0.40)' }}
                  >
                    {c.price_info}
                  </p>
                )}
                <ContactForm courseId={c.id} courseTitle={title} singleColumn />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
