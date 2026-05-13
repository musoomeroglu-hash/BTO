export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/Hero'
import EBultenSection from '@/components/sections/EBulten'
import QuizSection from '@/components/sections/QuizSection'
import ScrollReveal from '@/components/ScrollReveal'

async function getHomeData() {
  const [haberler, etkinlikler, quiz, yayinlar, ykUyeleri] = await Promise.all([
    prisma.haber.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { author: { select: { name: true } } },
    }),
    prisma.etkinlik.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 4,
    }),
    prisma.quiz.findFirst({ where: { active: true }, orderBy: { weekDate: 'desc' } }),
    prisma.yayin.findMany({
      where: { type: 'DERGI' },
      orderBy: { publishedAt: 'desc' },
      take: 8,
    }),
    prisma.yonetimKurulu.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 5,
    }),
  ])
  return { haberler, etkinlikler, quiz, yayinlar, ykUyeleri }
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function HomePage() {
  const { haberler, etkinlikler, quiz, yayinlar, ykUyeleri } = await getHomeData()

  return (
    <>
      <HeroSection />

      {/* Sign-in Band */}
      <section className="signin-band">
        <div className="sphere sphere-dark-red" style={{width:80,height:80,top:-20,left:-20,opacity:.6}}/>
        <div className="sphere sphere-pink" style={{width:60,height:60,bottom:-15,right:40,opacity:.7}}/>
        <div className="signin-band-inner">
          <p>Hoş geldiniz! Kişiselleştirilmiş bir deneyim için giriş yapın.</p>
          <Link href="/admin/giris" className="signin-band-btn">Giriş Yap →</Link>
        </div>
      </section>

      {/* Sıcak Gündem */}
      <ScrollReveal>
        <section className="sicak-gundem">
          <div className="section-inner">
            <div className="section-label">SICAK GÜNDEM</div>
            <h2 className="section-heading" style={{color:'var(--white)'}}>Bilimden etkinliklere, her şey burada</h2>
            <div className="gundem-grid">
              {haberler.map(h => (
                <div key={h.id} className="gundem-card gundem-equal">
                  {h.imageUrl ? (
                    <img src={h.imageUrl} alt={h.title} className="gundem-card-img"/>
                  ) : (
                    <div className="gundem-card-img-placeholder" style={{background:'linear-gradient(135deg,#3a3a5c,#1a1a3a)'}}/>
                  )}
                  <div className="gundem-card-body">
                    <span className="card-badge">{h.category === 'BASIN_ACIKLAMASI' ? 'Basın Açıklaması' : 'Haber'}</span>
                    <h3>{h.title}</h3>
                    {h.excerpt && <p>{h.excerpt}</p>}
                    <Link href={`/haberler/${h.slug}`} className="card-link-btn">Devamını Oku →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center', marginTop: 32}}>
              <Link href="/haberler" className="btn-outlined">Tüm Haberleri Gör →</Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal><EBultenSection /></ScrollReveal>

      {/* Etkinlikler */}
      <ScrollReveal><section className="etkinlikler-section">
        <div className="section-inner">
          <div className="section-label">ETKİNLİKLER</div>
          <div className="section-header-row">
            <h2 className="section-heading">Etkinliklerimiz bizi bir araya getiriyor</h2>
            <Link href="/etkinlikler" className="btn-outlined">Tüm Etkinlikleri Gör</Link>
          </div>
          <div className="etkinlikler-grid">
            {etkinlikler.length > 0 ? etkinlikler.map(e => (
              <Link href={`/etkinlikler/${e.slug}`} key={e.id} className="etkinlik-card">
                <div className="etkinlik-card-img">
                  {e.imageUrl ? <img src={e.imageUrl} alt={e.title}/> : <div style={{background:`hsl(${Math.random()*60+200},40%,30%)`,width:'100%',height:'100%'}}/>}
                </div>
                <div className="etkinlik-card-body">
                  <div className="etkinlik-meta">{e.location} · {formatEventDate(e.startDate)}</div>
                  <h4>{e.title}</h4>
                </div>
              </Link>
            )) : (
              <p style={{color:'var(--gray)',gridColumn:'1/-1'}}>Yaklaşan etkinlik bulunmuyor.</p>
            )}
          </div>
        </div>
      </section></ScrollReveal>

      {/* Hekimce Bakış */}
      {yayinlar.length > 0 && (
        <ScrollReveal><section className="hekimce-section">
          <div className="section-inner">
            <div className="section-label">HEKİMCE BAKIŞ</div>
            <h2 className="section-heading">Dergimizin son sayısından öne çıkan yazılar</h2>
            <div className="hekimce-grid">
              {yayinlar.map(y => (
                <div key={y.id} className="hekimce-card">
                  {y.coverUrl && <img src={y.coverUrl} alt={y.title} className="hekimce-cover"/>}
                  <div className="hekimce-body">
                    <Link href={y.fileUrl ?? '/yayinlar'} className="hekimce-title">
                      {y.title} <span>↗</span>
                    </Link>
                    <div className="hekimce-meta">
                      <span className="card-badge small">Hekimce Bakış</span>
                      <span>{formatDate(y.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section></ScrollReveal>
      )}

      {quiz && <ScrollReveal><QuizSection quiz={quiz} /></ScrollReveal>}

      {/* Hakkımızda */}
      <ScrollReveal><section className="hakkimizda-section">
        <div className="section-inner">
          <div className="hakkimizda-grid">
            <div className="hakkimizda-text">
              <div className="section-label">HAKKIMIZDA</div>
              <h2 className="section-heading">Bilim ile yol alan, hastalar için birleşen</h2>
              <p>Bursa Tabip Odası, Bursa'daki 3.000'den fazla hekimi temsil eden ve Türk Tabipleri Birliği'ne bağlı meslek kuruluşudur. 1953 yılından bu yana hekimlerin haklarını korumak, tıp etiğini yükseltmek ve toplum sağlığını geliştirmek için çalışmaktayız.</p>
              <p style={{marginTop:16}}>Bünyemizdeki 15 komisyon ve seçilmiş yönetim kurulumuzla; eğitim, mevzuat, araştırma ve savunuculuk alanlarında faaliyet gösteriyoruz.</p>
              <Link href="/hakkimizda" className="btn-outlined" style={{marginTop:24,display:'inline-block'}}>Daha Fazla Bilgi →</Link>
            </div>
            <div className="hakkimizda-photo-wrap">
              <div className="sphere sphere-red" style={{width:100,height:100,top:-20,right:-10,zIndex:2}}/>
              <div className="sphere sphere-pink" style={{width:70,height:70,bottom:20,left:-20,zIndex:2}}/>
              <div className="hakkimizda-photo">
                <img src="/images/hakkimizda.png" alt="BTO Hakkımızda" style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
            </div>
          </div>

          {ykUyeleri.length > 0 && (
            <div className="yk-section">
              <h3 style={{fontFamily:'var(--serif)',fontSize:24,marginBottom:24}}>Yönetim Kurulumuz</h3>
              <div className="yk-grid">
                {ykUyeleri.map(m => (
                  <div key={m.id} className="yk-card">
                    <div className="yk-photo">
                      {m.photoUrl ? <img src={m.photoUrl} alt={m.name}/> : <div style={{background:'linear-gradient(135deg,#f0e0e0,#d9917e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>👤</div>}
                    </div>
                    <div className="yk-info">
                      <strong style={{color: m.position === 'Başkan' ? 'var(--red)' : 'var(--text)'}}>{m.title} {m.name}</strong>
                      <span>{m.position}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/kurullar" className="btn-outlined" style={{marginTop:24,display:'inline-block'}}>Yönetim Kurulu&apos;nu Gör</Link>
            </div>
          )}
        </div>
      </section></ScrollReveal>

      {/* Topluluğa Katıl */}
      <ScrollReveal>
        <section className="community-section">
          <div className="section-inner">
            <div className="community-card">
              <div className="sphere sphere-red" style={{width:120,height:120,top:-30,right:80,opacity:.9}}/>
              <div className="sphere sphere-pink" style={{width:80,height:80,bottom:-20,right:20,opacity:.8}}/>
              <div className="community-content">
                <h2>Topluluğumuza Katılın</h2>
                <p>Bursa Tabip Odası üyesi olarak mesleki haklarınızı güvence altına alın, eğitim olanaklarından yararlanın ve sağlık politikalarının şekillenmesinde söz sahibi olun.</p>
                <Link href="/uyelik" className="community-btn">Keşfet →</Link>
              </div>
              <div className="community-photo">
                <img src="/images/topluluk.png" alt="Topluluğa Katıl" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
