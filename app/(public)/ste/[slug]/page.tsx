export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const kategori = await prisma.steKategori.findUnique({ where: { slug } })
  if (!kategori) return { title: 'Bulunamadı' }
  return {
    title: `${kategori.name} — STE Yayınları — Bursa Tabip Odası`,
    description: kategori.description || `${kategori.name} uzmanlık alanı eğitim materyalleri ve kurul bilgileri.`,
  }
}

export default async function STEKategoriPage({ params }: Props) {
  const { slug } = await params
  const kategori = await prisma.steKategori.findUnique({
    where: { slug },
    include: {
      kurulUyeleri: { orderBy: { order: 'asc' } },
      materyaller: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!kategori || !kategori.active) notFound()

  const kitaplar = kategori.materyaller.filter(m => m.type === 'KITAP')
  const yayinlar = kategori.materyaller.filter(m => m.type === 'YAYIN')

  return (
    <>
      {/* Breadcrumb + Hero */}
      <section className="ste-detail-hero">
        <div className="section-inner">
          <nav className="ste-breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/ste">STE Yayınları</Link>
            <span>/</span>
            <span>{kategori.name}</span>
          </nav>
          <div className="ste-detail-hero-content">
            <div className="ste-detail-hero-icon">{kategori.iconEmoji || '📋'}</div>
            <div>
              <h1>{kategori.name}</h1>
              {kategori.description && <p>{kategori.description}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Kurul Üyeleri */}
      {kategori.kurulUyeleri.length > 0 && (
        <section className="ste-detail-section">
          <div className="section-inner">
            <div className="ste-detail-section-header">
              <div className="ste-detail-section-icon">👥</div>
              <div>
                <h2>Kurul Üyeleri</h2>
                <p>Bu branşın eğitiminden sorumlu olan uzman hocalar</p>
              </div>
            </div>
            <div className="ste-kurul-grid">
              {kategori.kurulUyeleri.map(u => (
                <div key={u.id} className="ste-kurul-card">
                  <div className="ste-kurul-avatar">
                    {u.photoUrl ? (
                      <img src={u.photoUrl} alt={u.name} />
                    ) : (
                      <div className="ste-kurul-avatar-placeholder">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="ste-kurul-info">
                    <strong>{u.name}</strong>
                    {u.title && <span className="ste-kurul-title">{u.title}</span>}
                    {u.institution && <span className="ste-kurul-inst">{u.institution}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kitaplar */}
      {kitaplar.length > 0 && (
        <section className="ste-detail-section ste-detail-section-alt">
          <div className="section-inner">
            <div className="ste-detail-section-header">
              <div className="ste-detail-section-icon">📖</div>
              <div>
                <h2>Kitaplar</h2>
                <p>Bu alanda önerilen ve odanın bastığı eğitim kitapları</p>
              </div>
            </div>
            <div className="ste-materyal-grid">
              {kitaplar.map(m => (
                <div key={m.id} className="ste-materyal-card">
                  <div className="ste-materyal-cover">
                    {m.coverUrl ? (
                      <img src={m.coverUrl} alt={m.title} />
                    ) : (
                      <div className="ste-materyal-cover-placeholder">📖</div>
                    )}
                  </div>
                  <div className="ste-materyal-body">
                    <h4>{m.title}</h4>
                    {m.author && <span className="ste-materyal-author">{m.author}</span>}
                    {m.description && <p>{m.description}</p>}
                    {m.fileUrl && (
                      <a href={m.fileUrl} target="_blank" className="ste-materyal-link">
                        İncele ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Yeni Yayınlar */}
      {yayinlar.length > 0 && (
        <section className="ste-detail-section">
          <div className="section-inner">
            <div className="ste-detail-section-header">
              <div className="ste-detail-section-icon">📄</div>
              <div>
                <h2>Yeni Yayınlar</h2>
                <p>Bu alandaki güncel makaleler, eğitim notları ve videolar</p>
              </div>
            </div>
            <div className="ste-yayin-list">
              {yayinlar.map(m => (
                <div key={m.id} className="ste-yayin-card">
                  <div className="ste-yayin-icon">📄</div>
                  <div className="ste-yayin-body">
                    <h4>{m.title}</h4>
                    {m.author && <span className="ste-yayin-author">{m.author}</span>}
                    {m.description && <p>{m.description}</p>}
                    {m.publishedAt && (
                      <span className="ste-yayin-date">{new Date(m.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    )}
                  </div>
                  {m.fileUrl && (
                    <a href={m.fileUrl} target="_blank" className="ste-yayin-link">İncele ↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Boş Durum */}
      {kategori.kurulUyeleri.length === 0 && kategori.materyaller.length === 0 && (
        <section className="ste-detail-section" style={{textAlign:'center',padding:'80px 24px'}}>
          <div className="section-inner">
            <div style={{fontSize:64,marginBottom:16}}>📋</div>
            <h3 style={{fontFamily:'var(--serif)',fontSize:24,marginBottom:8}}>İçerik Hazırlanıyor</h3>
            <p style={{color:'var(--gray)',maxWidth:400,margin:'0 auto'}}>Bu uzmanlık alanına ait kurul üyeleri ve materyaller yakında eklenecektir.</p>
          </div>
        </section>
      )}

      {/* Diğer Branşlar CTA */}
      <section className="ste-back-band">
        <div className="section-inner" style={{textAlign:'center'}}>
          <Link href="/ste" className="btn-outlined">← Tüm Uzmanlık Alanlarına Dön</Link>
        </div>
      </section>
    </>
  )
}
