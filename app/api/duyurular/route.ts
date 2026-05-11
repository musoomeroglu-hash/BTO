import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET() {
  const items = await prisma.duyuru.findMany({
    where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { priority: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'duyuru:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const body = await req.json()
  const item = await prisma.duyuru.create({
    data: { title: body.title, content: body.content, url: body.url, priority: body.priority ?? 0, active: body.active ?? true, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null },
  })
  return NextResponse.json(item, { status: 201 })
}
