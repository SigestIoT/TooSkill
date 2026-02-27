import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'
import type { Course, LocalizedString } from '@/types/database'

interface Props {
  course: Course
  locale: string
  requestLabel?: string
}

const moduleColors: Record<string, string> = {
  FI: 'bg-blue-50 text-blue-700 border-blue-200',
  CO: 'bg-purple-50 text-purple-700 border-purple-200',
  SCM: 'bg-green-50 text-green-700 border-green-200',
  ABAP: 'bg-orange-50 text-orange-700 border-orange-200',
  FIORI: 'bg-pink-50 text-pink-700 border-pink-200',
  S4HANA: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  HANA: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function CourseCard({ course, locale, requestLabel = 'Richiedi info' }: Props) {
  const title = (course.title as LocalizedString)[locale as 'it' | 'en'] ?? (course.title as LocalizedString).it
  const description = (course.description as LocalizedString)[locale as 'it' | 'en'] ?? (course.description as LocalizedString).it

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-white hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-primary to-cyan" />

      <div className="flex flex-col flex-1 p-6">
        {/* Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            variant="outline"
            className={`text-xs border ${moduleColors[course.module] ?? moduleColors.OTHER}`}
          >
            SAP {course.module}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize text-muted-text border-border">
            {course.level}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-deep text-lg leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-text text-sm leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          {course.duration_hours ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-text">
              <Clock size={14} />
              {course.duration_hours}h
            </span>
          ) : (
            <span />
          )}
          <Button
            asChild
            size="sm"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white text-xs"
          >
            <Link href={`/corsi/${course.slug}`}>
              {requestLabel}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
