export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminSTEPage() {
  const kategoriler = await prisma.steKategori.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { kurulUyeleri: true, materyaller: true } },
    },
  })

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>STE Portalı Yönetimi</h1>
        <Link href="/admin/ste/yeni" className="admin-btn admin-btn-primary">+ Yeni Kategori</Link>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
        {kategoriler.map(k => (
          <Link href={`/admin/ste/${k.id}`} key={k.id} style={{textDecoration:'none'}}>
            <div className="admin-card" style={{padding:24,cursor:'pointer',transition:'all 0.2s',border:k.active?'2px solid transparent':'2px solid #fee2e2',position:'relative',overflow:'hidden'}}>
              {!k.active && <span className="badge badge-red" style={{position:'absolute',top:12,right:12}}>Pasif</span>}
              <div style={{fontSize:40,marginBottom:12}}>{k.iconEmoji || '📋'}</div>
              <h3 style={{fontFamily:'var(--serif)',fontSize:18,fontWeight:700,marginBottom:8,color:'var(--text)'}}>{k.name}</h3>
              {k.description && <p style={{fontSize:13,color:'var(--gray)',lineHeight:1.5,marginBottom:16}}>{k.description.length>100?k.description.slice(0,100)+'…':k.description}</p>}
              <div style={{display:'flex',gap:16,fontSize:12,color:'var(--gray)'}}>
                <span>👥 {k._count.kurulUyeleri} Kurul Üyesi</span>
                <span>📚 {k._count.materyaller} Materyal</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {kategoriler.length === 0 && (
        <div className="admin-card" style={{textAlign:'center',padding:64}}>
          <div style={{fontSize:64,marginBottom:16}}>🎓</div>
          <h3 style={{fontFamily:'var(--serif)',fontSize:24,marginBottom:8}}>Henüz Kategori Yok</h3>
          <p style={{color:'var(--gray)',marginBottom:24}}>STE Portalı için uzmanlık branşlarını eklemeye başlayın.</p>
          <Link href="/admin/ste/yeni" className="admin-btn admin-btn-primary">+ İlk Kategoriyi Oluştur</Link>
        </div>
      )}
    </div>
  )
}
