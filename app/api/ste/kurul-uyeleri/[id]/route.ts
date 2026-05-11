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

  const updated = await prisma.steKurulUyesi.update({
    where: { id },
    data: {
      name: body.name,
      title: body.title,
      institution: body.institution,
      photoUrl: body.photoUrl,
      order: body.order,
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
  await prisma.steKurulUyesi.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
