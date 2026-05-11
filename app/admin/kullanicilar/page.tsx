import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminKullanicilarPage() {
  const session = await auth()
  if (session?.user.role !== 'SUPER_ADMIN') redirect('/admin/dashboard')

  const users = await prisma.user.findMany({
    select: { id:true, name:true, email:true, username:true, role:true, active:true, lastLogin:true, createdAt:true, komisyon:{ select:{ name:true } } },
    orderBy: { createdAt: 'desc' },
  })

  const roleBadge: Record<string, string> = {
    SUPER_ADMIN: 'badge-red',
    EDITOR: 'badge-orange',
    MODERATOR: 'badge-green',
    KOMISYON_YONETICISI: 'badge-gray',
    VIEWER: 'badge-gray',
  }

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>Kullanıcılar</h1>
        <Link href="/admin/kullanicilar/yeni" className="admin-btn admin-btn-primary">+ Yeni Kullanıcı</Link>
      </div>
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead>
            <tr><th>Ad</th><th>Kullanıcı Adı</th><th>E-posta</th><th>Rol</th><th>Komisyon</th><th>Son Giriş</th><th>Durum</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{fontWeight:500}}>{u.name}</td>
                <td style={{color:'var(--gray)'}}>{u.username}</td>
                <td style={{color:'var(--gray)'}}>{u.email}</td>
                <td><span className={`badge ${roleBadge[u.role] ?? 'badge-gray'}`}>{u.role}</span></td>
                <td style={{color:'var(--gray)'}}>{u.komisyon?.name ?? '—'}</td>
                <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('tr-TR') : '—'}</td>
                <td><span className={`badge ${u.active ? 'badge-green' : 'badge-gray'}`}>{u.active ? 'Aktif' : 'Pasif'}</span></td>
                <td><Link href={`/admin/kullanicilar/${u.id}`} className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Düzenle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
