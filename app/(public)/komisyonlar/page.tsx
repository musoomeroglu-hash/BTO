export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function KomisyonlarPage() {
  const komisyonlar = await prisma.komisyon.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">KOMİSYONLAR</div>
          <h1>Komisyonlarımız</h1>
          <p>Uzmanlık alanlarına göre faaliyet gösteren 15 komisyonumuz</p>
        </div>
      </div>
      <div className="page-content">
        <div className="komisyon-grid">
          {komisyonlar.map(k => (
            <Link href={`/komisyonlar/${k.slug}`} key={k.id} className="komisyon-card">
              <h3>{k.name}</h3>
              {k.description && <p>{k.description.length > 100 ? k.description.slice(0,100)+'…' : k.description}</p>}
              {k.chairName && <p className="komisyon-chair">Başkan: {k.chairName}</p>}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
