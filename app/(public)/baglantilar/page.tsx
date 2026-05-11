import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Yararlı Bağlantılar — Bursa Tabip Odası',
  description: 'Türkiye\'deki tabip odaları ve uzmanlık derneklerinin web sitesi bağlantıları.',
}

export default function BaglantilarPage() {
  const odalar = [
    { name: 'Adana Tabip Odası', url: 'https://www.adanatdo.org.tr/' },
    { name: 'Adıyaman Tabip Odası', url: 'https://adiyamantabip.org.tr/' },
    { name: 'Afyonkarahisar Tabip Odası', url: 'https://afyontabip.org.tr/' },
    { name: 'Ağrı Tabip Odası', url: '#' },
    { name: 'Aksaray Tabip Odası', url: 'https://aksaraytabip.org.tr/' },
    { name: 'Amasya Tabip Odası', url: 'https://amasyatabip.org.tr/' },
    { name: 'Ankara Tabip Odası', url: 'https://ato.org.tr/' },
    { name: 'Antalya Tabip Odası', url: 'https://antalyatabip.org.tr/' },
    { name: 'Artvin Tabip Odası', url: '#' },
    { name: 'Aydın Tabip Odası', url: 'https://aydintabip.org.tr/' },
    { name: 'Balıkesir Tabip Odası', url: 'https://balikesirtabip.org.tr/' },
    { name: 'Bartın Tabip Odası', url: '#' },
    { name: 'Batman Tabip Odası', url: 'https://batmantabip.org.tr/' },
    { name: 'Bilecik Tabip Odası', url: '#' },
    { name: 'Bingöl Tabip Odası', url: '#' },
    { name: 'Bitlis Tabip Odası', url: 'https://bitlistabip.org.tr/' },
    { name: 'Bolu-Düzce Tabip Odası', url: 'https://boluduzcetabip.org.tr/' },
    { name: 'Burdur Tabip Odası', url: 'https://burdurtabip.org.tr/' },
    { name: 'Bursa Tabip Odası', url: 'https://www.bto.org.tr/' },
    { name: 'Çanakkale Tabip Odası', url: 'https://canakkaletabip.org.tr/' },
    { name: 'Çankırı Tabip Odası', url: '#' },
    { name: 'Çorum Tabip Odası', url: 'https://corumtabip.org.tr/' },
    { name: 'Denizli Tabip Odası', url: 'https://denizlitabip.org.tr/' },
    { name: 'Diyarbakır Tabip Odası', url: 'https://diyarbakirtabip.org.tr/' },
    { name: 'Edirne Tabip Odası', url: 'https://edirnetabip.org.tr/' },
    { name: 'Elazığ Tabip Odası', url: 'https://elazigtabip.org.tr/' },
    { name: 'Erzincan Tabip Odası', url: 'https://erzincantabip.org.tr/' },
    { name: 'Erzurum-Kars-Iğdır-Ardahan-Bayburt-Gümüşhane Tabip Odası', url: '#' },
    { name: 'Eskişehir-Bilecik Tabip Odası', url: 'https://eskisehirtabip.org.tr/' },
    { name: 'Gaziantep-Kilis Tabip Odası', url: 'https://gto.org.tr/' },
    { name: 'Giresun Tabip Odası', url: 'https://giresuntabip.org.tr/' },
    { name: 'Hakkari Tabip Odası', url: '#' },
    { name: 'Hatay Tabip Odası', url: 'https://hataytabip.org.tr/' },
    { name: 'Isparta-Burdur Tabip Odası', url: 'https://ispartaburdurtabip.org.tr/' },
    { name: 'İstanbul Tabip Odası', url: 'https://www.istabip.org.tr/' },
    { name: 'İzmir Tabip Odası', url: 'https://www.izmirtabip.org.tr/' },
    { name: 'Kahramanmaraş Tabip Odası', url: 'https://kmarastabip.org.tr/' },
    { name: 'Karabük Tabip Odası', url: '#' },
    { name: 'Karaman Tabip Odası', url: 'https://karamantabip.org.tr/' },
    { name: 'Kastamonu Tabip Odası', url: 'https://kastamonutabip.org.tr/' },
    { name: 'Kayseri Tabip Odası', url: 'https://kayseritabip.org.tr/' },
    { name: 'Kırıkkale Tabip Odası', url: 'https://kirikkaletabip.org.tr/' },
    { name: 'Kırklareli Tabip Odası', url: 'https://kirklarelitabip.org.tr/' },
    { name: 'Kırşehir Tabip Odası', url: 'https://kirsehirtabip.org.tr/' },
    { name: 'Kocaeli Tabip Odası', url: 'https://kocaelitabip.org.tr/' },
    { name: 'Konya Tabip Odası', url: 'https://konyatabip.org.tr/' },
    { name: 'Kütahya Tabip Odası', url: 'https://kutahyatabip.org.tr/' },
    { name: 'Malatya Tabip Odası', url: 'https://malatyatabip.org.tr/' },
    { name: 'Manisa Tabip Odası', url: 'https://manisatabip.org.tr/' },
    { name: 'Mardin Tabip Odası', url: 'https://mardintabip.org.tr/' },
    { name: 'Mersin Tabip Odası', url: 'https://mersintabip.org.tr/' },
    { name: 'Muğla Tabip Odası', url: 'https://muglatabip.org.tr/' },
    { name: 'Muş Tabip Odası', url: 'https://mustabip.org.tr/' },
    { name: 'Nevşehir Tabip Odası', url: 'https://nevsehirtabip.org.tr/' },
    { name: 'Niğde Tabip Odası', url: 'https://nigdetabip.org.tr/' },
    { name: 'Ordu Tabip Odası', url: 'https://ordutabip.org.tr/' },
    { name: 'Osmaniye Tabip Odası', url: 'https://osmaniyetabip.org.tr/' },
    { name: 'Rize Tabip Odası', url: 'https://rizetabip.org.tr/' },
    { name: 'Sakarya Tabip Odası', url: 'https://sakaryatabip.org.tr/' },
    { name: 'Samsun Tabip Odası', url: 'https://samsuntabip.org.tr/' },
    { name: 'Siirt Tabip Odası', url: 'https://siirttabip.org.tr/' },
    { name: 'Sinop Tabip Odası', url: 'https://sinoptabip.org.tr/' },
    { name: 'Sivas-Erzincan Tabip Odası', url: 'https://sivastabip.org.tr/' },
    { name: 'Şanlıurfa Tabip Odası', url: 'https://urfatabip.org.tr/' },
    { name: 'Şırnak Tabip Odası', url: 'https://sirnaktabip.org.tr/' },
    { name: 'Tekirdağ Tabip Odası', url: 'https://tekirdagtabip.org.tr/' },
    { name: 'Tokat Tabip Odası', url: 'https://tokattabip.org.tr/' },
    { name: 'Trabzon Tabip Odası', url: 'https://trabzontabip.org.tr/' },
    { name: 'Tunceli Tabip Odası', url: 'https://tuncelitabip.org.tr/' },
    { name: 'Uşak Tabip Odası', url: 'https://usaktabip.org.tr/' },
    { name: 'Van-Hakkari Tabip Odası', url: 'https://vantabip.org.tr/' },
    { name: 'Yalova Tabip Odası', url: 'https://yalovatabip.org.tr/' },
    { name: 'Yozgat Tabip Odası', url: 'https://yozgattabip.org.tr/' },
    { name: 'Zonguldak Tabip Odası', url: 'https://zonguldaktabip.org.tr/' },
  ]

  const dernekler = [
    { name: 'Türk Nefroloji Derneği', url: 'https://www.nefroloji.org.tr/' },
    { name: 'TEMD (Türkiye Endokrinoloji ve Metabolizma Derneği)', url: 'https://www.temd.org.tr/' },
    { name: 'Türk Kardiyoloji Derneği', url: 'https://www.tkd.org.tr/' },
    { name: 'Türk Tabipleri Birliği (TTB)', url: 'https://www.ttb.org.tr/' },
    { name: 'Türk Cerrahi Derneği', url: 'https://www.turkcerrahi.com/' },
    { name: 'Türk Pediatri Kurumu', url: 'https://www.turkpediatri.org.tr/' },
    { name: 'Türk Nöroloji Derneği', url: 'https://www.noroloji.org.tr/' },
    { name: 'Türk Ortopedi ve Travmatoloji Birliği Derneği', url: 'https://www.totbid.org.tr/' },
    { name: 'Türk Oftalmoloji Derneği', url: 'https://www.todnet.org/' },
    { name: 'Türkiye Psikiyatri Derneği', url: 'https://psikiyatri.org.tr/' },
    { name: 'Türk Tıbbi Onkoloji Derneği', url: 'https://www.kanser.org/' },
    { name: 'Türk Jinekoloji ve Obstetrik Derneği', url: 'https://www.tjod.org/' },
    { name: 'Türkiye Solunum Araştırmaları Derneği (TÜSAD)', url: 'https://www.solunum.org.tr/' },
    { name: 'Türk Toraks Derneği', url: 'https://www.toraks.org.tr/' },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .link-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: var(--light-bg);
          border-radius: 8px;
          text-decoration: none;
          color: var(--text);
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
        }
        .link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--red);
          color: var(--red);
        }
        .dernek-card {
          display: flex;
          align-items: center;
          padding: 20px;
          background-color: var(--white);
          border-radius: 8px;
          text-decoration: none;
          color: var(--text);
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border-left: 4px solid var(--red);
        }
        .dernek-card:hover {
          transform: translateX(4px);
          background-color: var(--light-bg);
          color: var(--red);
        }
      `}} />
      <div className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="page-hero-content">
          <h1>Yararlı Bağlantılar</h1>
          <p>Türkiye&apos;deki tabip odaları ve uzmanlık derneklerinin resmi web sitelerine buradan ulaşabilirsiniz.</p>
        </div>
      </div>

      <div className="page-content" style={{ padding: '64px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', color: 'var(--red)', borderBottom: '2px solid var(--red)', paddingBottom: '16px', marginBottom: '32px' }}>
            Türkiye&apos;deki Tabip Odaları
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {odalar.map((oda, i) => (
              <a 
                key={i} 
                href={oda.url !== '#' ? oda.url : `https://www.google.com/search?q=${encodeURIComponent(oda.name)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="link-card"
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>🏛️</span>
                {oda.name}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: 'var(--serif)', color: 'var(--red)', borderBottom: '2px solid var(--red)', paddingBottom: '16px', marginBottom: '32px' }}>
            Uzmanlık Dernekleri
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
            {dernekler.map((dernek, i) => (
              <a 
                key={i} 
                href={dernek.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="dernek-card"
              >
                <span style={{ fontSize: '24px', marginRight: '16px' }}>🩺</span>
                {dernek.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
