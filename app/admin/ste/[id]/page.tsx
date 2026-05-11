import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import STEKategoriDetail from './STEKategoriDetail'

export default async function AdminSTEDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kategori = await prisma.steKategori.findUnique({
    where: { id },
    include: {
      kurulUyeleri: { orderBy: { order: 'asc' } },
      materyaller: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!kategori) notFound()

  return (
    <div className="admin-page">
      <STEKategoriDetail kategori={JSON.parse(JSON.stringify(kategori))} />
    </div>
  )
}
