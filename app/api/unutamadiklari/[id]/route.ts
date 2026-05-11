import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'unutamadigi:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { id } = await params
  const body = await req.json()
  
  const updated = await prisma.unutamadigi.update({
    where: { id },
    data: { 
      name: body.name, 
      title: body.title || null, 
      birthYear: body.birthYear ? +body.birthYear : null, 
      deathYear: body.deathYear ? +body.deathYear : null, 
      birthPlace: body.birthPlace || null, 
      specialty: body.specialty || null, 
      medicalSchool: body.medicalSchool || null, 
      photoUrl: body.photoUrl || null, 
      bio: body.bio || null 
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !can(session.user.role, 'unutamadigi:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const { id } = await params
  await prisma.unutamadigi.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
