import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const item = await prisma.yonetimKurulu.update({
    where: { id },
    data: { name: body.name, title: body.title, position: body.position, photoUrl: body.photoUrl || null, order: body.order ?? 0, startYear: body.startYear, endYear: body.endYear ?? null, active: body.active ?? true },
  })
  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.yonetimKurulu.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
