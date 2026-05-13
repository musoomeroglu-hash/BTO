'use client'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo-wrap">
          <svg className="logo-svg" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="24" fill="#FDF5F3" stroke="#D2232A" strokeWidth="1.5"/>
            <rect x="23.5" y="8" width="3" height="34" rx="1.5" fill="#4A4A4A"/>
            <path d="M26.5 12 Q32 16 26.5 20 Q21 24 26.5 28 Q32 32 26.5 36" stroke="#2D7A2D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="27" cy="12" rx="3" ry="2.5" fill="#2D7A2D" transform="rotate(-10 27 12)"/>
            <path d="M10 30 Q8 22 14 18 Q10 22 12 28 Z" fill="#D2232A"/>
          </svg>
          <div className="logo-text">
            <strong>BURSA TABİP ODASI</strong>
            <span>MEDICAL CHAMBER OF BURSA</span>
          </div>
        </Link>

        <div className="header-links">
          <a href="https://www.bto.org.tr" target="_blank" rel="noopener">bto.org.tr</a>
          <a href="https://www.ttb.org.tr" target="_blank" rel="noopener">TTB</a>
          <Link href="/yayinlar">E-Bülten</Link>
        </div>

        <div className="header-search">
          <form action="/haberler" method="get">
            <input type="text" name="q" placeholder="BTO'da Ara…" />
            <button type="submit" aria-label="Ara">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>
        </div>

        <div className="header-actions">
          <Link href="/haberler" className="btn-outline">Haberler</Link>
          <Link href="/uyelik" className="btn-outline">Üyelik</Link>
        </div>

        <button className="hamburger" id="hamburgerBtn" aria-label="Menü" onClick={() => {
          document.getElementById('mobileMenu')?.classList.add('open')
          document.body.style.overflow = 'hidden'
        }}>
          <span/><span/><span/>
        </button>
      </div>
    </header>
  )
}
