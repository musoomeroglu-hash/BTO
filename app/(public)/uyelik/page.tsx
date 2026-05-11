'use client'

export default function UyelikPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">ÜYELİK</div>
          <h1>Üyelik Bilgileri</h1>
          <p>BTO üyeliği hakkında tüm bilgiler</p>
        </div>
      </div>
      <div className="page-content">
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:48}}>
          <div>
            <nav style={{position:'sticky',top:120}}>
              {[
                ['#yonerge','TTB Üyelik Yönergesi'],
                ['#aidat','Aidat Bilgileri'],
                ['#2026','2026 Ödemeleri'],
                ['#belgeler','Gerekli Belgeler'],
                ['#form','Kayıt Formu'],
                ['#kimlik','TTB Kimliği Talebi'],
              ].map(([href,label])=>(
                <a key={href} href={href} style={{display:'block',padding:'10px 16px',color:'var(--body)',fontSize:14,borderLeft:'2px solid var(--border)',marginBottom:4,transition:'all 0.2s'}}
                   onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderLeftColor='var(--red)';(e.currentTarget as HTMLElement).style.color='var(--red)';}}
                   onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderLeftColor='var(--border)';(e.currentTarget as HTMLElement).style.color='var(--body)';}}>
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <section id="yonerge" style={{marginBottom:64}}>
              <h2 style={{marginBottom:16}}>TTB Üyelik İşleri Yönergesi</h2>
              <p>Türkiye Cumhuriyeti sınırları içinde hekimlik yapacak her tabip, hekimlik uygulamalarını yürütebilmek için bulunduğu ilin Tabip Odası&apos;na üye olmak zorundadır.</p>
              <p>Üyelik işlemleri, Tabip Odası&apos;na şahsen veya yetkilendirilmiş temsilci aracılığıyla yapılabilir. Yabancı uyruklu hekimler için ek belgeler talep edilebilir.</p>
            </section>

            <section id="aidat" style={{marginBottom:64}}>
              <h2 style={{marginBottom:16}}>Aidatınızı Nasıl Ödeyebilirsiniz?</h2>
              <p>Yıllık aidat ödemeleri aşağıdaki yöntemlerle yapılabilmektedir:</p>
              <ul style={{marginTop:12,paddingLeft:20,display:'flex',flexDirection:'column',gap:8}}>
                <li>Banka havalesi / EFT (IBAN: TR00 0000 0000 0000 0000 000000)</li>
                <li>Oda veznesine nakit ödeme (Pazartesi–Cuma 09:00–16:00)</li>
                <li>Online ödeme sistemi (üye portalı üzerinden)</li>
              </ul>
            </section>

            <section id="2026" style={{marginBottom:64}}>
              <h2 style={{marginBottom:16}}>2026 Yılı İçin Gerekli Ödemeler</h2>
              <div style={{background:'var(--light-bg)',borderRadius:12,padding:24}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{borderBottom:'1px solid var(--border)'}}>
                      <th style={{textAlign:'left',padding:'8px 0',fontSize:13,color:'var(--gray)'}}>Ücret Kalemi</th>
                      <th style={{textAlign:'right',padding:'8px 0',fontSize:13,color:'var(--gray)'}}>Tutar (TL)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[['Yıllık Aidat','1.800'],['Giriş Aidatı (yeni üye)','500'],['TTB Bağlılık Payı','800']].map(([k,v])=>(
                      <tr key={k}><td style={{padding:'12px 0',fontSize:15}}>{k}</td><td style={{textAlign:'right',padding:'12px 0',fontWeight:600,color:'var(--red)'}}>{v} ₺</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="belgeler" style={{marginBottom:64}}>
              <h2 style={{marginBottom:16}}>Üyelik İçin Gerekli Belgeler</h2>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {['Tıp fakültesi diploması veya geçici mezuniyet belgesi (noter onaylı)','Nüfus cüzdanı fotokopisi','İkametgah belgesi','2 adet fotoğraf (4x6 cm)','Çalışma belgesi (hastane, muayenehane, vb.)'].map((b,i)=>(
                  <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:'var(--white)',padding:16,borderRadius:8,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                    <span style={{width:24,height:24,borderRadius:'50%',background:'var(--red)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                    <p style={{fontSize:15,marginTop:2}}>{b}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="form" style={{marginBottom:64}}>
              <h2 style={{marginBottom:16}}>Üye Kayıt Formu</h2>
              <p>Üyelik başvurusu için aşağıdaki formu doldurup gerekli belgelerle birlikte oda sekreteryasına teslim ediniz.</p>
              <a href="#" className="btn-outlined" style={{marginTop:16,display:'inline-block'}}>📄 Kayıt Formunu İndir</a>
            </section>

            <section id="kimlik" style={{marginBottom:32}}>
              <h2 style={{marginBottom:16}}>TTB Kimliği Talebi</h2>
              <p>TTB kimlik kartı, mesleğinizi icra ederken kimliğinizi belgelemenizi sağlar. Kimlik talebi için oda sekreteryasına başvurunuz.</p>
              <p>Kayıp kimlik yenileme ücreti: <strong>200 ₺</strong></p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
