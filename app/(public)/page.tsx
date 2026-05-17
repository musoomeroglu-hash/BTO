export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/Hero'
import EBultenSection from '@/components/sections/EBulten'
import QuizSection from '@/components/sections/QuizSection'
import ScrollReveal from '@/components/ScrollReveal'
import EtkinlikCarousel from '@/components/sections/EtkinlikCarousel'
import STESearchBar from '@/components/sections/STESearchBar'
import UsefulLinks from '@/components/sections/UsefulLinks'

async function getHomeData() {
  const [haberler, etkinlikler, quiz, yayinlar, ykUyeleri, steKategoriler] = await Promise.all([
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
    prisma.steKategori.findMany({
      where: { active: true },
      include: { _count: { select: { materyaller: true } } },
    }),
  ])
  return { haberler, etkinlikler, quiz, yayinlar, ykUyeleri, steKategoriler }
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function HomePage() {
  const { haberler, etkinlikler, quiz, yayinlar, ykUyeleri, steKategoriler } = await getHomeData()

  const steAlphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('')
  const steByLetter: Record<string, boolean> = {}
  steKategoriler.forEach(k => {
    steByLetter[k.name.charAt(0).toLocaleUpperCase('tr-TR')] = true
  })
  const featuredSte = shuffleArray(steKategoriler).slice(0, 3)

  return (
    <>
      <HeroSection />

      {/* Etkinlikler Carousel — Hero'dan hemen sonra */}
      {etkinlikler.length > 0 && (
        <ScrollReveal>
          <section className="home-etkinlik-carousel-section">
            <div className="section-inner">
              <div className="section-label">ETKİNLİKLER</div>
              <div className="section-header-row">
                <h2 className="section-heading">Yaklaşan Etkinliklerimiz</h2>
                <Link href="/basin-aciklamalari" className="btn-outlined">Tüm Etkinlikler →</Link>
              </div>
              <EtkinlikCarousel etkinlikler={etkinlikler} />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* STE Yayınları */}
      <section className="home-ste-section">
        <div className="section-inner">
          <STESearchBar />
          <div className="home-ste-header">
            <div>
              <div className="section-label">SÜREKLİ TIP EĞİTİMİ</div>
              <h2 className="section-heading">STE Yayınları — Branşınızı Keşfedin</h2>
            </div>
            <Link href="/ste" className="btn-outlined" style={{flexShrink:0}}>Tüm Yayınlar →</Link>
          </div>

          {/* A-Z Bar */}
          <div className="home-ste-az-bar">
            {steAlphabet.map(letter => (
              <Link
                key={letter}
                href={steByLetter[letter] ? `/ste#letter-${letter}` : '/ste'}
                className={`home-ste-az-btn${steByLetter[letter] ? ' active' : ' disabled'}`}
                tabIndex={steByLetter[letter] ? 0 : -1}
              >
                {letter}
              </Link>
            ))}
          </div>

          {/* 3 Rastgele Kategori Kartı */}
          <div className="home-ste-cards">
            {featuredSte.map(k => (
              <Link href={`/ste/${k.slug}`} key={k.id} className="home-ste-card">
                <div className="home-ste-card-icon">{k.iconEmoji || '📋'}</div>
                <div className="home-ste-card-body">
                  <h3>{k.name}</h3>
                  {k.description && <p>{k.description.length > 90 ? k.description.slice(0, 90) + '…' : k.description}</p>}
                  <span className="home-ste-card-count">📚 {k._count.materyaller} materyal</span>
                </div>
                <span className="home-ste-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Haberler */}
      <ScrollReveal>
        <section className="sicak-gundem">
          <div className="section-inner">
            <div className="section-label">HABERLER</div>
            <h2 className="section-heading" style={{color:'var(--white)'}}>Güncel Haberler</h2>
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

      {/* Etkinlikler Grid */}
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
                  {e.imageUrl ? <img src={e.imageUrl} alt={e.title}/> : <div style={{background:'linear-gradient(135deg,#2a3a6a,#c44)',width:'100%',height:'100%'}}/>}
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
              <p>Bursa Tabip Odası, Bursa&apos;daki 3.000&apos;den fazla hekimi temsil eden ve Türk Tabipleri Birliği&apos;ne bağlı meslek kuruluşudur. 1953 yılından bu yana hekimlerin haklarını korumak, tıp etiğini yükseltmek ve toplum sağlığını geliştirmek için çalışmaktayız.</p>
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

      {/* Yararlı Bağlantılar */}
      <ScrollReveal>
        <UsefulLinks />
      </ScrollReveal>
    </>
  )
}
