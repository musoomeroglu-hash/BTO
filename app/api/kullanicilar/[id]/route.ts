import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = { name: body.name, email: body.email, role: body.role, active: body.active, komisyonId: body.komisyonId || null }
  if (body.password) data.passwordHash = await bcrypt.hash(body.password, 12)

  const user = await prisma.user.update({ where: { id }, data })
  const { passwordHash: _, ...safe } = user
  return NextResponse.json(safe)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  if (id === session.user.id) return NextResponse.json({ error: 'Kendinizi silemezsiniz' }, { status: 400 })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
