export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const PER_PAGE = 12

export default async function BasinAciklamalarPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1')
  const where = { published: true, category: 'BASIN_ACIKLAMASI' as const }

  const [items, total] = await Promise.all([
    prisma.haber.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page-1)*PER_PAGE, take: PER_PAGE, include: { author: { select: { name: true } } } }),
    prisma.haber.count({ where }),
  ])
  const pages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">BASIN AÇIKLAMALARI</div>
          <h1>Basın Açıklamaları</h1>
          <p>BTO&apos;nun kamuoyuna yönelik resmi açıklamaları</p>
        </div>
      </div>
      <div className="page-content">
        <p style={{color:'var(--gray)',fontSize:14,marginBottom:24}}>{total} basın açıklaması</p>
        <div className="cards-grid">
          {items.map(h => (
            <div key={h.id} className="news-card">
              <div className="news-card-img">
                {h.imageUrl ? <img src={h.imageUrl} alt={h.title}/> : <div style={{background:'linear-gradient(135deg,#1a2a4a,#c44)',width:'100%',height:'100%'}}/>}
              </div>
              <div className="news-card-body">
                <span className="card-badge">Basın Açıklaması</span>
                <h3>{h.title}</h3>
                {h.excerpt && <p>{h.excerpt}</p>}
                <div className="news-meta">
                  <span>{new Date(h.publishedAt ?? h.createdAt).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</span>
                </div>
                <Link href={`/haberler/${h.slug}`}>Devamını Oku →</Link>
              </div>
            </div>
          ))}
        </div>
        {pages > 1 && (
          <div className="pagination">
            {page > 1 && <Link href={`/basin-aciklamalari?page=${page-1}`}>‹</Link>}
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <Link key={p} href={`/basin-aciklamalari?page=${p}`} className={p===page?'active':''}>{p}</Link>
            ))}
            {page < pages && <Link href={`/basin-aciklamalari?page=${page+1}`}>›</Link>}
          </div>
        )}
      </div>
    </>
  )
}
