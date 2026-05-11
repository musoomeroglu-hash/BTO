import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sürekli Tıp Eğitimi Portalı — Bursa Tabip Odası',
  description: 'Bursa Tabip Odası Sürekli Tıp Eğitimi (STE) Portalı. Uzmanlık alanlarına göre eğitim materyalleri, kurul bilgileri ve güncel yayınlara erişin.',
}

async function getSTEData() {
  const [kategoriler, etkinlikler, toplamMateryal] = await Promise.all([
    prisma.steKategori.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { kurulUyeleri: true, materyaller: true } },
      },
    }),
    prisma.etkinlik.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),
    prisma.steMateryal.count(),
  ])
  return { kategoriler, etkinlikler, toplamMateryal }
}

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function STEPortalPage() {
  const { kategoriler, etkinlikler, toplamMateryal } = await getSTEData()

  const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('')

  // Group kategoriler by first letter for A-Z index
  const byLetter: Record<string, typeof kategoriler> = {}
  kategoriler.forEach(k => {
    const first = k.name.charAt(0).toLocaleUpperCase('tr-TR')
    if (!byLetter[first]) byLetter[first] = []
    byLetter[first].push(k)
  })

  return (
    <>
      {/* STE Hero */}
      <section className="ste-hero">
        <div className="ste-hero-bg" />
        <div className="ste-hero-content">
          <div className="ste-hero-badge">🎓 SÜREKLİ TIP EĞİTİMİ</div>
          <h1>Mesleki Eğitim Portalı</h1>
          <p>Bursa Tabip Odası bünyesindeki tüm uzmanlık alanları, eğitim materyalleri ve kurul bilgilerine tek bir portaldan erişin.</p>
          <div className="ste-hero-stats">
            <div className="ste-hero-stat">
              <strong>{kategoriler.length}</strong>
              <span>Uzmanlık Alanı</span>
            </div>
            <div className="ste-hero-stat-divider" />
            <div className="ste-hero-stat">
              <strong>{toplamMateryal}</strong>
              <span>Materyal</span>
            </div>
            <div className="ste-hero-stat-divider" />
            <div className="ste-hero-stat">
              <strong>{kategoriler.reduce((a, k) => a + k._count.kurulUyeleri, 0)}</strong>
              <span>Kurul Üyesi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gündem & Yaklaşan Eğitimler */}
      {etkinlikler.length > 0 && (
        <section className="ste-events">
          <div className="section-inner">
            <div className="section-label">YAKLAŞAN EĞİTİMLER</div>
            <div className="ste-events-grid">
              {etkinlikler.map(e => (
                <Link href={`/etkinlikler/${e.slug}`} key={e.id} className="ste-event-card">
                  <div className="ste-event-date">
                    <span className="ste-event-day">{new Date(e.startDate).getDate()}</span>
                    <span className="ste-event-month">{new Date(e.startDate).toLocaleDateString('tr-TR', { month: 'short' })}</span>
                  </div>
                  <div className="ste-event-info">
                    <h4>{e.title}</h4>
                    <span>{e.location} · {formatEventDate(e.startDate)}</span>
                  </div>
                  <span className="ste-event-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bağış Butonu Bandı */}
      <section className="ste-donate-band">
        <div className="section-inner">
          <div className="ste-donate-card">
            <div className="ste-donate-text">
              <h3>🤝 Eğitim Faaliyetlerimizi Destekleyin</h3>
              <p>Sürekli tıp eğitimi programlarımızın geliştirilmesine katkıda bulunun.</p>
            </div>
            <a href="#" className="ste-donate-btn">
              Bağış Yap ❤️
            </a>
          </div>
        </div>
      </section>

      {/* A-Z İndeksi */}
      <section className="ste-az-section">
        <div className="section-inner">
          <div className="section-label">UZMANLIK ALANLARI</div>
          <h2 className="section-heading">A-Z İndeksi</h2>

          <div className="ste-az-bar">
            {alphabet.map(letter => {
              const has = byLetter[letter]
              return (
                <a
                  key={letter}
                  href={has ? `#letter-${letter}` : undefined}
                  className={`ste-az-letter${has ? ' active' : ''}`}
                >
                  {letter}
                </a>
              )
            })}
          </div>

          {/* Kategoriler by letter */}
          <div className="ste-categories-list">
            {alphabet.filter(l => byLetter[l]).map(letter => (
              <div key={letter} id={`letter-${letter}`} className="ste-letter-group">
                <div className="ste-letter-heading">{letter}</div>
                <div className="ste-letter-items">
                  {byLetter[letter].map(k => (
                    <Link href={`/ste/${k.slug}`} key={k.id} className="ste-category-row">
                      <span className="ste-category-icon">{k.iconEmoji || '📋'}</span>
                      <div className="ste-category-row-info">
                        <strong>{k.name}</strong>
                        {k.description && <span>{k.description}</span>}
                      </div>
                      <div className="ste-category-row-counts">
                        <span>👥 {k._count.kurulUyeleri}</span>
                        <span>📚 {k._count.materyaller}</span>
                      </div>
                      <span className="ste-category-row-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Kartları Grid */}
      <section className="ste-cards-section">
        <div className="section-inner">
          <div className="section-label">TÜM BRANŞLAR</div>
          <h2 className="section-heading">Uzmanlık Alanlarını Keşfedin</h2>

          <div className="ste-cards-grid">
            {kategoriler.map(k => (
              <Link href={`/ste/${k.slug}`} key={k.id} className="ste-card">
                <div className="ste-card-icon">{k.iconEmoji || '📋'}</div>
                <h3>{k.name}</h3>
                {k.description && <p>{k.description.length > 80 ? k.description.slice(0, 80) + '…' : k.description}</p>}
                <div className="ste-card-footer">
                  <span>👥 {k._count.kurulUyeleri} Kurul Üyesi</span>
                  <span>📚 {k._count.materyaller} Materyal</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
