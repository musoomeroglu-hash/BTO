import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EtkinlikForm from '@/components/admin/EtkinlikForm'

export default async function EtkinlikEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const etkinlik = await prisma.etkinlik.findUnique({ where: { id } })
  if (!etkinlik) notFound()
  return (
    <div className="admin-page">
      <h1>Etkinliği Düzenle</h1>
      <EtkinlikForm etkinlik={etkinlik} />
    </div>
  )
}
