import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !['SUPER_ADMIN', 'EDITOR'].includes(session.user.role)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { searchParams } = req.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  
  const [items, total] = await Promise.all([
    prisma.bultenAbone.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.bultenAbone.count(),
  ])
  
  return NextResponse.json({ items, total })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  
  await prisma.bultenAbone.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
