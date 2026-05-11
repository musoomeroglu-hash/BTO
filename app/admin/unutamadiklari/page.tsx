'use client'
import { useEffect, useState } from 'react'

interface Unutamadigi { id:string; name:string; title:string|null; birthYear:number|null; deathYear:number|null; active?:boolean }

export default function AdminUnutamadiklariPage() {
  const [items, setItems] = useState<Unutamadigi[]>([])
  const [form, setForm] = useState({ name:'', title:'', birthYear:'', deathYear:'', birthPlace:'', specialty:'', medicalSchool:'', photoUrl:'', bio:'' })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/unutamadiklari')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  async function save() {
    setLoading(true)
    const url = editId ? `/api/unutamadiklari/${editId}` : '/api/unutamadiklari'
    await fetch(url, { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setForm({ name:'', title:'', birthYear:'', deathYear:'', birthPlace:'', specialty:'', medicalSchool:'', photoUrl:'', bio:'' })
    setEditId(null); setLoading(false); load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/unutamadiklari/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div className="admin-page">
      <h1>Unutamadıklarımız</h1>
      <div style={{display:'grid',gridTemplateColumns:'400px 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>{editId?'Düzenle':'Yeni Kişi'}</h2>
          <div className="form-group"><label className="form-label">Ad Soyad *</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Unvan</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)}/></div>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">Doğum Yılı</label><input className="form-input" type="number" value={form.birthYear} onChange={e=>set('birthYear',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Ölüm Yılı</label><input className="form-input" type="number" value={form.deathYear} onChange={e=>set('deathYear',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Uzmanlık</label><input className="form-input" value={form.specialty} onChange={e=>set('specialty',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Fotoğraf URL</label><input className="form-input" value={form.photoUrl} onChange={e=>set('photoUrl',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Biyografi</label><textarea className="form-textarea" rows={4} value={form.bio} onChange={e=>set('bio',e.target.value)}/></div>
          
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 20px'}}>{loading?'...':editId?'Güncelle':'Ekle'}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({ name:'', title:'', birthYear:'', deathYear:'', birthPlace:'', specialty:'', medicalSchool:'', photoUrl:'', bio:'' })}} className="admin-btn admin-btn-ghost" style={{padding:'10px 14px'}}>İptal</button>}
          </div>
        </div>
        
        <div className="admin-card" style={{padding:0}}>
          <table className="admin-table">
            <thead><tr><th>İsim</th><th>Yıllar</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.title ? `${m.title} ` : ''}{m.name}</strong></td>
                  <td style={{color:'var(--gray)'}}>{m.birthYear||'?'} - {m.deathYear||'?'}</td>
                  <td><div style={{display:'flex',gap:6}}>
                    <button onClick={()=>{
                      setEditId(m.id)
                      const full = m as any
                      setForm({ name:full.name||'', title:full.title||'', birthYear:full.birthYear?.toString()||'', deathYear:full.deathYear?.toString()||'', birthPlace:full.birthPlace||'', specialty:full.specialty||'', medicalSchool:full.medicalSchool||'', photoUrl:full.photoUrl||'', bio:full.bio||'' })
                    }} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>Düzenle</button>
                    <button onClick={()=>del(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
