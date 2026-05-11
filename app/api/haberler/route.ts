import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { slugifyTR } from '@/lib/slugify'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const q = searchParams.get('q')
  const featured = searchParams.get('featured')

  const where: Record<string, unknown> = { published: true }
  if (category) where.category = category
  if (q) where.title = { contains: q }
  if (featured === 'true') where.featured = true

  const [items, total] = await Promise.all([
    prisma.haber.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } }, komisyon: { select: { name: true } } },
    }),
    prisma.haber.count({ where }),
  ])

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'haber:create')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const slug = slugifyTR(body.title) + '-' + Date.now()

  const haber = await prisma.haber.create({
    data: {
      title: body.title,
      slug: body.slug || slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category ?? 'HABER',
      imageUrl: body.imageUrl,
      featured: body.featured ?? false,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : null,
      authorId: session.user.id,
      komisyonId: body.komisyonId || null,
    },
  })

  return NextResponse.json(haber, { status: 201 })
}
