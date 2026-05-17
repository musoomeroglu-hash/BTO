'use client'
import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button className="bagis-copy-btn" onClick={handleCopy}>
      {copied ? '✓ Kopyalandı' : 'Kopyala'}
    </button>
  )
}

export default function BagisPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">DESTEK OLUN</div>
          <h1>Bağış Yapın</h1>
          <p>Sürekli Tıp Eğitimi faaliyetlerimizi destekleyin</p>
        </div>
      </div>

      <div className="page-content" style={{maxWidth: 760}}>

        {/* IBAN Bilgileri */}
        <div className="bagis-iban-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:22,marginBottom:8}}>Banka Havalesi ile Bağış</h2>
          <p style={{color:'var(--body)',fontSize:14,marginBottom:24}}>Aşağıdaki IBAN bilgilerini kullanarak bağışınızı iletebilirsiniz. Açıklama kısmına <strong>BTO STE Bağış</strong> yazmanızı rica ederiz.</p>

          <div className="bagis-iban-row">
            <div>
              <div style={{fontSize:12,color:'var(--gray)',marginBottom:4}}>Hesap Sahibi</div>
              <strong>BURSA TABİP ODASI</strong>
            </div>
          </div>

          <div className="bagis-iban-row">
            <div>
              <div style={{fontSize:12,color:'var(--gray)',marginBottom:4}}>Banka</div>
              <strong>[PLACEHOLDER — Güncellenecek]</strong>
            </div>
          </div>

          <div className="bagis-iban-row">
            <div>
              <div style={{fontSize:12,color:'var(--gray)',marginBottom:4}}>IBAN (TL)</div>
              <strong style={{fontFamily:'monospace',letterSpacing:'0.05em'}}>TR00 0000 0000 0000 0000 0000 00</strong>
            </div>
            <CopyButton text="TR00000000000000000000000000" />
          </div>

          <div className="bagis-iban-row" style={{borderBottom:'none'}}>
            <div>
              <div style={{fontSize:12,color:'var(--gray)',marginBottom:4}}>Açıklama</div>
              <strong>BTO STE Bağış</strong>
            </div>
            <CopyButton text="BTO STE Bağış" />
          </div>
        </div>

        {/* Kredi Kartı */}
        <div className="bagis-iban-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:22,marginBottom:8}}>Kredi Kartı ile Bağış</h2>
          <p style={{color:'var(--body)',fontSize:14,marginBottom:16}}>Kredi kartı ile bağış yapmak için aşağıdaki bilgileri kullanabilirsiniz.</p>
          <div style={{padding:'24px',background:'var(--border)',borderRadius:12,textAlign:'center',color:'var(--gray)',fontSize:14}}>
            [PLACEHOLDER — Ödeme entegrasyon bilgileri buraya eklenecek]
          </div>
        </div>

        {/* Açıklama */}
        <div style={{marginTop:32,padding:'24px',background:'var(--light-bg)',borderRadius:'var(--radius)',borderLeft:'4px solid var(--red)'}}>
          <h3 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:8}}>Bağışlarınız Nereye Gidiyor?</h3>
          <p style={{color:'var(--body)',fontSize:14,lineHeight:1.7}}>
            Yapılan bağışlar, Bursa Tabip Odası Sürekli Tıp Eğitimi Komisyonu tarafından düzenlenen eğitim etkinliklerinin, sempozyumların ve yayınların finansmanında kullanılmaktadır. Katkılarınız hekimlerimizin mesleki gelişimine doğrudan destek olur.
          </p>
        </div>

      </div>
    </>
  )
}
