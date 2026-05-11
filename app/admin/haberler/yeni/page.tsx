import { prisma } from '@/lib/prisma'
import HaberForm from '@/components/admin/HaberForm'

export default async function YeniHaberPage() {
  const komisyonlar = await prisma.komisyon.findMany({ where: { active: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } })
  return (
    <div className="admin-page">
      <h1>Yeni Haber</h1>
      <HaberForm komisyonlar={komisyonlar} />
    </div>
  )
}
