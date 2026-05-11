export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

const tarihceData = [
  { yil: 1953, baslik: 'Kuruluş', aciklama: 'Bursa Tabip Odası, Türk Tabipleri Birliği\'nin kurucu odaları arasında yer alarak faaliyete geçti.' },
  { yil: 1960, baslik: 'İlk Binaya Taşınış', aciklama: 'Oda, Bursa\'nın merkezinde kalıcı bir binaya kavuştu.' },
  { yil: 1980, baslik: 'Komisyonların Kurulması', aciklama: 'Çeşitli uzmanlık komisyonları kurularak çalışmalar daha sistematik bir yapıya kavuştu.' },
  { yil: 1990, baslik: 'Sürekli Tıp Eğitimi', aciklama: 'Sürekli tıp eğitimi etkinlikleri kapsamlı şekilde düzenlenmeye başlandı.' },
  { yil: 2000, baslik: 'Dijitalleşme', aciklama: 'Web sitesi ve elektronik iletişim altyapısı kuruldu.' },
  { yil: 2010, baslik: 'Yeni Yerleşke', aciklama: 'Akademik Odalar Yerleşkesi\'ne taşınılarak üyelere daha geniş hizmet imkânı sağlandı.' },
  { yil: 2020, baslik: 'Pandemi Dönemi', aciklama: 'COVID-19 pandemisinde hekimlerin haklarını koruyan açıklamalar ve destek programları hayata geçirildi.' },
  { yil: 2026, baslik: 'Dijital Dönüşüm', aciklama: 'Yeni web platformu ve dijital hizmetlerle üyelere daha etkin erişim sağlandı.' },
]

export default async function TarihcePage() {
  const ykBaskanlar = await prisma.yonetimKurulu.findMany({
    where: { position: 'Başkan' },
    orderBy: { startYear: 'desc' },
  })

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">TARİHÇE</div>
          <h1>Tarihçemiz</h1>
          <p>1953&apos;ten 2026&apos;ya uzanan 70 yıllık köklü geçmişimiz</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{maxWidth:800,margin:'0 auto'}}>
          {tarihceData.map((item, i) => (
            <div key={item.yil} style={{display:'flex',gap:32,marginBottom:32,alignItems:'flex-start'}}>
              <div style={{width:80,flexShrink:0,textAlign:'right'}}>
                <span style={{fontFamily:'var(--serif)',fontSize:24,fontWeight:700,color:'var(--red)'}}>{item.yil}</span>
              </div>
              <div style={{position:'relative',paddingLeft:32}}>
                <div style={{position:'absolute',left:0,top:8,width:12,height:12,borderRadius:'50%',background:'var(--red)'}}/>
                {i < tarihceData.length - 1 && <div style={{position:'absolute',left:5,top:20,width:2,height:'calc(100% + 32px)',background:'var(--border)'}}/>}
                <h3 style={{fontFamily:'var(--serif)',fontSize:20,fontWeight:700,marginBottom:8}}>{item.baslik}</h3>
                <p style={{color:'var(--body)',lineHeight:1.7}}>{item.aciklama}</p>
              </div>
            </div>
          ))}
        </div>

        {ykBaskanlar.length > 0 && (
          <div style={{marginTop:64}}>
            <h2 style={{marginBottom:32}}>Yönetim Kurulu Başkanları</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {ykBaskanlar.map(b => (
                <div key={b.id} style={{background:'var(--light-bg)',borderRadius:12,padding:20,display:'flex',gap:16,alignItems:'center'}}>
                  <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#f0e0e0,#d9917e)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>👤</div>
                  <div>
                    <strong style={{display:'block',fontSize:14}}>{b.title} {b.name}</strong>
                    <span style={{fontSize:12,color:'var(--gray)'}}>{b.startYear}{b.endYear ? ` — ${b.endYear}` : ' — günümüz'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
