'use client'
import { useState } from 'react'

interface Unutamadigi {
  id: string
  name: string
  title: string | null
  birthYear: number | null
  deathYear: number | null
  birthPlace: string | null
  specialty: string | null
  medicalSchool: string | null
  photoUrl: string | null
  bio: string | null
}

export default function UnutamadiklariClient({ kisiler }: { kisiler: Unutamadigi[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Unutamadigi|null>(null)

  const filtered = kisiler.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    (k.specialty?.toLowerCase().includes(search.toLowerCase())) ||
    (k.medicalSchool?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">UNUTAMADIKLARIMIZ</div>
          <h1>Unutamadıklarımız</h1>
          <p>Aramızdan ayrılan değerli meslektaşlarımızı saygıyla anıyoruz</p>
        </div>
      </div>
      <div className="page-content">
        <input
          type="search"
          placeholder="İsim, uzmanlık veya mezun olduğu okul ile ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{maxWidth:500,marginBottom:32}}
        />
        {filtered.length === 0 ? (
          <p style={{color:'var(--gray)'}}>Sonuç bulunamadı.</p>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {filtered.map(k => (
              <button key={k.id} onClick={() => setSelected(k)} style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:16,padding:20,textAlign:'center',cursor:'pointer',transition:'all 0.2s',boxShadow:'var(--shadow)'}}>
                <div style={{width:80,height:80,borderRadius:'50%',overflow:'hidden',margin:'0 auto 12px',background:'linear-gradient(135deg,#f0e0e0,#d9917e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>
                  {k.photoUrl ? <img src={k.photoUrl} alt={k.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '👤'}
                </div>
                <strong style={{display:'block',fontSize:14,marginBottom:4}}>{k.title} {k.name}</strong>
                {k.specialty && <span style={{fontSize:12,color:'var(--gray)'}}>{k.specialty}</span>}
                {k.birthYear && k.deathYear && <div style={{fontSize:12,color:'var(--gray)',marginTop:4}}>{k.birthYear} — {k.deathYear}</div>}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={() => setSelected(null)}>
          <div style={{background:'var(--white)',borderRadius:24,padding:40,maxWidth:500,width:'100%',position:'relative'}} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{position:'absolute',top:16,right:16,background:'none',border:'none',fontSize:24,cursor:'pointer',color:'var(--gray)'}}>×</button>
            <div style={{width:100,height:100,borderRadius:'50%',overflow:'hidden',margin:'0 auto 20px',background:'linear-gradient(135deg,#f0e0e0,#d9917e)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>
              {selected.photoUrl ? <img src={selected.photoUrl} alt={selected.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : '👤'}
            </div>
            <h2 style={{fontFamily:'var(--serif)',fontSize:24,textAlign:'center',marginBottom:8}}>{selected.title} {selected.name}</h2>
            {selected.birthYear && <p style={{textAlign:'center',color:'var(--gray)',marginBottom:16}}>{selected.birthYear}{selected.deathYear ? ` — ${selected.deathYear}` : ''}</p>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              {selected.specialty && <div><strong style={{fontSize:12,color:'var(--gray)'}}>Uzmanlık</strong><p style={{fontSize:14}}>{selected.specialty}</p></div>}
              {selected.medicalSchool && <div><strong style={{fontSize:12,color:'var(--gray)'}}>Okul</strong><p style={{fontSize:14}}>{selected.medicalSchool}</p></div>}
              {selected.birthPlace && <div><strong style={{fontSize:12,color:'var(--gray)'}}>Doğum Yeri</strong><p style={{fontSize:14}}>{selected.birthPlace}</p></div>}
            </div>
            {selected.bio && <p style={{fontSize:14,color:'var(--body)',lineHeight:1.7}}>{selected.bio}</p>}
          </div>
        </div>
      )}
    </>
  )
}
