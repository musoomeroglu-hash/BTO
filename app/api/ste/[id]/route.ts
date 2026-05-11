import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kategori = await prisma.steKategori.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      kurulUyeleri: { orderBy: { order: 'asc' } },
      materyaller: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!kategori) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(kategori)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.steKategori.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      iconEmoji: body.iconEmoji,
      order: body.order,
      active: body.active,
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
  await prisma.steKategori.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
