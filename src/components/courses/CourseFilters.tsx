'use client'
import { useTranslations } from 'next-intl'

interface Props {
  selectedModule: string
  selectedLevel: string
  onModuleChange: (v: string) => void
  onLevelChange: (v: string) => void
}

const modules = ['FI', 'CO', 'SCM', 'ABAP', 'FIORI', 'S4HANA', 'HANA', 'OTHER']
const levels = ['express', 'base', 'completa', 'personalizzata']

export default function CourseFilters({
  selectedModule,
  selectedLevel,
  onModuleChange,
  onLevelChange,
}: Props) {
  const t = useTranslations('courses')
  const tl = useTranslations('levels_map')

  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
      active
        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
        : 'bg-white text-muted-text border-border hover:border-brand-primary/40 hover:text-brand-primary'
    }`

  return (
    <div className="flex flex-col gap-3 mb-10">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-text font-semibold uppercase tracking-wider mr-1">
          {t('filter_module')}
        </span>
        <button className={pill(selectedModule === '')} onClick={() => onModuleChange('')}>
          {t('all')}
        </button>
        {modules.map((m) => (
          <button
            key={m}
            className={pill(selectedModule === m)}
            onClick={() => onModuleChange(m)}
          >
            SAP {m}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-text font-semibold uppercase tracking-wider mr-1">
          {t('filter_level')}
        </span>
        <button className={pill(selectedLevel === '')} onClick={() => onLevelChange('')}>
          {t('all')}
        </button>
        {levels.map((l) => (
          <button key={l} className={pill(selectedLevel === l)} onClick={() => onLevelChange(l)}>
            {tl(l)}
          </button>
        ))}
      </div>
    </div>
  )
}
