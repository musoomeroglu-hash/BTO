import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'ste:manage')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const materyal = await prisma.steMateryal.create({
    data: {
      title: body.title,
      type: body.type ?? 'KITAP',
      author: body.author || null,
      description: body.description || null,
      coverUrl: body.coverUrl || null,
      fileUrl: body.fileUrl || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      kategoriId: body.kategoriId,
    },
  })

  return NextResponse.json(materyal, { status: 201 })
}
