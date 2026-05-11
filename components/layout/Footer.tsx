import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-upper">
        <div className="footer-upper-inner">
          <div className="footer-logo">
            <svg width="44" height="44" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="22" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <text x="25" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="serif">BTO</text>
            </svg>
            <div>
              <strong>Bursa Tabip Odası</strong>
              <span>Hekimlerin sesi, toplumun güvencesi</span>
            </div>
          </div>
          <div className="footer-social">
            <h4>Bizi Takip Edin!</h4>
            <div className="social-icons">
              {[
                { label: 'Instagram', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>, vw: 24, vh: 24 },
                { label: 'X', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>, vw: 24, vh: 24 },
                { label: 'Facebook', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>, vw: 24, vh: 24 },
                { label: 'LinkedIn', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>, vw: 24, vh: 24 },
                { label: 'YouTube', icon: <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>, vw: 24, vh: 24 },
              ].map(s => (
                <div key={s.label} className="social-icon" title={s.label}>
                  <svg width="18" height="18" viewBox={`0 0 ${s.vw} ${s.vh}`} fill="currentColor">{s.icon}</svg>
                </div>
              ))}
            </div>
          </div>
          <div className="footer-help">
            <p>Yardım mı lazım?</p>
            <Link href="/iletisim">İletişim ve Yardım Merkezi</Link>
          </div>
        </div>
      </div>

      <div className="footer-lower">
        <div className="footer-lower-inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Hakkımızda</h5>
              <Link href="/hakkimizda">BTO Stratejisi</Link>
              <Link href="/kurullar">Yönetim Kurulu</Link>
              <Link href="/tarihce">Tarihçemiz</Link>
              <Link href="/iletisim">Hukuki Bilgiler</Link>
              <Link href="/iletisim">Akademik Odalar Yerleşkesi</Link>
              <Link href="/iletisim">BTO&apos;da Çalışmak</Link>
            </div>
            <div className="footer-col">
              <h5>BTO Web Siteleri</h5>
              <a href="https://www.bto.org.tr" target="_blank" rel="noopener">bto.org.tr</a>
              <a href="https://www.ttb.org.tr" target="_blank" rel="noopener">TTB — Türk Tabipleri Birliği</a>
              <Link href="/baglantilar">Tabip Odaları ve Dernekler</Link>
              <Link href="/yayinlar?tip=DERGI">Hekimce Bakış — Dergi</Link>
              <Link href="/yayinlar">E-Bülten Arşivi</Link>
            </div>
            <div className="footer-col">
              <h5>BTO Kaynakları</h5>
              <Link href="/mevzuat">Mevzuat</Link>
              <Link href="/mevzuat?kategori=Asgari Ücret">Asgari Ücret Katsayıları</Link>
              <Link href="/etkinlikler">Etkinlikler</Link>
              <Link href="/haberler">Haberler</Link>
              <Link href="/yayinlar">Yayınlar</Link>
            </div>
            <div className="footer-col">
              <h5>Hızlı Erişim</h5>
              <Link href="/uyelik">Üyeler</Link>
              <Link href="/uyelik">Gönüllüler</Link>
              <Link href="/iletisim">Hastalar</Link>
              <Link href="/iletisim">Ortaklar</Link>
              <Link href="/basin-aciklamalari">Basın</Link>
            </div>
            <div className="footer-col">
              <h5>Dahil Olun</h5>
              <Link href="/uyelik#form">Üye Olun</Link>
              <Link href="/iletisim">Gönüllü Olun</Link>
              <div style={{marginTop:24,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',lineHeight:1.6}}>
                  Akademik Odalar Yerleşkesi<br/>
                  Odunluk Mh. Akademi Cad.<br/>
                  No:8 A2 Blok K:2<br/>
                  Nilüfer / BURSA
                </p>
                <a href="tel:+902244535210" style={{display:'block',fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:8}}>+90 (224) 453 52 10</a>
                <a href="mailto:bto@bto.org.tr" style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>bto@bto.org.tr</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 BTO. Tüm hakları saklıdır.</p>
            <a href="#">BTO Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
