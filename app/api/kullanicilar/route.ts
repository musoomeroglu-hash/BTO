import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, username: true, role: true, active: true, lastLogin: true, createdAt: true, komisyon: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const body = await req.json()
  const passwordHash = await bcrypt.hash(body.password, 12)

  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, username: body.username, passwordHash, role: body.role ?? 'VIEWER', komisyonId: body.komisyonId || null },
  })

  const { passwordHash: _, ...safe } = user
  return NextResponse.json(safe, { status: 201 })
}
