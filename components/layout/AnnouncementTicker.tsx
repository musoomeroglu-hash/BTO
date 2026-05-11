import { prisma } from '@/lib/prisma'

export default async function AnnouncementTicker() {
  const duyurular = await prisma.duyuru.findMany({
    where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { priority: 'desc' },
    take: 10,
  })

  const items = duyurular.length > 0 ? duyurular : [
    { id: '1', title: 'Bursa Tabip Odası resmi web sitesine hoş geldiniz', url: null },
  ]
  const doubled = [...items, ...items]

  return (
    <div className="ticker-band">
      <div className="ticker-inner">
        <div className="ticker-label">DUYURULAR</div>
        <div className="ticker-scroll">
          <div className="ticker-track">
            {doubled.map((d, i) => (
              <span key={i}>
                {d.url ? <a href={d.url} style={{color:'inherit'}}>{d.title}</a> : d.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
