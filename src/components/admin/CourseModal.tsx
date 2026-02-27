'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Upload, X, Plus, Trash2, Link as LinkIcon } from 'lucide-react'
import ProgramEditor from './ProgramEditor'
import type { Course, CourseModule, CourseLevel, ProgramSection } from '@/types/database'

const MODULES: CourseModule[] = ['FI', 'CO', 'SCM', 'ABAP', 'FIORI', 'S4HANA', 'HANA', 'OTHER']
const LEVELS: CourseLevel[] = ['express', 'base', 'completa', 'personalizzata']

type Tab = 'generale' | 'it' | 'en'

interface FormState {
  slug: string
  title_it: string
  title_en: string
  description_it: string
  description_en: string
  objectives_it: string[]
  objectives_en: string[]
  prerequisites_it: string
  prerequisites_en: string
  program_it: ProgramSection[]
  program_en: ProgramSection[]
  module: CourseModule
  level: CourseLevel
  duration_hours: string
  price_info: string
  image_url: string
  is_published: boolean
  is_featured: boolean
}

const emptyForm: FormState = {
  slug: '',
  title_it: '',
  title_en: '',
  description_it: '',
  description_en: '',
  objectives_it: [''],
  objectives_en: [''],
  prerequisites_it: '',
  prerequisites_en: '',
  program_it: [{ title: '', items: [''] }],
  program_en: [{ title: '', items: [''] }],
  module: 'FI',
  level: 'base',
  duration_hours: '',
  price_info: '',
  image_url: '',
  is_published: false,
  is_featured: false,
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  course?: Course | null
}

