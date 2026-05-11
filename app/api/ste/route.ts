import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { slugifyTR } from '@/lib/slugify'

export async function GET() {
  const kategoriler = await prisma.steKategori.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { kurulUyeleri: true, materyaller: true } },
    },
  })
  return NextResponse.json(kategoriler)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const slug = slugifyTR(body.name)

  const kategori = await prisma.steKategori.create({
    data: {
      name: body.name,
      slug: body.slug || slug,
      description: body.description || null,
      iconEmoji: body.iconEmoji || null,
      order: body.order ?? 0,
      active: body.active ?? true,
    },
  })

  return NextResponse.json(kategori, { status: 201 })
}
