const categories = [
  {
    label: 'Tabip Odaları',
    links: [
      { name: 'Bursa Tabip Odası', href: 'https://www.bto.org.tr' },
    ],
  },
  {
    label: 'Uzmanlık Dernekleri',
    links: [
      { name: 'Türk Kardiyoloji Derneği', href: 'https://www.tkd.org.tr' },
      { name: 'Türk Hematoloji Derneği', href: 'https://www.thd.org.tr' },
      { name: 'Türkiye Endokrinoloji ve Metabolizma Derneği', href: 'https://www.temd.org.tr' },
    ],
  },
  {
    label: 'Uluslararası',
    links: [
      { name: 'PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov' },
      { name: 'ESCardio', href: 'https://www.escardio.org' },
    ],
  },
]

export default function UsefulLinks() {
  return (
    <section className="useful-links-section">
      <div className="section-inner">
        <div className="section-label">YARARLI BAĞLANTILAR</div>
        <h2 className="section-heading">Önemli Kurum ve Kuruluşlar</h2>
        <div style={{display:'flex',flexDirection:'column',gap:32,marginTop:32}}>
          {categories.map(cat => (
            <div key={cat.label}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--gray)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>{cat.label}</div>
              <div className="useful-links-grid">
                {cat.links.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="useful-link-btn"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
