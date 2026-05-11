import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminKomisyonlarPage() {
  const items = await prisma.komisyon.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="admin-page">
      <h1>Komisyonlar</h1>
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead>
            <tr><th>Ad</th><th>Başkan</th><th>Sıra</th><th>Durum</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {items.map(k => (
              <tr key={k.id}>
                <td><Link href={`/admin/komisyonlar/${k.id}`} style={{color:'var(--text)',fontWeight:500}}>{k.name}</Link></td>
                <td style={{color:'var(--gray)'}}>{k.chairName ?? '—'}</td>
                <td style={{color:'var(--gray)'}}>{k.order}</td>
                <td><span className={`badge ${k.active ? 'badge-green' : 'badge-gray'}`}>{k.active ? 'Aktif' : 'Pasif'}</span></td>
                <td><Link href={`/admin/komisyonlar/${k.id}`} className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Düzenle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
