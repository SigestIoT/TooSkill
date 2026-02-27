'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CourseModal from '@/components/admin/CourseModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Course, LocalizedString } from '@/types/database'

export default function AdminCorsiPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCourses = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((d) => {
        setCourses(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(course: Course) {
    setEditing(course)
    setModalOpen(true)
  }

  async function togglePublished(course: Course) {
    await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !course.is_published }),
    })
    fetchCourses()
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo corso?')) return
    setDeleting(id)
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    setDeleting(null)
    fetchCourses()
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-deep mb-1">Corsi</h1>
            <p className="text-muted-text text-sm">Gestisci il catalogo corsi</p>
          </div>
          <Button
            className="bg-brand-primary hover:bg-brand-primary-dark text-white gap-2"
            onClick={openCreate}
          >
            <Plus size={16} />
            Nuovo corso
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white border border-border animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-muted-text">
            <p>Nessun corso. Crea il primo!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface text-muted-text text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Titolo</th>
                  <th className="text-left px-4 py-3">Modulo</th>
                  <th className="text-left px-4 py-3">Livello</th>
                  <th className="text-left px-4 py-3">Ore</th>
                  <th className="text-left px-4 py-3">Stato</th>
                  <th className="text-right px-4 py-3">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t border-border/50 hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-deep line-clamp-1">
                        {(course.title as LocalizedString)?.it ?? course.slug}
                      </div>
                      <div className="text-xs text-muted-text">{course.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {course.module}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-text text-xs">{course.level}</td>
                    <td className="px-4 py-3 text-muted-text text-xs">
                      {course.duration_hours ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          course.is_published
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {course.is_published ? 'Pubblicato' : 'Bozza'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-text hover:text-brand-primary"
                          onClick={() => togglePublished(course)}
                          title={course.is_published ? 'Nascondi' : 'Pubblica'}
                        >
                          {course.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-text hover:text-brand-primary"
                          onClick={() => openEdit(course)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-text hover:text-red-500"
                          onClick={() => handleDelete(course.id)}
                          disabled={deleting === course.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CourseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchCourses}
        course={editing}
      />
    </AdminLayout>
  )
}
