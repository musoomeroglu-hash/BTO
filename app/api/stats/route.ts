import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalHaber, thisMonthHaber,
    totalEtkinlik, upcomingEtkinlik,
    totalAbone, unreadMesaj,
    sonHaberler, sonMesajlar,
  ] = await Promise.all([
    prisma.haber.count(),
    prisma.haber.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.etkinlik.count(),
    prisma.etkinlik.count({ where: { startDate: { gte: now }, published: true } }),
    prisma.bultenAbone.count(),
    prisma.iletisimMesaji.count({ where: { read: false } }),
    prisma.haber.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { author: { select: { name: true } } } }),
    prisma.iletisimMesaji.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  return NextResponse.json({
    haberler: { total: totalHaber, thisMonth: thisMonthHaber },
    etkinlikler: { total: totalEtkinlik, upcoming: upcomingEtkinlik },
    aboneler: { total: totalAbone },
    mesajlar: { unread: unreadMesaj },
    sonHaberler,
    sonMesajlar,
  })
}
