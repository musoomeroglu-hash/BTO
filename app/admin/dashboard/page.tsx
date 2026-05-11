import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const [totalHaber, thisMonthHaber, totalEtkinlik, upcomingEtkinlik, totalAbone, unreadMesaj, sonHaberler, sonMesajlar] = await Promise.all([
    prisma.haber.count(),
    prisma.haber.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.etkinlik.count(),
    prisma.etkinlik.count({ where: { startDate: { gte: now }, published: true } }),
    prisma.bultenAbone.count(),
    prisma.iletisimMesaji.count({ where: { read: false } }),
    prisma.haber.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { author: { select: { name: true } } } }),
    prisma.iletisimMesaji.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])
  return { totalHaber, thisMonthHaber, totalEtkinlik, upcomingEtkinlik, totalAbone, unreadMesaj, sonHaberler, sonMesajlar }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Toplam Haber', value: stats.totalHaber, sub: `Bu ay: +${stats.thisMonthHaber}`, icon: '📰', href: '/admin/haberler' },
    { label: 'Etkinlik', value: stats.totalEtkinlik, sub: `Yaklaşan: ${stats.upcomingEtkinlik}`, icon: '📅', href: '/admin/etkinlikler' },
    { label: 'E-Bülten Abone', value: stats.totalAbone, sub: 'Toplam kayıtlı', icon: '📧', href: '/admin/bulten' },
    { label: 'Okunmamış Mesaj', value: stats.unreadMesaj, sub: 'Bekleyen', icon: '💬', href: '/admin/iletisim' },
  ]

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
        <h1 style={{marginBottom:0}}>Dashboard</h1>
        <Link href="/admin/haberler/yeni" className="admin-btn admin-btn-primary">+ Yeni Haber</Link>
      </div>

      <div className="stat-cards">
        {statCards.map(s => (
          <Link href={s.href} key={s.label} className="stat-card" style={{textDecoration:'none',display:'block'}}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-sub">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24}}>
        <div className="admin-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h2 style={{fontFamily:'var(--serif)',fontSize:20,fontWeight:700}}>Son Haberler</h2>
            <Link href="/admin/haberler" style={{fontSize:13,color:'var(--red)',fontWeight:600}}>Tümünü Gör →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Yazar</th>
                <th>Tarih</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {stats.sonHaberler.map(h => (
                <tr key={h.id}>
                  <td><Link href={`/admin/haberler/${h.id}`} style={{color:'var(--text)',fontWeight:500}}>{h.title.length>60?h.title.slice(0,60)+'…':h.title}</Link></td>
                  <td style={{color:'var(--gray)'}}>{h.author.name}</td>
                  <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{new Date(h.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td><span className={`badge ${h.published ? 'badge-green' : 'badge-gray'}`}>{h.published ? 'Yayında' : 'Taslak'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h2 style={{fontFamily:'var(--serif)',fontSize:20,fontWeight:700}}>Son Mesajlar</h2>
          </div>
          {stats.sonMesajlar.map(m => (
            <div key={m.id} style={{padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                <strong style={{fontSize:14}}>{m.name}</strong>
                {!m.read && <span className="badge badge-red">Yeni</span>}
              </div>
              <p style={{fontSize:13,color:'var(--gray)',lineHeight:1.4}}>{m.message.length>80?m.message.slice(0,80)+'…':m.message}</p>
              <span style={{fontSize:11,color:'var(--gray)'}}>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
