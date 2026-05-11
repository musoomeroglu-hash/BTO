'use client'
import { useEffect, useState } from 'react'

interface YK { id:string; name:string; title:string; position:string; order:number; startYear:number; endYear:number|null; active:boolean }

export default function AdminYKPage() {
  const [items, setItems] = useState<YK[]>([])
  const [form, setForm] = useState({ name:'', title:'Dr.', position:'Üye', photoUrl:'', order:0, startYear:2024, endYear:'', active:true })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/yonetim-kurulu')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  async function save() {
    setLoading(true)
    const body = { ...form, endYear: form.endYear ? +form.endYear : null }
    const url = editId ? `/api/yonetim-kurulu/${editId}` : '/api/yonetim-kurulu'
    await fetch(url, { method: editId ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setForm({ name:'', title:'Dr.', position:'Üye', photoUrl:'', order:0, startYear:2024, endYear:'', active:true })
    setEditId(null); setLoading(false); load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/yonetim-kurulu/${id}`, { method:'DELETE' })
    load()
  }

  function edit(m: YK) {
    setEditId(m.id)
    setForm({ name:m.name, title:m.title, position:m.position, photoUrl:'', order:m.order, startYear:m.startYear, endYear:m.endYear?.toString()??'', active:m.active })
  }

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  return (
    <div className="admin-page">
      <h1>Yönetim Kurulu</h1>
      <div style={{display:'grid',gridTemplateColumns:'400px 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>{editId ? 'Düzenle' : 'Yeni Üye'}</h2>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">Unvan</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Görevi</label>
              <select className="form-select" value={form.position} onChange={e=>set('position',e.target.value)}>
                {['Başkan','Genel Sekreter','Sayman','Başkan Yardımcısı','Üye'].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Ad Soyad</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Fotoğraf URL</label><input className="form-input" value={form.photoUrl} onChange={e=>set('photoUrl',e.target.value)}/></div>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">Başlangıç</label><input className="form-input" type="number" value={form.startYear} onChange={e=>set('startYear',+e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Bitiş (boş=güncel)</label><input className="form-input" type="number" value={form.endYear} onChange={e=>set('endYear',e.target.value)}/></div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 20px'}}>{loading?'...':editId?'Güncelle':'Ekle'}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({name:'',title:'Dr.',position:'Üye',photoUrl:'',order:0,startYear:2024,endYear:'',active:true})}} className="admin-btn admin-btn-ghost" style={{padding:'10px 14px'}}>İptal</button>}
          </div>
        </div>
        <div className="admin-card" style={{padding:0}}>
          <table className="admin-table">
            <thead><tr><th>Üye</th><th>Görevi</th><th>Dönem</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.title} {m.name}</strong></td>
                  <td style={{color:'var(--gray)'}}>{m.position}</td>
                  <td style={{color:'var(--gray)'}}>{m.startYear}{m.endYear ? `–${m.endYear}` : '–günümüz'}</td>
                  <td><div style={{display:'flex',gap:6}}><button onClick={()=>edit(m)} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>Düzenle</button><button onClick={()=>del(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
