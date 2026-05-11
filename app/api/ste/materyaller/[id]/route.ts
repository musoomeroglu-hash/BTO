import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.steMateryal.update({
    where: { id },
    data: {
      title: body.title,
      type: body.type,
      author: body.author,
      description: body.description,
      coverUrl: body.coverUrl,
      fileUrl: body.fileUrl,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params
  await prisma.steMateryal.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
