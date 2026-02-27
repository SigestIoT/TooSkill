'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface Props {
  courseId?: string
  courseTitle?: string
}

export default function ContactForm({ courseId, courseTitle }: Props) {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company') || null,
      phone: fd.get('phone') || null,
      message: fd.get('message'),
      course_id: courseId ?? null,
      course_title: courseTitle ?? null,
      type: courseId ? 'course_inquiry' : 'general',
      locale,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500" />
        <p className="font-semibold text-deep text-base">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="name">{t('name')} *</Label>
          <Input id="name" name="name" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">{t('email')} *</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input id="phone" name="phone" type="tel" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="company">{t('company')}</Label>
          <Input id="company" name="company" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="message">{t('message')} *</Label>
          <Textarea id="message" name="message" required rows={4} className="mt-1 resize-none" />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-destructive text-sm">{t('error')}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin mr-2 w-4 h-4" />
        ) : null}
        {t('submit')}
      </Button>
    </form>
  )
}
