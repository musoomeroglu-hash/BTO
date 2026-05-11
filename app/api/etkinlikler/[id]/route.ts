import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.etkinlik.findFirst({ where: { OR: [{ id }, { slug: id }] } })
  if (!item) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'etkinlik:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.etkinlik.update({
    where: { id },
    data: { ...body, startDate: new Date(body.startDate), endDate: new Date(body.endDate) },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'etkinlik:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.etkinlik.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
