import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminEtkinliklerPage() {
  const items = await prisma.etkinlik.findMany({ orderBy: { startDate: 'desc' } })

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>Etkinlikler</h1>
        <Link href="/admin/etkinlikler/yeni" className="admin-btn admin-btn-primary">+ Yeni Etkinlik</Link>
      </div>
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead>
            <tr><th>Başlık</th><th>Konum</th><th>Başlangıç</th><th>Bitiş</th><th>Durum</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id}>
                <td><Link href={`/admin/etkinlikler/${e.id}`} style={{color:'var(--text)',fontWeight:500}}>{e.title}</Link></td>
                <td style={{color:'var(--gray)'}}>{e.location}</td>
                <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{new Date(e.startDate).toLocaleDateString('tr-TR')}</td>
                <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{new Date(e.endDate).toLocaleDateString('tr-TR')}</td>
                <td><span className={`badge ${e.published ? 'badge-green' : 'badge-gray'}`}>{e.published ? 'Yayında' : 'Taslak'}</span></td>
                <td><Link href={`/admin/etkinlikler/${e.id}`} className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Düzenle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
