import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET() {
  const items = await prisma.mevzuat.findMany({ orderBy: { publishedAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'mevzuat:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const body = await req.json()
  const item = await prisma.mevzuat.create({
    data: { title: body.title, category: body.category, content: body.content || null, fileUrl: body.fileUrl || null, publishedAt: new Date(body.publishedAt || Date.now()) },
  })
  return NextResponse.json(item, { status: 201 })
}
