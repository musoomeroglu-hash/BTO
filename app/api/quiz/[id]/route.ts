import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'quiz:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const item = await prisma.quiz.update({
    where: { id },
    data: { question: body.question, options: body.options, correctOption: body.correctOption, explanation: body.explanation, imageUrl: body.imageUrl || null, imageCaption: body.imageCaption || null, weekDate: new Date(body.weekDate || Date.now()), active: body.active ?? true },
  })
  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'quiz:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  const { id } = await params
  await prisma.quiz.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
