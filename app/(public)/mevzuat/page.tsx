export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MevzuatPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const sp = await searchParams
  const kategori = sp.kategori

  const mevzuat = await prisma.mevzuat.findMany({
    where: kategori ? { category: kategori } : {},
    orderBy: { publishedAt: 'desc' },
  })

  const kategoriler = await prisma.mevzuat.groupBy({ by: ['category'] })

  const grouped: Record<string, typeof mevzuat> = {}
  for (const m of mevzuat) {
    if (!grouped[m.category]) grouped[m.category] = []
    grouped[m.category].push(m)
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">MEVZUAT</div>
          <h1>Mevzuat</h1>
          <p>Hekimler için güncel yasa, yönetmelik ve ücret bilgileri</p>
        </div>
      </div>
      <div className="page-content">
        <div className="filter-bar" style={{marginBottom:32}}>
          <Link href="/mevzuat" className={`filter-btn${!kategori ? ' active' : ''}`}>Tümü</Link>
          {kategoriler.map(k => (
            <Link key={k.category} href={`/mevzuat?kategori=${encodeURIComponent(k.category)}`} className={`filter-btn${kategori === k.category ? ' active' : ''}`}>
              {k.category}
            </Link>
          ))}
        </div>
        {Object.entries(grouped).map(([kat, items]) => (
          <div key={kat} style={{marginBottom:48}}>
            <h2 style={{fontFamily:'var(--serif)',fontSize:22,fontWeight:700,marginBottom:20,paddingBottom:12,borderBottom:'2px solid var(--red)'}}>
              {kat}
            </h2>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {items.map(m => (
                <div key={m.id} style={{background:'var(--white)',borderRadius:12,padding:20,boxShadow:'var(--shadow)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
                  <div>
                    <h3 style={{fontSize:16,fontWeight:600,marginBottom:4}}>{m.title}</h3>
                    <span style={{fontSize:12,color:'var(--gray)'}}>{new Date(m.publishedAt).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</span>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noopener" className="btn-outlined" style={{fontSize:12,padding:'6px 14px'}}>PDF İndir</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {mevzuat.length === 0 && <p style={{color:'var(--gray)'}}>Mevzuat bulunamadı.</p>}
      </div>
    </>
  )
}
