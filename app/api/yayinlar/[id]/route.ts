import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'yayin:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const item = await prisma.yayin.update({
    where: { id },
    data: { title: body.title, type: body.type, description: body.description || null, fileUrl: body.fileUrl || null, coverUrl: body.coverUrl || null, issueNumber: body.issueNumber ?? null, publishedAt: new Date(body.publishedAt || Date.now()) },
  })
  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'yayin:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.yayin.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
