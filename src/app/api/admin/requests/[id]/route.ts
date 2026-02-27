import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await request.json()

  if (!['new', 'read', 'replied'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
