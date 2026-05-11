import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.komisyon.findFirst({ where: { OR: [{ id }, { slug: id }] } })
  if (!item) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'komisyon:edit', session.user.komisyonId, (await params).id)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.komisyon.update({ where: { id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.komisyon.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
