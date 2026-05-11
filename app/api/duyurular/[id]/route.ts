import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'duyuru:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.duyuru.update({ where: { id }, data: { title: body.title, content: body.content, url: body.url, priority: body.priority, active: body.active, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null } })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'duyuru:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.duyuru.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
