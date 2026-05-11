export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function YayinlarPage({ searchParams }: { searchParams: Promise<{ tip?: string }> }) {
  const sp = await searchParams
  const tip = sp.tip

  const yayinlar = await prisma.yayin.findMany({
    where: tip ? { type: tip as 'DERGI'|'BROSUR'|'AFIS' } : {},
    orderBy: { publishedAt: 'desc' },
  })

  const tabs = [
    { label: 'Tümü', val: undefined },
    { label: 'Hekimce Bakış', val: 'DERGI' },
    { label: 'Broşürler', val: 'BROSUR' },
    { label: 'Afişler', val: 'AFIS' },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">YAYINLAR</div>
          <h1>Yayınlarımız</h1>
          <p>Hekimce Bakış dergisi, broşürler ve afişlerimiz</p>
        </div>
      </div>
      <div className="page-content">
        <div className="filter-bar" style={{marginBottom:32}}>
          {tabs.map(t => (
            <Link key={t.label} href={t.val ? `/yayinlar?tip=${t.val}` : '/yayinlar'} className={`filter-btn${(!tip && !t.val) || tip === t.val ? ' active' : ''}`}>
              {t.label}
            </Link>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24}}>
          {yayinlar.map(y => (
            <div key={y.id} style={{background:'var(--white)',borderRadius:16,overflow:'hidden',boxShadow:'var(--shadow)'}}>
              <div style={{height:240,background:'linear-gradient(135deg,#1a2a4a,#8B0000)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>
                {y.coverUrl ? <img src={y.coverUrl} alt={y.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '📖'}
              </div>
              <div style={{padding:16}}>
                {y.issueNumber && <span className="card-badge" style={{marginBottom:8,display:'inline-block'}}>Sayı {y.issueNumber}</span>}
                <h3 style={{fontFamily:'var(--serif)',fontSize:16,fontWeight:700,marginBottom:8,lineHeight:1.4}}>{y.title}</h3>
                <p style={{fontSize:12,color:'var(--gray)',marginBottom:12}}>{new Date(y.publishedAt).toLocaleDateString('tr-TR',{month:'long',year:'numeric'})}</p>
                {y.fileUrl && (
                  <a href={y.fileUrl} target="_blank" rel="noopener" className="btn-outlined" style={{fontSize:12,padding:'6px 16px'}}>PDF İndir</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
