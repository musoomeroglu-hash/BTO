import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Ad, e-posta ve mesaj zorunludur' }, { status: 400 })
  }

  const mesaj = await prisma.iletisimMesaji.create({
    data: { name, email, subject, message },
  })

  return NextResponse.json({ success: true, id: mesaj.id })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const unread = searchParams.get('unread') === 'true'

  const where = unread ? { read: false } : {}
  const [items, total] = await Promise.all([
    prisma.iletisimMesaji.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page-1)*20, take: 20 }),
    prisma.iletisimMesaji.count({ where }),
  ])

  return NextResponse.json({ items, total })
}