export default function CourseModal({ open, onClose, onSaved, course }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [tab, setTab] = useState<Tab>('generale')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (course) {
      setForm({
        slug: course.slug,
        title_it: course.title?.it ?? '',
        title_en: course.title?.en ?? '',
        description_it: course.description?.it ?? '',
        description_en: course.description?.en ?? '',
        objectives_it: course.objectives?.it?.length ? course.objectives.it : [''],
        objectives_en: course.objectives?.en?.length ? course.objectives.en : [''],
        prerequisites_it: course.prerequisites?.it ?? '',
        prerequisites_en: course.prerequisites?.en ?? '',
        program_it: course.program?.it?.length ? course.program.it : [{ title: '', items: [''] }],
        program_en: course.program?.en?.length ? course.program.en : [{ title: '', items: [''] }],
        module: course.module,
        level: course.level,
        duration_hours: course.duration_hours?.toString() ?? '',
        price_info: course.price_info ?? '',
        image_url: course.image_url ?? '',
        is_published: course.is_published,
        is_featured: course.is_featured,
      })
    } else {
      setForm(emptyForm)
    }
    setTab('generale')
    setError('')
    setImageMode('url')
  }, [course, open])

  function set(key: keyof FormState, value: unknown) {
    setForm((f) => ({ ...f, [key]: value } as FormState))
  }

  // ─── Objectives helpers ────────────────────────────────────────────────────
  function updateObjIT(i: number, val: string) {
    const next = [...form.objectives_it]; next[i] = val; set('objectives_it', next)
  }
  function addObjIT() { set('objectives_it', [...form.objectives_it, '']) }
  function removeObjIT(i: number) { set('objectives_it', form.objectives_it.filter((_, idx) => idx !== i)) }

  function updateObjEN(i: number, val: string) {
    const next = [...form.objectives_en]; next[i] = val; set('objectives_en', next)
  }
  function addObjEN() { set('objectives_en', [...form.objectives_en, '']) }
  function removeObjEN(i: number) { set('objectives_en', form.objectives_en.filter((_, idx) => idx !== i)) }

  // ─── Image upload ──────────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Errore upload'); return }
      set('image_url', data.url)
    } catch {
      setError('Errore durante il caricamento immagine')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ─── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      slug: form.slug,
      title: { it: form.title_it, en: form.title_en },
      description: { it: form.description_it, en: form.description_en },
      objectives: {
        it: form.objectives_it.filter(Boolean),
        en: form.objectives_en.filter(Boolean),
      },
      prerequisites: { it: form.prerequisites_it, en: form.prerequisites_en },
      program: {
        it: form.program_it.filter((s) => s.title || s.items.some(Boolean)),
        en: form.program_en.filter((s) => s.title || s.items.some(Boolean)),
      },
      module: form.module,
      level: form.level,
      duration_hours: form.duration_hours ? parseInt(form.duration_hours) : null,
      price_info: form.price_info || null,
      image_url: form.image_url || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
    }
    try {
      const url = course ? `/api/admin/courses/${course.id}` : '/api/admin/courses'
      const method = course ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Errore nel salvataggio')
        return
      }
      onSaved()
      onClose()
    } catch {
      setError('Errore di connessione')
    } finally {
      setSaving(false)
    }
  }

  // ─── Tab config ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string }[] = [
    { id: 'generale', label: '⚙️ Generale' },
    { id: 'it', label: '🇮🇹 Italiano' },
    { id: 'en', label: '🇬🇧 English' },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {course ? 'Modifica corso' : 'Nuovo corso'}
          </DialogTitle>
        </DialogHeader>

        {/* ── Tabs ── */}
        <div className="flex gap-0.5 border-b border-gray-100 -mx-6 px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t ${
                tab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-px bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="space-y-5 pt-3 min-h-[420px]">

          {/* ═══ GENERALE ═══ */}
          {tab === 'generale' && (
            <div className="space-y-5">
              {/* Slug / Modulo / Livello */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Slug *</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    placeholder="sap-fi-base"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Modulo *</Label>
                  <Select value={form.module} onValueChange={(v) => set('module', v as CourseModule)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Livello *</Label>
                  <Select value={form.level} onValueChange={(v) => set('level', v as CourseLevel)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration / Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Ore durata</Label>
                  <Input
                    type="number"
                    value={form.duration_hours}
                    onChange={(e) => set('duration_hours', e.target.value)}
                    className="h-8 text-sm"
                    placeholder="16"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Info prezzo</Label>
                  <Input
                    value={form.price_info}
                    onChange={(e) => set('price_info', e.target.value)}
                    placeholder="Su richiesta"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Immagine copertina</Label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors ${
                      imageMode === 'url'
                        ? 'bg-blue-50 border-blue-300 text-blue-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <LinkIcon size={11} /> URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors ${
                      imageMode === 'upload'
                        ? 'bg-blue-50 border-blue-300 text-blue-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Upload size={11} /> Carica file
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <Input
                    value={form.image_url}
                    onChange={(e) => set('image_url', e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-sm"
                  />
                ) : (
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="h-8 text-sm"
                    >
                      {uploading ? (
                        <><Loader2 className="animate-spin mr-1.5 w-3 h-3" /> Caricamento...</>
                      ) : (
                        <><Upload size={13} className="mr-1.5" /> Scegli immagine</>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · max 5 MB</p>
                  </div>
                )}

                {/* Preview */}
                {form.image_url && (
                  <div className="mt-2 flex items-start gap-2">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-28 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => set('image_url', '')}
                      className="text-gray-400 hover:text-red-400 transition-colors mt-0.5"
                      title="Rimuovi immagine"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => set('is_published', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 font-medium">Pubblicato</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => set('is_featured', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 font-medium">In evidenza</span>
                </label>
              </div>
            </div>
          )}

          {/* ═══ ITALIANO ═══ */}
          {tab === 'it' && (
            <div className="space-y-5">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Titolo *</Label>
                <Input
                  value={form.title_it}
                  onChange={(e) => set('title_it', e.target.value)}
                  className="text-sm"
                  placeholder="Corso SAP FI Base"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Descrizione *</Label>
                <Textarea
                  value={form.description_it}
                  onChange={(e) => set('description_it', e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                  placeholder="Breve descrizione del corso mostrata nelle card..."
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Obiettivi del corso</Label>
                <div className="space-y-1.5">
                  {form.objectives_it.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-gray-300 text-xs shrink-0">•</span>
                      <Input
                        value={obj}
                        onChange={(e) => updateObjIT(i, e.target.value)}
                        placeholder="Obiettivo del corso..."
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeObjIT(i)}
                        disabled={form.objectives_it.length === 1}
                        className="text-gray-300 hover:text-red-400 disabled:opacity-30 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addObjIT}
                    className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Plus size={12} /> Aggiungi obiettivo
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Prerequisiti</Label>
                <Textarea
                  value={form.prerequisites_it}
                  onChange={(e) => set('prerequisites_it', e.target.value)}
                  rows={2}
                  className="text-sm resize-none"
                  placeholder="Es. Conoscenza base di contabilità, esperienza con ERP..."
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Programma del corso</Label>
                <ProgramEditor
                  value={form.program_it}
                  onChange={(v) => set('program_it', v)}
                  lang="IT"
                />
              </div>
            </div>
          )}

          {/* ═══ ENGLISH ═══ */}
          {tab === 'en' && (
            <div className="space-y-5">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Title</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => set('title_en', e.target.value)}
                  className="text-sm"
                  placeholder="SAP FI Base Course"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                <Textarea
                  value={form.description_en}
                  onChange={(e) => set('description_en', e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                  placeholder="Short description shown on course cards..."
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Course objectives</Label>
                <div className="space-y-1.5">
                  {form.objectives_en.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-gray-300 text-xs shrink-0">•</span>
                      <Input
                        value={obj}
                        onChange={(e) => updateObjEN(i, e.target.value)}
                        placeholder="Course objective..."
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeObjEN(i)}
                        disabled={form.objectives_en.length === 1}
                        className="text-gray-300 hover:text-red-400 disabled:opacity-30 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addObjEN}
                    className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Plus size={12} /> Add objective
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Prerequisites</Label>
                <Textarea
                  value={form.prerequisites_en}
                  onChange={(e) => set('prerequisites_en', e.target.value)}
                  rows={2}
                  className="text-sm resize-none"
                  placeholder="E.g. Basic accounting knowledge, ERP experience..."
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Course program</Label>
                <ProgramEditor
                  value={form.program_en}
                  onChange={(v) => set('program_en', v)}
                  lang="EN"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 -mx-6 px-6 -mb-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Annulla
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {saving && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
            {course ? 'Salva modifiche' : 'Crea corso'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
