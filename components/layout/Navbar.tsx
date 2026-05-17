'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const chevron = (
  <svg viewBox="0 0 12 12" fill="currentColor" width="12" height="12"><path d="M6 8L1 3h10z"/></svg>
)

function NavSearch() {
  const [q, setQ] = useState('')
  const router = useRouter()
  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/ste?q=${encodeURIComponent(q.trim())}`)
  }
  return (
    <form onSubmit={handleSearch} className="nav-search">
      <button type="submit" aria-label="Ara">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="STE'de Ara…"
        aria-label="Ara"
      />
    </form>
  )
}

export default function Navbar() {
  const [sticky, setSticky] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = document.querySelector('.site-header') as HTMLElement
    const threshold = header?.offsetHeight ?? 72
    const onScroll = () => setSticky(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`site-nav${sticky ? ' sticky' : ''}`} ref={navRef}>
        <div className="nav-inner nav-inner--centered">
          <Link href="/" className="nav-home" aria-label="Ana Sayfa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </Link>
          <div className="nav-divider"/>

          {/* Kurumsal */}
          <div className="nav-item">
            <div className="nav-link">Kurumsal {chevron}</div>
            <div className="dropdown">
              <Link href="/hakkimizda">Hakkımızda</Link>
              <Link href="/tarihce">Tarihçe</Link>
              <Link href="/kurullar">Bilim Kurulu</Link>
            </div>
          </div>

          {/* Etkinlikler (eski Komisyonlar yerine) */}
          <div className="nav-item">
            <div className="nav-link">Etkinlikler {chevron}</div>
            <div className="dropdown">
              <Link href="/haberler">Haberler</Link>
              <Link href="/basin-aciklamalari?kategori=BASIN_ACIKLAMASI">Basın Açıklamaları</Link>
              <Link href="/basin-aciklamalari?kategori=DUYURU">Duyurular</Link>
            </div>
          </div>

          {/* STE Yayınlarımız — direkt link */}
          <Link href="/ste" className="nav-link">STE Yayınlarımız</Link>

          {/* Video Eğitimleri — direkt link */}
          <Link href="/yayinlar?tip=VIDEO" className="nav-link">Video Eğitimleri</Link>

          <Link href="/iletisim" className="nav-link">İletişim</Link>

          {/* Yararlı Bağlantılar */}
          <div className="nav-item">
            <div className="nav-link">Yararlı Bağlantılar {chevron}</div>
            <div className="dropdown">
              <a href="https://www.bto.org.tr" target="_blank" rel="noopener">BTO</a>
              <Link href="/yayinlar?tip=DERGI">Hekimce Bakış</Link>
              <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener">PubMed</a>
              <a href="https://www.escardio.org/" target="_blank" rel="noopener">ESCardio</a>
              <a href="https://www.temd.org.tr/" target="_blank" rel="noopener">TMED</a>
              <a href="https://www.tkd.org.tr/" target="_blank" rel="noopener">TKD (Türk Kardiyoloji Derneği)</a>
              <a href="https://www.thd.org.tr/" target="_blank" rel="noopener">Türk Hematoloji Derneği</a>
            </div>
          </div>

          <Link href="/bagis" className="nav-donate-btn">Bağış Yap</Link>

          <NavSearch />
        </div>

        <button className="hamburger" aria-label="Menü" onClick={() => setMobileOpen(true)}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-wrap"><div className="logo-text"><strong>SÜREKLİ TIP EĞİTİMİ</strong></div></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button>
        </div>
        <div className="mobile-section-title">Ana Menü</div>
        <Link href="/" onClick={() => setMobileOpen(false)}>🏠 Ana Sayfa</Link>
        <div className="mobile-section-title">Kurumsal</div>
        <Link href="/hakkimizda" onClick={() => setMobileOpen(false)}>Hakkımızda</Link>
        <Link href="/tarihce" onClick={() => setMobileOpen(false)}>Tarihçe</Link>
        <Link href="/kurullar" onClick={() => setMobileOpen(false)}>Bilim Kurulu</Link>
        <div className="mobile-section-title">Etkinlikler</div>
        <Link href="/haberler" onClick={() => setMobileOpen(false)}>Haberler</Link>
        <Link href="/basin-aciklamalari?kategori=BASIN_ACIKLAMASI" onClick={() => setMobileOpen(false)}>Basın Açıklamaları</Link>
        <Link href="/basin-aciklamalari?kategori=DUYURU" onClick={() => setMobileOpen(false)}>Duyurular</Link>
        <div className="mobile-section-title">Yayınlar</div>
        <Link href="/ste" onClick={() => setMobileOpen(false)}>STE Yayınlarımız</Link>
        <Link href="/yayinlar?tip=VIDEO" onClick={() => setMobileOpen(false)}>Video Eğitimleri</Link>
        <div className="mobile-section-title">Diğer</div>
        <Link href="/iletisim" onClick={() => setMobileOpen(false)}>İletişim</Link>
        <div className="mobile-section-title">Yararlı Bağlantılar</div>
        <a href="https://www.bto.org.tr" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>BTO</a>
        <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>PubMed</a>
        <a href="https://www.escardio.org/" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>ESCardio</a>
        <a href="https://www.temd.org.tr/" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>TMED</a>
        <a href="https://www.tkd.org.tr/" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>Türk Kardiyoloji Derneği</a>
        <a href="https://www.thd.org.tr/" target="_blank" rel="noopener" onClick={() => setMobileOpen(false)}>Türk Hematoloji Derneği</a>
        <div style={{padding:'16px 20px'}}>
          <Link href="/bagis" onClick={() => setMobileOpen(false)} style={{display:'block',textAlign:'center',background:'var(--red)',color:'#fff',padding:'12px 24px',borderRadius:20,fontWeight:700,fontSize:15}}>Bağış Yap</Link>
        </div>
      </div>
    </>
  )
}
