'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { BookOpen, MessageSquare, Eye, Star } from 'lucide-react'
import type { Course } from '@/types/database'
import type { ContactRequest } from '@/types/database'

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/courses').then((r) => r.json()),
      fetch('/api/admin/requests').then((r) => r.json()),
    ]).then(([c, r]) => {
      setCourses(Array.isArray(c) ? c : [])
      setRequests(Array.isArray(r) ? r : [])
      setLoading(false)
    })
  }, [])

  const stats = [
    {
      label: 'Corsi totali',
      value: courses.length,
      icon: BookOpen,
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10',
    },
    {
      label: 'Corsi pubblicati',
      value: courses.filter((c) => c.is_published).length,
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'In evidenza',
      value: courses.filter((c) => c.is_featured).length,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Richieste nuove',
      value: requests.filter((r) => r.status === 'new').length,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-display font-bold text-deep mb-1">Dashboard</h1>
        <p className="text-muted-text text-sm mb-8">Panoramica del sito TooSkill</p>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl border border-border p-6 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-deep">{s.value}</div>
                  <div className="text-xs text-muted-text mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent requests */}
        {requests.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-display font-bold text-deep mb-4">Ultime richieste</h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface text-muted-text text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3">Nome</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Corso</th>
                    <th className="text-left px-4 py-3">Stato</th>
                    <th className="text-left px-4 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 5).map((r) => (
                    <tr key={r.id} className="border-t border-border/50">
                      <td className="px-4 py-3 font-medium text-deep">{r.name}</td>
                      <td className="px-4 py-3 text-muted-text">{r.email}</td>
                      <td className="px-4 py-3 text-muted-text">{r.course_title ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            r.status === 'new'
                              ? 'bg-blue-50 text-blue-700'
                              : r.status === 'read'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-text">
                        {new Date(r.created_at).toLocaleDateString('it-IT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
