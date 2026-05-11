import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { slugifyTR } from '@/lib/slugify'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const upcoming = searchParams.get('upcoming')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')

  const where: Record<string, unknown> = { published: true }
  if (upcoming === 'true') where.startDate = { gte: new Date() }

  const items = await prisma.etkinlik.findMany({
    where,
    orderBy: { startDate: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
  })
  const total = await prisma.etkinlik.count({ where })

  return NextResponse.json({ items, total })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'etkinlik:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const etkinlik = await prisma.etkinlik.create({
    data: {
      title: body.title,
      slug: body.slug || slugifyTR(body.title) + '-' + Date.now(),
      description: body.description,
      content: body.content,
      location: body.location ?? 'Bursa',
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      imageUrl: body.imageUrl,
      published: body.published ?? false,
    },
  })
  return NextResponse.json(etkinlik, { status: 201 })
}
