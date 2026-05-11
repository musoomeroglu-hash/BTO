import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const items = await prisma.siteAyar.findMany()
  const result: Record<string, string> = {}
  for (const item of items) result[item.key] = item.value
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const body = await req.json()
  for (const [key, value] of Object.entries(body as Record<string, string>)) {
    await prisma.siteAyar.upsert({ where: { key }, create: { key, value }, update: { value } })
  }
  return NextResponse.json({ success: true })
}
