import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const haber = await prisma.haber.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { author: { select: { name: true } }, komisyon: { select: { name: true, slug: true } } },
  })
  if (!haber) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  // View count increment
  if (haber.published) {
    await prisma.haber.update({ where: { id: haber.id }, data: { viewCount: { increment: 1 } } })
  }

  return NextResponse.json(haber)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  const haber = await prisma.haber.findUnique({ where: { id } })
  if (!haber) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  if (!can(session.user.role, 'haber:edit', session.user.komisyonId, haber.komisyonId)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const updated = await prisma.haber.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl,
      featured: body.featured,
      published: body.published,
      publishedAt: body.published && !haber.publishedAt ? new Date() : haber.publishedAt,
      komisyonId: body.komisyonId || null,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'haber:delete')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params
  await prisma.haber.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
