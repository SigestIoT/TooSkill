import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: Props) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('courses')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!(await verifyAdminSession(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
