export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const PER_PAGE = 12

const FILTERS = [
  { label: 'Tümü', value: '' },
  { label: 'Haberler', value: 'HABER' },
  { label: 'Basın Açıklamaları', value: 'BASIN_ACIKLAMASI' },
  { label: 'Duyurular', value: 'DUYURU' },
]

export default async function EtkinliklerPage({ searchParams }: { searchParams: Promise<{ page?: string; kategori?: string }> }) {
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1')
  const kategori = sp.kategori ?? ''

  const where: { published: boolean; category?: string } = { published: true }
  if (kategori) where.category = kategori

  const [items, total] = await Promise.all([
    prisma.haber.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page-1)*PER_PAGE, take: PER_PAGE, include: { author: { select: { name: true } } } }),
    prisma.haber.count({ where }),
  ])
  const pages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">ETKİNLİKLER</div>
          <h1>Etkinlikler</h1>
          <p>BTO&apos;nun düzenlediği etkinlikler</p>
        </div>
      </div>
      <div className="page-content">
        {/* Filtre Butonları */}
        <div className="filter-bar" style={{marginBottom:24}}>
          {FILTERS.map(f => (
            <Link
              key={f.value}
              href={f.value ? `/basin-aciklamalari?kategori=${f.value}` : '/basin-aciklamalari'}
              className={`filter-btn${kategori === f.value ? ' active' : ''}`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <p style={{color:'var(--gray)',fontSize:14,marginBottom:24}}>{total} sonuç</p>

        <div className="cards-grid">
          {items.map(h => (
            <div key={h.id} className="news-card">
              <div className="news-card-img">
                {h.imageUrl ? <img src={h.imageUrl} alt={h.title}/> : <div style={{background:'linear-gradient(135deg,#1a2a4a,#c44)',width:'100%',height:'100%'}}/>}
              </div>
              <div className="news-card-body">
                <span className="card-badge">
                  {h.category === 'BASIN_ACIKLAMASI' ? 'Basın Açıklaması' : h.category === 'DUYURU' ? 'Duyuru' : 'Haber'}
                </span>
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
            {page > 1 && <Link href={`/basin-aciklamalari?page=${page-1}${kategori ? `&kategori=${kategori}` : ''}`}>‹</Link>}
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <Link key={p} href={`/basin-aciklamalari?page=${p}${kategori ? `&kategori=${kategori}` : ''}`} className={p===page?'active':''}>{p}</Link>
            ))}
            {page < pages && <Link href={`/basin-aciklamalari?page=${page+1}${kategori ? `&kategori=${kategori}` : ''}`}>›</Link>}
          </div>
        )}
      </div>
    </>
  )
}
