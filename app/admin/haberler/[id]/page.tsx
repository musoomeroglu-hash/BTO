export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import HaberForm from '@/components/admin/HaberForm'

export default async function HaberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [haber, komisyonlar] = await Promise.all([
    prisma.haber.findUnique({ where: { id } }),
    prisma.komisyon.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ])
  if (!haber) notFound()
  return (
    <div className="admin-page">
      <h1>Haberi Düzenle</h1>
      <HaberForm haber={haber} komisyonlar={komisyonlar} />
    </div>
  )
}
