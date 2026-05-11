import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const type = searchParams.get('type') // 'image' | 'pdf' | null

  const where = type === 'image' ? { mimeType: { contains: 'image' } }
              : type === 'pdf'   ? { mimeType: { contains: 'pdf' } }
              : {}

  const [items, total] = await Promise.all([
    prisma.medya.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page-1)*24, take: 24, include: { uploadedBy: { select: { name: true } } } }),
    prisma.medya.count({ where }),
  ])
  return NextResponse.json({ items, total })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'medya:upload')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })

  const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Dosya boyutu 10 MB\'ı aşamaz' }, { status: 400 })
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4', 'video/webm']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Desteklenmeyen dosya türü' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = path.extname(file.name)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  const medya = await prisma.medya.create({
    data: { filename: file.name, url: `/uploads/${filename}`, mimeType: file.type, size: file.size, uploadedById: session.user.id },
  })
  return NextResponse.json(medya, { status: 201 })
}
