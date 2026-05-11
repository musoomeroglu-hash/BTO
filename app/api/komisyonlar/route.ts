import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET() {
  const items = await prisma.komisyon.findMany({ where: { active: true }, orderBy: { order: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'komisyon:edit')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }
  const body = await req.json()
  const item = await prisma.komisyon.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
