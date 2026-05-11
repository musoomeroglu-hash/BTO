import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'

export async function GET() {
  const items = await prisma.unutamadigi.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !can(session.user.role, 'unutamadigi:manage')) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  
  const body = await req.json()
  const item = await prisma.unutamadigi.create({
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
  return NextResponse.json(item, { status: 201 })
}
