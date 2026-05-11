import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const PER_PAGE = 12

async function getHaberler(page: number, kategori: string | null) {
  const where: Record<string, unknown> = { published: true }
  if (kategori === 'HABER') where.category = 'HABER'
  else if (kategori === 'BASIN') where.category = 'BASIN_ACIKLAMASI'
  else if (kategori === 'DUYURU') where.category = 'DUYURU'

  const [items, total] = await Promise.all([
    prisma.haber.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page-1)*PER_PAGE, take: PER_PAGE, include: { author: { select: { name: true } } } }),
    prisma.haber.count({ where }),
  ])
  return { items, total, pages: Math.ceil(total / PER_PAGE) }
}

export default async function HaberlerPage({ searchParams }: { searchParams: Promise<{ page?: string; kategori?: string }> }) {
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1')
  const kategori = sp.kategori ?? null
  const { items, total, pages } = await getHaberler(page, kategori)

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })
  }

  const categories = [
    { label: 'Tümü', val: null },
    { label: 'Haberler', val: 'HABER' },
    { label: 'Basın Açıklamaları', val: 'BASIN' },
    { label: 'Duyurular', val: 'DUYURU' },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">HABERLER</div>
          <h1>Güncel Haberler ve Duyurular</h1>
          <p>Bursa Tabip Odası&apos;ndan en güncel haberler</p>
        </div>
      </div>
      <div className="page-content">
        <div className="filter-bar">
          {categories.map(c => (
            <Link key={c.label} href={c.val ? `/haberler?kategori=${c.val}` : '/haberler'} className={`filter-btn${(!kategori && !c.val) || kategori === c.val ? ' active' : ''}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <p style={{color:'var(--gray)',fontSize:14,marginBottom:24}}>{total} haber bulundu</p>
        <div className="cards-grid">
          {items.map(h => (
            <div key={h.id} className="news-card">
              <div className="news-card-img">
                {h.imageUrl ? <img src={h.imageUrl} alt={h.title}/> : <div style={{background:'linear-gradient(135deg,#f0e0e0,#c44)',width:'100%',height:'100%'}}/>}
              </div>
              <div className="news-card-body">
                <span className="card-badge">{h.category === 'BASIN_ACIKLAMASI' ? 'Basın Açıklaması' : h.category === 'DUYURU' ? 'Duyuru' : 'Haber'}</span>
                <h3>{h.title}</h3>
                {h.excerpt && <p>{h.excerpt}</p>}
                <div className="news-meta">
                  <span>{formatDate(h.publishedAt ?? h.createdAt)}</span>
                  <span>·</span>
                  <span>{h.author.name}</span>
                </div>
                <Link href={`/haberler/${h.slug}`}>Devamını Oku →</Link>
              </div>
            </div>
          ))}
        </div>
        {pages > 1 && (
          <div className="pagination">
            {page > 1 && <Link href={`/haberler?page=${page-1}${kategori?`&kategori=${kategori}`:''}`}>‹</Link>}
            {Array.from({length: pages}, (_,i) => i+1).map(p => (
              <Link key={p} href={`/haberler?page=${p}${kategori?`&kategori=${kategori}`:''}`} className={p === page ? 'active' : ''}>{p}</Link>
            ))}
            {page < pages && <Link href={`/haberler?page=${page+1}${kategori?`&kategori=${kategori}`:''}`}>›</Link>}
          </div>
        )}
      </div>
    </>
  )
}
