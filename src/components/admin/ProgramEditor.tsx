'use client'
import { Plus, Trash2 } from 'lucide-react'
import type { ProgramSection } from '@/types/database'

interface Props {
  value: ProgramSection[]
  onChange: (value: ProgramSection[]) => void
  lang: 'IT' | 'EN'
}

export default function ProgramEditor({ value, onChange, lang }: Props) {
  const it = lang === 'IT'
  const sectionPlaceholder = it ? 'Titolo sezione...' : 'Section title...'
  const itemPlaceholder = it ? 'Argomento...' : 'Topic...'
  const addSectionLabel = it ? '+ Aggiungi sezione' : '+ Add section'
  const addItemLabel = it ? '+ Aggiungi argomento' : '+ Add item'

  function addSection() {
    onChange([...value, { title: '', items: [''] }])
  }

  function removeSection(si: number) {
    onChange(value.filter((_, i) => i !== si))
  }

  function updateTitle(si: number, title: string) {
    const next = [...value]
    next[si] = { ...next[si], title }
    onChange(next)
  }

  function addItem(si: number) {
    const next = [...value]
    next[si] = { ...next[si], items: [...next[si].items, ''] }
    onChange(next)
  }

  function removeItem(si: number, ii: number) {
    const next = [...value]
    next[si] = { ...next[si], items: next[si].items.filter((_, i) => i !== ii) }
    onChange(next)
  }

  function updateItem(si: number, ii: number, text: string) {
    const next = [...value]
    const items = [...next[si].items]
    items[ii] = text
    next[si] = { ...next[si], items }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {value.map((section, si) => (
        <div key={si} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Section header */}
          <div className="flex items-center gap-2 bg-gray-50 border-b border-gray-100 px-3 py-2">
            <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{si + 1}</span>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateTitle(si, e.target.value)}
              placeholder={sectionPlaceholder}
              className="flex-1 text-sm font-medium bg-transparent border-0 focus:outline-none placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => removeSection(si)}
              className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Items */}
          <div className="px-3 py-2.5 space-y-1.5">
            {section.items.map((item, ii) => (
              <div key={ii} className="flex items-center gap-2">
                <span className="text-gray-300 text-xs shrink-0">›</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(si, ii, e.target.value)}
                  placeholder={itemPlaceholder}
                  className="flex-1 text-sm border-0 border-b border-gray-100 focus:border-blue-300 focus:outline-none py-0.5 bg-transparent placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeItem(si, ii)}
                  disabled={section.items.length === 1}
                  className="text-gray-200 hover:text-red-400 disabled:opacity-30 transition-colors shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem(si)}
              className="text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-1 transition-colors"
            >
              <Plus size={10} /> {addItemLabel}
            </button>
          </div>
        </div>
      ))}

      {/* Add section */}
      <button
        type="button"
        onClick={addSection}
        className="w-full border-2 border-dashed border-gray-200 rounded-lg py-2.5 text-sm text-gray-400 hover:text-gray-500 hover:border-gray-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus size={14} /> {addSectionLabel}
      </button>
    </div>
  )
}
