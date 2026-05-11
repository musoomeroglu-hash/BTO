import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const items = await prisma.yonetimKurulu.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const body = await req.json()
  const item = await prisma.yonetimKurulu.create({
    data: { name: body.name, title: body.title, position: body.position, photoUrl: body.photoUrl || null, order: body.order ?? 0, startYear: body.startYear, endYear: body.endYear ?? null, active: body.active ?? true },
  })
  return NextResponse.json(item, { status: 201 })
}
