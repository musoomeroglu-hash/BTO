import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner header-inner--centered">
        <Link href="/" className="header-title-link">
          <strong className="header-site-title">SÜREKLİ TIP EĞİTİMİ</strong>
          <span className="header-site-sub">Bursa Tabip Odası Mesleki Eğitim Portalı</span>
        </Link>
      </div>
    </header>
  )
}
