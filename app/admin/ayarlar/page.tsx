'use client'
import { useEffect, useState } from 'react'

const defaultSettings = [
  { key:'site_title', label:'Site Başlığı', value:'' },
  { key:'site_description', label:'Site Açıklaması', value:'' },
  { key:'contact_address', label:'Adres', value:'' },
  { key:'contact_phone', label:'Telefon', value:'' },
  { key:'contact_email', label:'E-posta', value:'' },
  { key:'social_instagram', label:'Instagram URL', value:'' },
  { key:'social_twitter', label:'X (Twitter) URL', value:'' },
  { key:'social_facebook', label:'Facebook URL', value:'' },
  { key:'social_linkedin', label:'LinkedIn URL', value:'' },
  { key:'social_youtube', label:'YouTube URL', value:'' },
  { key:'ste_banner_text', label:'STE Banner Metni', value:'' },
  { key:'ste_banner_active', label:'STE Banner Aktif', value:'false' },
]

export default function AdminAyarlarPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/ayarlar').then(r=>r.json()).then((data: Record<string,string>) => {
      setSettings(s => s.map(item => ({ ...item, value: data[item.key] ?? item.value })))
    }).catch(()=>{})
  }, [])

  function set(key: string, value: string) {
    setSettings(s => s.map(item => item.key === key ? { ...item, value } : item))
  }

  async function save() {
    setLoading(true)
    const body = Object.fromEntries(settings.map(s=>[s.key, s.value]))
    await fetch('/api/ayarlar', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setLoading(false); setSaved(true)
    setTimeout(()=>setSaved(false), 3000)
  }

  const groups = [
    { title:'Genel Ayarlar', keys:['site_title','site_description'] },
    { title:'İletişim Bilgileri', keys:['contact_address','contact_phone','contact_email'] },
    { title:'Sosyal Medya', keys:['social_instagram','social_twitter','social_facebook','social_linkedin','social_youtube'] },
    { title:'STE Duyuru Bandı', keys:['ste_banner_text','ste_banner_active'] },
  ]

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>Site Ayarları</h1>
        {saved && <span style={{color:'#16a34a',fontSize:14,fontWeight:600}}>✓ Kaydedildi!</span>}
      </div>
      {groups.map(g => (
        <div key={g.title} className="admin-card" style={{marginBottom:24}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:20,fontWeight:700,marginBottom:20}}>{g.title}</h2>
          {g.keys.map(key => {
            const s = settings.find(x=>x.key===key)
            if (!s) return null
            return (
              <div key={key} className="form-group">
                <label className="form-label">{s.label}</label>
                {key === 'ste_banner_active' ? (
                  <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',paddingTop:4}}>
                    <input type="checkbox" checked={s.value === 'true'} onChange={e=>set(key, e.target.checked ? 'true' : 'false')} style={{width:16,height:16}}/>
                    <span style={{fontSize:14}}>Aktif</span>
                  </label>
                ) : key === 'site_description' || key === 'contact_address' || key === 'ste_banner_text' ? (
                  <textarea className="form-textarea" rows={3} value={s.value} onChange={e=>set(key,e.target.value)}/>
                ) : (
                  <input className="form-input" value={s.value} onChange={e=>set(key,e.target.value)}/>
                )}
              </div>
            )
          })}
        </div>
      ))}
      <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'14px 40px',fontSize:15}}>
        {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
      </button>
    </div>
  )
}
