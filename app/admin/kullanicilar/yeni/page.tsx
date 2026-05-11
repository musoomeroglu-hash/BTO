export const dynamic = 'force-dynamic'
import KullaniciForm from '@/components/admin/KullaniciForm'
import { prisma } from '@/lib/prisma'

export default async function YeniKullaniciPage() {
  const komisyonlar = await prisma.komisyon.findMany({ where:{ active:true }, select:{ id:true, name:true } })
  return (
    <div className="admin-page">
      <h1>Yeni Kullanıcı</h1>
      <KullaniciForm komisyonlar={komisyonlar} />
    </div>
  )
}
