'use client'

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
        className="absolute top-0 left-0 right-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, #D4973A, #F5C97A)' }}
      />

      {/* ── Image banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '180px', background: '#1E1B14', flexShrink: 0 }}>
        {course.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.image_url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle bottom fade to card background */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(250,246,238,0.7))' }}
            />
          </>
        ) : (
          /* Fallback: editorial gradient placeholder */
          <div className="absolute inset-0 flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #09080A 0%, #1E1B14 60%, #2a2316 100%)',
          }}>
            <div className="text-center select-none">
              <div
                className="font-mono font-bold tracking-[0.22em] uppercase"
                style={{ fontSize: '0.6rem', color: 'rgba(212,151,58,0.35)', marginBottom: '0.3rem' }}
              >
                SAP
              </div>
              <div
                className="font-display font-extrabold"
                style={{ fontSize: '2.2rem', color: 'rgba(212,151,58,0.18)', lineHeight: 1 }}
              >
                {course.module}
              </div>
            </div>
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 70%, rgba(212,151,58,0.06) 0%, transparent 70%)' }}
            />
          </div>
        )}

        {/* Module tag overlaid on image */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="font-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-1"
            style={{
              color: '#D4973A',
              background: 'rgba(9,8,10,0.72)',
              border: '1px solid rgba(212,151,58,0.30)',
              backdropFilter: 'blur(4px)',
            }}
          >
            SAP {course.module}
          </span>
        </div>

        {/* Level tag overlaid — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="font-mono text-[0.55rem] tracking-[0.14em] uppercase px-2 py-1"
            style={{
              color: 'rgba(240,233,216,0.6)',
              background: 'rgba(9,8,10,0.65)',
              border: '1px solid rgba(240,233,216,0.12)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Subtle amber tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'rgba(212,151,58,0.025)' }}
      />

      <div className="relative flex flex-col flex-1 p-6">
        {/* Title */}
        <h3
          className="font-display font-extrabold leading-tight mb-3 line-clamp-2 transition-colors duration-250"
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
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
