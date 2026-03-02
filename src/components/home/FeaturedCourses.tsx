import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Clock } from 'lucide-react'
import type { Course, LocalizedString, LocalizedStringArray } from '@/types/database'

export default async function FeaturedCourses() {
  const t = await getTranslations('featured')
  const locale = await getLocale()

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
    courses = data as Course[] | null
  }

  if (!courses?.length) return null

  const loc = locale as 'it' | 'en'

  return (
    <section className="relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Strong amber rule top — visually anchors the section break */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: '3px', background: 'linear-gradient(90deg, transparent 0%, #D4973A 25%, #F5C97A 65%, transparent 100%)' }}
      />

      {/* Ambient amber glow — top right corner */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '480px',
          height: '380px',
          background: 'radial-gradient(ellipse at top right, rgba(212,151,58,0.07) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: '2.5rem', height: '1px', background: '#D4973A' }} />
              <p
                className="font-mono text-[0.58rem] tracking-[0.3em] uppercase"
                style={{ color: '#D4973A' }}
              >
                Corsi in evidenza
              </p>
            </div>
            <h2
              className="font-display font-extrabold leading-tight tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', color: '#09080A' }}
            >
              {t('title')}
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: '#6b6560', maxWidth: '40ch' }}
            >
              {t('subtitle')}
            </p>
          </div>

          <Link
            href="/corsi"
            className="inline-flex items-center gap-2 font-display font-bold text-[0.72rem] uppercase tracking-[0.1em] shrink-0 group transition-colors duration-200 text-[#09080A] hover:text-[#D4973A]"
          >
            {t('cta')}
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Cards — editorial cream panels with amber left accent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const title =
              (course.title as LocalizedString)[loc] ?? (course.title as LocalizedString).it
            const description =
              (course.description as LocalizedString)[loc] ??
              (course.description as LocalizedString).it
            const objectives =
              (course.objectives as LocalizedStringArray)?.[loc] ??
              (course.objectives as LocalizedStringArray)?.it ??
              []
            const topObjectives = objectives.slice(0, 2)

            return (
              <div
                key={course.id}
                className="group relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                style={{
                  background: '#FAF6EE',
                  borderTop: '1px solid rgba(212,151,58,0.18)',
                  borderRight: '1px solid rgba(212,151,58,0.18)',
                  borderBottom: '1px solid rgba(212,151,58,0.18)',
                  borderLeft: '3px solid rgba(212,151,58,0.65)',
                }}
              >
                {/* Amber left border brightens on hover */}
                <div
                  className="absolute left-[-3px] top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    width: '3px',
                    background: 'linear-gradient(180deg, #D4973A 0%, #F5C97A 50%, #D4973A 100%)',
                  }}
                />

                {/* ── Image banner ── */}
                <div className="relative w-full overflow-hidden" style={{ height: '160px', background: '#1E1B14', flexShrink: 0 }}>
                  {course.image_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.image_url}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, transparent, rgba(250,246,238,0.65))' }}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #09080A 0%, #1E1B14 60%, #2a2316 100%)',
                    }}>
                      <div className="text-center select-none">
                        <div className="font-mono font-bold tracking-[0.22em] uppercase" style={{ fontSize: '0.55rem', color: 'rgba(212,151,58,0.30)', marginBottom: '0.25rem' }}>SAP</div>
                        <div className="font-display font-extrabold" style={{ fontSize: '2rem', color: 'rgba(212,151,58,0.15)', lineHeight: 1 }}>{course.module}</div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 70%, rgba(212,151,58,0.05) 0%, transparent 70%)' }} />
                    </div>
                  )}
                </div>

                <div className="relative flex flex-col flex-1 p-6 pl-7">
                  {/* Module + Level */}
                  <div className="flex items-start justify-between gap-2 mb-5">
                    <span
                      className="font-mono text-[0.58rem] tracking-[0.18em] uppercase px-2 py-1"
                      style={{
                        color: '#D4973A',
                        border: '1px solid rgba(212,151,58,0.32)',
                        background: 'rgba(212,151,58,0.07)',
                      }}
                    >
                      SAP {course.module}
                    </span>
                    <span
                      className="font-mono text-[0.58rem] tracking-[0.14em] uppercase px-2 py-1"
                      style={{
                        color: 'rgba(74,69,64,0.50)',
                        border: '1px solid rgba(74,69,64,0.15)',
                      }}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display font-extrabold leading-tight mb-3 transition-colors duration-200 group-hover:text-[#D4973A]"
                    style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', color: '#09080A' }}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed line-clamp-2 mb-4"
                    style={{ color: '#4a4540' }}
                  >
                    {description}
                  </p>

                  {/* Objectives preview */}
                  {topObjectives.length > 0 && (
                    <div className="mb-5">
                      <div
                        style={{
                          height: '1px',
                          background: 'rgba(212,151,58,0.16)',
                          marginBottom: '0.85rem',
                        }}
                      />
                      <ul className="space-y-2">
                        {topObjectives.map((obj, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 text-xs leading-relaxed"
                            style={{ color: 'rgba(74,69,64,0.70)' }}
                          >
                            <span
                              className="shrink-0 rounded-full"
                              style={{
                                width: '4px',
                                height: '4px',
                                minWidth: '4px',
                                marginTop: '0.35rem',
                                background: 'rgba(212,151,58,0.55)',
                              }}
                            />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex-1" />

                  {/* Duration */}
                  {course.duration_hours && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Clock size={11} style={{ color: 'rgba(212,151,58,0.55)' }} />
                      <span
                        className="font-mono text-[0.57rem] tracking-[0.14em] uppercase"
                        style={{ color: 'rgba(212,151,58,0.55)' }}
                      >
                        {course.duration_hours}h
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/corsi/${course.slug}`}
                    className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 font-display font-bold text-[0.72rem] uppercase tracking-[0.12em] transition-opacity duration-200 hover:opacity-90 group/cta"
                    style={{
                      background: 'linear-gradient(115deg, #D4973A 0%, #F5C97A 100%)',
                      color: '#09080A',
                    }}
                  >
                    {t('request')}
                    <ArrowRight
                      size={13}
                      className="group-hover/cta:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom amber rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,151,58,0.25), transparent)',
        }}
      />
    </section>
  )
}
