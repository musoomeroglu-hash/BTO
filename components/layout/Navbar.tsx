'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const chevron = (
  <svg viewBox="0 0 12 12" fill="currentColor" width="12" height="12"><path d="M6 8L1 3h10z"/></svg>
)

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
        <div className="nav-inner">
          <Link href="/" className="nav-home" aria-label="Ana Sayfa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </Link>
          <div className="nav-divider"/>

          <div className="nav-item">
            <div className="nav-link">Kurumsal {chevron}</div>
            <div className="dropdown">
              <Link href="/hakkimizda">Hakkımızda</Link>
              <Link href="/tarihce">Tarihçe</Link>
              <div className="dropdown-section">Kurullar</div>
              <Link href="/kurullar#yonetim" style={{paddingLeft:28}}>→ Yönetim Kurulu</Link>
              <Link href="/kurullar#denetleme" style={{paddingLeft:28}}>→ Denetleme Kurulu</Link>
              <Link href="/kurullar#onur" style={{paddingLeft:28}}>→ Onur Kurulu</Link>
              <Link href="/unutamadiklari">Unutamadıklarımız</Link>
              <div className="dropdown-section">Bağlantılar</div>
              <Link href="/baglantilar">Yararlı Bağlantılar</Link>
            </div>
          </div>

          <div className="nav-item">
            <div className="nav-link">Komisyonlar {chevron}</div>
            <div className="dropdown wide">
              {[
                ['Özel Hekimlik Komisyonu','ozel-hekimlik'],
                ['Sürekli Tıp Eğitimi Komisyonu','sureklitip-egitimi'],
                ['Yayın Kurulu','yayin-kurulu'],
                ['Burs Komisyonu','burs'],
                ['Çevre Komisyonu','cevre'],
                ['Aile Hekimliği Komisyonu','aile-hekimligi'],
                ['İşçi Sağlığı Komisyonu','isci-sagligi'],
                ['Kültür-Sanat Komisyonu','kultur-sanat'],
                ['Spor Komisyonu','spor'],
                ['İnsan Hakları Komisyonu','insan-haklari'],
                ['Sağlık Politikaları Komisyonu','saglik-politikalari'],
                ['Olağandışı Durumlar Komisyonu','olagandisi-durumlar'],
                ['Kadın Hekimlik Komisyonu','kadin-hekimlik'],
                ['Emekli Hekimler Komisyonu','emekli-hekimler'],
                ['Halk Sağlığı Komisyonu','halk-sagligi'],
              ].map(([name, slug]) => (
                <Link key={slug} href={`/komisyonlar/${slug}`}>{name}</Link>
              ))}
            </div>
          </div>

          <div className="nav-item">
            <div className="nav-link">Mevzuat {chevron}</div>
            <div className="dropdown">
              <Link href="/mevzuat?kategori=Asgari Ücret">Asgari Ücret Katsayıları</Link>
              <Link href="/mevzuat">Mevzuat</Link>
            </div>
          </div>

          <div className="nav-item">
            <div className="nav-link">Yayınlarımız {chevron}</div>
            <div className="dropdown">
              <Link href="/yayinlar?tip=DERGI">Hekimce Bakış Dergisi</Link>
              <Link href="/yayinlar?tip=BROSUR">Broşürler</Link>
              <Link href="/yayinlar?tip=AFIS">Afişler</Link>
            </div>
          </div>

          <Link href="/ste" className="nav-link" style={{color:'var(--red)',fontWeight:700}}>🎓 STE Portalı</Link>

          <Link href="/basin-aciklamalari" className="nav-link">Basın Açıklamaları</Link>

          <div className="nav-item">
            <div className="nav-link">Üyelik {chevron}</div>
            <div className="dropdown">
              <Link href="/uyelik#yonerge">TTB Üyelik İşleri Yönergesi</Link>
              <Link href="/uyelik#aidat">Aidatınızı Nasıl Ödeyebilirsiniz?</Link>
              <Link href="/uyelik#2026">2026 Yılı İçin Gerekli Ödemeler</Link>
              <Link href="/uyelik#form">Üye Kayıt Formu</Link>
              <Link href="/uyelik#belgeler">Üyelik İçin Gerekli Belgeler</Link>
              <Link href="/uyelik#kimlik">TTB Kimliği Talebi</Link>
            </div>
          </div>

          <Link href="/iletisim" className="nav-link">İletişim</Link>
        </div>

        <button className="hamburger" aria-label="Menü" onClick={() => setMobileOpen(true)}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-wrap"><div className="logo-text"><strong>BURSA TABİP ODASI</strong></div></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button>
        </div>
        <div className="mobile-section-title">Ana Menü</div>
        <Link href="/" onClick={() => setMobileOpen(false)}>🏠 Ana Sayfa</Link>
        <div className="mobile-section-title">Kurumsal</div>
        <Link href="/hakkimizda" onClick={() => setMobileOpen(false)}>Hakkımızda</Link>
        <Link href="/tarihce" onClick={() => setMobileOpen(false)}>Tarihçe</Link>
        <Link href="/kurullar" onClick={() => setMobileOpen(false)}>Kurullar</Link>
        <Link href="/unutamadiklari" onClick={() => setMobileOpen(false)}>Unutamadıklarımız</Link>
        <Link href="/baglantilar" onClick={() => setMobileOpen(false)}>Yararlı Bağlantılar</Link>
        <div className="mobile-section-title">Komisyonlar</div>
        <Link href="/komisyonlar" onClick={() => setMobileOpen(false)}>Tüm Komisyonlar</Link>
        <div className="mobile-section-title">Diğer</div>
        <Link href="/mevzuat" onClick={() => setMobileOpen(false)}>Mevzuat</Link>
        <Link href="/yayinlar" onClick={() => setMobileOpen(false)}>Yayınlarımız</Link>
        <Link href="/basin-aciklamalari" onClick={() => setMobileOpen(false)}>Basın Açıklamaları</Link>
        <div className="mobile-section-title">Eğitim</div>
        <Link href="/ste" onClick={() => setMobileOpen(false)} style={{color:'var(--red)',fontWeight:600}}>🎓 STE Portalı</Link>
        <Link href="/uyelik" onClick={() => setMobileOpen(false)}>Üyelik</Link>
        <Link href="/iletisim" onClick={() => setMobileOpen(false)}>İletişim</Link>
      </div>
    </>
  )
}
