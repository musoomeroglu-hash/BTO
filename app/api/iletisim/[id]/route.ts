import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !['SUPER_ADMIN', 'MODERATOR'].includes(session.user.role)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { id } = await params
  const body = await req.json()
  
  const updated = await prisma.iletisimMesaji.update({
    where: { id },
    data: { read: body.read },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { id } = await params
  await prisma.iletisimMesaji.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
