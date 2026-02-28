import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import type { Course, LocalizedString, LocalizedStringArray } from '@/types/database'

interface Props {
  course: Course
  locale: string
  requestLabel?: string
}

export default function CourseCard({ course, locale, requestLabel = 'Richiedi info' }: Props) {
  const loc = locale as 'it' | 'en'
  const title =
    (course.title as LocalizedString)[loc] ?? (course.title as LocalizedString).it
  const description =
    (course.description as LocalizedString)[loc] ?? (course.description as LocalizedString).it
  const objectives =
    (course.objectives as LocalizedStringArray)?.[loc] ??
    (course.objectives as LocalizedStringArray)?.it ??
    []
  const topObjectives = objectives.slice(0, 2)

  return (
    <div
      className="group relative flex flex-col h-full overflow-hidden"
      style={{
        background: '#FAF6EE',
        border: '1px solid rgba(212,151,58,0.18)',
        transition: 'border-color 0.25s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,151,58,0.45)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,151,58,0.18)'
      }}
    >
      {/* Amber top accent — reveals on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, #D4973A, #F5C97A)' }}
      />

      {/* Subtle amber tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'rgba(212,151,58,0.025)' }}
      />

      <div className="relative flex flex-col flex-1 p-6">
        {/* Module + Level tags */}
        <div className="flex items-start justify-between gap-2 mb-4">
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
              color: 'rgba(74,69,64,0.5)',
              border: '1px solid rgba(74,69,64,0.15)',
            }}
          >
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-extrabold leading-tight mb-3 line-clamp-2 transition-colors duration-250"
          style={{
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            color: '#09080A',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLHeadingElement).style.color = '#D4973A'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLHeadingElement).style.color = '#09080A'
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: '#4a4540' }}
        >
          {description}
        </p>

        {/* Objectives preview */}
        {topObjectives.length > 0 && (
          <div className="mt-4 mb-1">
            <div
              style={{ height: '1px', background: 'rgba(212,151,58,0.14)', marginBottom: '0.85rem' }}
            />
            <ul className="space-y-2">
              {topObjectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-xs leading-relaxed"
                  style={{ color: 'rgba(74,69,64,0.65)' }}
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

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-6 pt-4"
          style={{ borderTop: '1px solid rgba(212,151,58,0.14)' }}
        >
          {course.duration_hours ? (
            <span
              className="flex items-center gap-1.5 font-mono text-[0.58rem] tracking-[0.14em] uppercase"
              style={{ color: 'rgba(212,151,58,0.60)' }}
            >
              <Clock size={11} />
              {course.duration_hours}h
            </span>
          ) : (
            <span />
          )}

          <Link
            href={`/corsi/${course.slug}`}
            className="inline-flex items-center gap-1.5 font-display font-bold text-[0.7rem] uppercase tracking-[0.1em] transition-colors duration-200 group/link"
            style={{ color: '#09080A' }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#D4973A'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#09080A'
            }}
          >
            {requestLabel}
            <ArrowRight
              size={12}
              className="group-hover/link:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
