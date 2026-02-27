'use client'
import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import type { Course, CourseModule, CourseLevel } from '@/types/database'

const MODULES: CourseModule[] = ['FI', 'CO', 'SCM', 'ABAP', 'FIORI', 'S4HANA', 'HANA', 'OTHER']
const LEVELS: CourseLevel[] = ['express', 'base', 'completa', 'personalizzata']

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  course?: Course | null
}

const emptyForm = {
  slug: '',
  title_it: '',
  title_en: '',
  description_it: '',
  description_en: '',
  objectives_it: '',
  objectives_en: '',
  prerequisites_it: '',
  prerequisites_en: '',
  program_it: '',
  program_en: '',
  module: 'FI' as CourseModule,
  level: 'base' as CourseLevel,
  duration_hours: '',
  price_info: '',
  image_url: '',
  is_published: false,
  is_featured: false,
}

export default function CourseModal({ open, onClose, onSaved, course }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (course) {
      setForm({
        slug: course.slug,
        title_it: course.title?.it ?? '',
        title_en: course.title?.en ?? '',
        description_it: course.description?.it ?? '',
        description_en: course.description?.en ?? '',
        objectives_it: course.objectives?.it?.join('\n') ?? '',
        objectives_en: course.objectives?.en?.join('\n') ?? '',
        prerequisites_it: course.prerequisites?.it ?? '',
        prerequisites_en: course.prerequisites?.en ?? '',
        program_it: JSON.stringify(course.program?.it ?? [], null, 2),
        program_en: JSON.stringify(course.program?.en ?? [], null, 2),
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
    setError('')
  }, [course, open])

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function parseProgram(str: string) {
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = {
      slug: form.slug,
      title: { it: form.title_it, en: form.title_en },
      description: { it: form.description_it, en: form.description_en },
      objectives: {
        it: form.objectives_it.split('\n').filter(Boolean),
        en: form.objectives_en.split('\n').filter(Boolean),
      },
      prerequisites: { it: form.prerequisites_it, en: form.prerequisites_en },
      program: { it: parseProgram(form.program_it), en: parseProgram(form.program_en) },
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

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <Label className="text-xs font-medium text-deep mb-1 block">{label}</Label>
      <Input
        type={type}
        value={form[key as keyof typeof form] as string}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
    </div>
  )

  const textarea = (label: string, key: string, rows = 3, placeholder = '') => (
    <div>
      <Label className="text-xs font-medium text-deep mb-1 block">{label}</Label>
      <Textarea
        value={form[key as keyof typeof form] as string}
        onChange={(e) => set(key, e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="text-sm resize-none"
      />
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? 'Modifica corso' : 'Nuovo corso'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Base info */}
          <div className="grid grid-cols-3 gap-4">
            {field('Slug *', 'slug', 'text', 'sap-fi-base')}
            <div>
              <Label className="text-xs font-medium text-deep mb-1 block">Modulo *</Label>
              <Select value={form.module} onValueChange={(v) => set('module', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-deep mb-1 block">Livello *</Label>
              <Select value={form.level} onValueChange={(v) => set('level', v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l} className="capitalize">
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-2 gap-4">
            {field('Titolo IT *', 'title_it')}
            {field('Titolo EN', 'title_en')}
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-4">
            {textarea('Descrizione IT *', 'description_it', 3)}
            {textarea('Descrizione EN', 'description_en', 3)}
          </div>

          {/* Objectives */}
          <div className="grid grid-cols-2 gap-4">
            {textarea('Obiettivi IT (una per riga)', 'objectives_it', 4)}
            {textarea('Obiettivi EN (one per line)', 'objectives_en', 4)}
          </div>

          {/* Prerequisites */}
          <div className="grid grid-cols-2 gap-4">
            {textarea('Prerequisiti IT', 'prerequisites_it', 2)}
            {textarea('Prerequisiti EN', 'prerequisites_en', 2)}
          </div>

          {/* Program (JSON) */}
          <div className="grid grid-cols-2 gap-4">
            {textarea(
              'Programma IT (JSON array)',
              'program_it',
              5,
              '[{"title":"Modulo 1","items":["item 1","item 2"]}]'
            )}
            {textarea('Programma EN (JSON array)', 'program_en', 5)}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-3 gap-4">
            {field('Ore durata', 'duration_hours', 'number')}
            {field('Info prezzo', 'price_info', 'text', 'Su richiesta')}
            {field('URL immagine', 'image_url', 'text')}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-sm font-medium text-deep">Pubblicato</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-sm font-medium text-deep">In evidenza</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Annulla
            </Button>
            <Button
              className="bg-brand-primary hover:bg-brand-primary-dark text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              {course ? 'Salva modifiche' : 'Crea corso'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
