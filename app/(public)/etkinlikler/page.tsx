import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function EtkinliklerPage() {
  const now = new Date()
  const [upcoming, past] = await Promise.all([
    prisma.etkinlik.findMany({ where: { published: true, startDate: { gte: now } }, orderBy: { startDate: 'asc' }, take: 12 }),
    prisma.etkinlik.findMany({ where: { published: true, startDate: { lt: now } }, orderBy: { startDate: 'desc' }, take: 8 }),
  ])

  function fmtDate(d: Date | string) {
    return new Date(d).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">ETKİNLİKLER</div>
          <h1>Etkinliklerimiz</h1>
          <p>Kongre, seminer, workshop ve toplantılarımıza katılın</p>
        </div>
      </div>
      <div className="page-content">
        <h2 style={{marginBottom:24}}>Yaklaşan Etkinlikler</h2>
        {upcoming.length === 0 ? (
          <p style={{color:'var(--gray)'}}>Yaklaşan etkinlik bulunmuyor.</p>
        ) : (
          <div className="etkinlikler-grid" style={{marginBottom:64}}>
            {upcoming.map(e => (
              <Link href={`/etkinlikler/${e.slug}`} key={e.id} className="etkinlik-card">
                <div className="etkinlik-card-img">
                  {e.imageUrl ? <img src={e.imageUrl} alt={e.title}/> : <div style={{background:'linear-gradient(135deg,#1a2a4a,#4a1020)',width:'100%',height:'100%'}}/>}
                </div>
                <div className="etkinlik-card-body">
                  <div className="etkinlik-meta">{e.location} · {fmtDate(e.startDate)}</div>
                  <h4>{e.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 style={{marginBottom:24}}>Geçmiş Etkinlikler</h2>
            <div className="etkinlikler-grid">
              {past.map(e => (
                <Link href={`/etkinlikler/${e.slug}`} key={e.id} className="etkinlik-card" style={{opacity:.75}}>
                  <div className="etkinlik-card-img">
                    {e.imageUrl ? <img src={e.imageUrl} alt={e.title}/> : <div style={{background:'linear-gradient(135deg,#3a3a3a,#1a1a1a)',width:'100%',height:'100%'}}/>}
                  </div>
                  <div className="etkinlik-card-body" style={{background:'var(--dark)'}}>
                    <div className="etkinlik-meta">{e.location} · {fmtDate(e.startDate)}</div>
                    <h4>{e.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
