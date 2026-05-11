export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminHaberlerPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1')
  const PER = 20

  const [items, total] = await Promise.all([
    prisma.haber.findMany({ orderBy: { createdAt: 'desc' }, skip: (page-1)*PER, take: PER, include: { author: { select: { name: true } } } }),
    prisma.haber.count(),
  ])
  const pages = Math.ceil(total / PER)

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>Haberler</h1>
        <Link href="/admin/haberler/yeni" className="admin-btn admin-btn-primary">+ Yeni Haber</Link>
      </div>
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Kategori</th>
              <th>Yazar</th>
              <th>Görüntülenme</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map(h => (
              <tr key={h.id}>
                <td style={{maxWidth:300}}><Link href={`/admin/haberler/${h.id}`} style={{color:'var(--text)',fontWeight:500}}>{h.title.length>60?h.title.slice(0,60)+'…':h.title}</Link></td>
                <td><span className="badge badge-gray">{h.category}</span></td>
                <td style={{color:'var(--gray)'}}>{h.author.name}</td>
                <td style={{color:'var(--gray)'}}>{h.viewCount}</td>
                <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{new Date(h.createdAt).toLocaleDateString('tr-TR')}</td>
                <td><span className={`badge ${h.published ? 'badge-green' : 'badge-gray'}`}>{h.published ? 'Yayında' : 'Taslak'}</span></td>
                <td>
                  <div style={{display:'flex',gap:8}}>
                    <Link href={`/admin/haberler/${h.id}`} className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Düzenle</Link>
                    <Link href={`/haberler/${h.slug}`} target="_blank" className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Gör</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="pagination" style={{marginTop:24}}>
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <Link key={p} href={`/admin/haberler?page=${p}`} className={p===page?'active':''}>{p}</Link>
          ))}
        </div>
      )}
    </div>
  )
}
