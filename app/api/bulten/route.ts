import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
  }

  try {
    await prisma.bultenAbone.upsert({
      where: { email },
      update: {},
      create: { email, confirmed: false },
    })
    return NextResponse.json({ success: true, message: 'E-bülten aboneliğiniz alındı!' })
  } catch {
    return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 })
  }
}
