import IletisimForm from './IletisimForm'

export default function IletisimPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">İLETİŞİM</div>
          <h1>İletişim</h1>
          <p>Bize ulaşın, size en kısa sürede döneceğiz</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64}}>
          <div>
            <h2 style={{marginBottom:24}}>İletişim Bilgileri</h2>
            {[
              { icon:'📍', label:'Adres', val:'Akademik Odalar Yerleşkesi, Odunluk Mh. Akademi Cad. No:8 A2 Blok K:2, Nilüfer / BURSA' },
              { icon:'📞', label:'Telefon', val:'+90 (224) 453 52 10' },
              { icon:'📧', label:'E-posta', val:'bto@bto.org.tr' },
              { icon:'🕐', label:'Çalışma Saatleri', val:'Pazartesi–Cuma: 08:30–17:30' },
            ].map(item => (
              <div key={item.label} style={{display:'flex',gap:16,marginBottom:24,alignItems:'flex-start'}}>
                <div style={{width:44,height:44,borderRadius:12,background:'var(--light-bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{item.icon}</div>
                <div>
                  <strong style={{display:'block',fontSize:13,color:'var(--gray)',marginBottom:4}}>{item.label}</strong>
                  <p style={{fontSize:15,color:'var(--text)'}}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
          <IletisimForm />
        </div>
      </div>
    </>
  )
}
