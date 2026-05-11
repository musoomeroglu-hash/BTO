import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import KullaniciForm from '@/components/admin/KullaniciForm'

export default async function KullaniciEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, komisyonlar] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id:true, name:true, email:true, username:true, role:true, active:true, komisyonId:true } }),
    prisma.komisyon.findMany({ where:{ active:true }, select:{ id:true, name:true } }),
  ])
  if (!user) notFound()
  return (
    <div className="admin-page">
      <h1>Kullanıcıyı Düzenle</h1>
      <KullaniciForm user={user} komisyonlar={komisyonlar} />
    </div>
  )
}
