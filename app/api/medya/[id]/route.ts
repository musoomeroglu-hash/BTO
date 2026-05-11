import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'medya:delete')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id } = await params
  const medya = await prisma.medya.findUnique({ where: { id } })
  if (!medya) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const filePath = path.join(process.cwd(), 'public', medya.url)
  await unlink(filePath).catch(() => {})
  await prisma.medya.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
