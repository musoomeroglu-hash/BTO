export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HakkimizdaPage() {
  const ykUyeleri = await prisma.yonetimKurulu.findMany({ where: { active: true }, orderBy: { order: 'asc' } })

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">HAKKIMIZDA</div>
          <h1>Bursa Tabip Odası Hakkında</h1>
          <p>1953&apos;ten bu yana Bursa hekimlerinin yanındayız</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'start',marginBottom:64}}>
          <div>
            <h2>Kurumumuz</h2>
            <p>Bursa Tabip Odası, 1953 yılında kuruluşundan bu yana Bursa ilindeki hekimlerin mesleki haklarını koruyan, tıp etiğini gözeten ve toplum sağlığını geliştirmeye çalışan demokratik kitle örgütüdür.</p>
            <p>Türk Tabipleri Birliği bünyesinde faaliyet gösteren odamız, 3.000&apos;den fazla üyesiyle Bursa&apos;nın en büyük sağlık meslek kuruluşlarından biridir.</p>
            <p>Bünyemizdeki 15 komisyon aracılığıyla; sürekli tıp eğitimi, mevzuat takibi, halk sağlığı, çevre sağlığı ve pek çok alanda aktif çalışmalar yürütmekteyiz.</p>
          </div>
          <div>
            <h2>Misyon & Vizyon</h2>
            <p><strong>Misyonumuz:</strong> Üyelerimizin mesleki, özlük ve sosyal haklarını korumak; halkımızın sağlığını geliştirmek için bilimsel, demokratik ve etik değerler çerçevesinde çalışmak.</p>
            <p><strong>Vizyonumuz:</strong> Halkın sağlığını ön planda tutan, hekimlerin onurlu çalışma koşullarına kavuştuğu, sağlıkta eşit ve nitelikli hizmetin sağlandığı bir toplum inşa etmek.</p>
            <div style={{background:'var(--light-bg)',borderRadius:16,padding:24,marginTop:24}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {[['3.000+','Üye Hekim'],['1953','Kuruluş Yılı'],['15','Komisyon'],['70+','Yıllık Deneyim']].map(([num,label])=>(
                  <div key={label} style={{textAlign:'center'}}>
                    <div style={{fontFamily:'var(--serif)',fontSize:36,fontWeight:700,color:'var(--red)'}}>{num}</div>
                    <div style={{fontSize:13,color:'var(--gray)'}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {ykUyeleri.length > 0 && (
          <>
            <h2 style={{marginBottom:24}}>Yönetim Kurulumuz</h2>
            <div className="yk-grid">
              {ykUyeleri.map(m => (
                <div key={m.id} className="yk-card">
                  <div className="yk-photo">
                    {m.photoUrl ? <img src={m.photoUrl} alt={m.name}/> : <div style={{background:'linear-gradient(135deg,#f0e0e0,#d9917e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,height:'100%'}}>👤</div>}
                  </div>
                  <div className="yk-info">
                    <strong style={{color: m.position === 'Başkan' ? 'var(--red)' : 'var(--text)'}}>{m.title} {m.name}</strong>
                    <span>{m.position}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/kurullar" className="btn-outlined" style={{marginTop:32,display:'inline-block'}}>Tüm Kurulları Gör</Link>
          </>
        )}
      </div>
    </>
  )
}
