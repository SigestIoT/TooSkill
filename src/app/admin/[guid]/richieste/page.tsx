'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ContactRequest, ContactStatus } from '@/types/database'

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: 'Nuova',
  read: 'Letta',
  replied: 'Risposta inviata',
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  new: 'bg-blue-50 text-blue-700',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-50 text-green-700',
}

export default function AdminRichiestePage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchRequests = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/requests')
      .then((r) => r.json())
      .then((d) => {
        setRequests(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  async function updateStatus(id: string, status: ContactStatus) {
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-display font-bold text-deep mb-1">Richieste</h1>
        <p className="text-muted-text text-sm mb-8">Gestisci le richieste di contatto ricevute</p>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white border border-border animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-muted-text">
            <p>Nessuna richiesta ancora.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-border overflow-hidden"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-surface/50"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-deep text-sm">{r.name}</span>
                      <span className="text-muted-text text-sm">{r.email}</span>
                      {r.company && (
                        <span className="text-muted-text text-xs">— {r.company}</span>
                      )}
                    </div>
                    {r.course_title && (
                      <div className="text-xs text-muted-text mt-0.5">
                        Corso: {r.course_title}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                    <span className="text-xs text-muted-text">
                      {new Date(r.created_at).toLocaleDateString('it-IT')}
                    </span>
                    {expanded === r.id ? (
                      <ChevronUp size={16} className="text-muted-text" />
                    ) : (
                      <ChevronDown size={16} className="text-muted-text" />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === r.id && (
                  <div className="border-t border-border/50 px-5 py-4 space-y-4">
                    <p className="text-sm text-deep leading-relaxed whitespace-pre-wrap">
                      {r.message}
                    </p>

                    {r.phone && (
                      <p className="text-xs text-muted-text">Tel: {r.phone}</p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {(['new', 'read', 'replied'] as ContactStatus[]).map((s) => (
                        <Button
                          key={s}
                          variant={r.status === s ? 'default' : 'outline'}
                          size="sm"
                          className={
                            r.status === s
                              ? 'bg-brand-primary text-white h-7 text-xs'
                              : 'h-7 text-xs'
                          }
                          onClick={() => updateStatus(r.id, s)}
                        >
                          {STATUS_LABELS[s]}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
