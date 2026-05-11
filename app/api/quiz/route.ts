import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  if (searchParams.get('aktif') === '1') {
    const quiz = await prisma.quiz.findFirst({ where: { active: true }, orderBy: { weekDate: 'desc' } })
    if (!quiz) return NextResponse.json(null)
    return NextResponse.json({ ...quiz, options: JSON.parse(quiz.options as string) })
  }
  const items = await prisma.quiz.findMany({ orderBy: { weekDate: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'quiz:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const body = await req.json()
  const item = await prisma.quiz.create({
    data: { ...body, options: JSON.stringify(body.options), weekDate: new Date(body.weekDate) },
  })
  return NextResponse.json(item, { status: 201 })
}
