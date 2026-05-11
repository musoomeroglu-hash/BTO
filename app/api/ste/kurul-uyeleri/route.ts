import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const uye = await prisma.steKurulUyesi.create({
    data: {
      name: body.name,
      title: body.title || null,
      institution: body.institution || null,
      photoUrl: body.photoUrl || null,
      order: body.order ?? 0,
      kategoriId: body.kategoriId,
    },
  })

  return NextResponse.json(uye, { status: 201 })
}
