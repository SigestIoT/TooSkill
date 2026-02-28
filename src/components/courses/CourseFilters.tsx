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

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-[0.6rem] tracking-[0.14em] uppercase px-3 py-1.5 transition-all duration-200 cursor-pointer"
      style={{
        border: active ? '1px solid rgba(212,151,58,0.55)' : '1px solid rgba(74,69,64,0.22)',
        background: active ? 'rgba(212,151,58,0.10)' : 'rgba(255,255,255,0.5)',
        color: active ? '#D4973A' : 'rgba(74,69,64,0.55)',
      }}
    >
      {children}
    </button>
  )
}

export default function CourseFilters({
  selectedModule,
  selectedLevel,
  onModuleChange,
  onLevelChange,
}: Props) {
  const t = useTranslations('courses')
  const tl = useTranslations('levels_map')

  return (
    <div className="mb-12" style={{ borderBottom: '1px solid rgba(74,69,64,0.14)' }}>
      {/* Module row */}
      <div
        className="flex flex-wrap items-center gap-4 py-4"
        style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}
      >
        <span className="font-mono text-[0.56rem] tracking-[0.22em] uppercase text-amber/35 shrink-0 w-16">
          {t('filter_module')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <FilterBtn active={selectedModule === ''} onClick={() => onModuleChange('')}>
            {t('all')}
          </FilterBtn>
          {modules.map((m) => (
            <FilterBtn key={m} active={selectedModule === m} onClick={() => onModuleChange(m)}>
              SAP {m}
            </FilterBtn>
          ))}
        </div>
      </div>

      {/* Level row */}
      <div
        className="flex flex-wrap items-center gap-4 py-4"
        style={{ borderTop: '1px solid rgba(212,151,58,0.10)' }}
      >
        <span className="font-mono text-[0.56rem] tracking-[0.22em] uppercase text-amber/35 shrink-0 w-16">
          {t('filter_level')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <FilterBtn active={selectedLevel === ''} onClick={() => onLevelChange('')}>
            {t('all')}
          </FilterBtn>
          {levels.map((l) => (
            <FilterBtn key={l} active={selectedLevel === l} onClick={() => onLevelChange(l)}>
              {tl(l)}
            </FilterBtn>
          ))}
        </div>
      </div>
    </div>
  )
}
