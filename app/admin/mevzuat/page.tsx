'use client'
import { useEffect, useState } from 'react'

interface Mevzuat { id:string; title:string; category:string; publishedAt:string }

export default function AdminMevzuatPage() {
  const [items, setItems] = useState<Mevzuat[]>([])
  const [form, setForm] = useState({ title:'', category:'', content:'', fileUrl:'', publishedAt:'' })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/mevzuat')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  async function save() {
    setLoading(true)
    const url = editId ? `/api/mevzuat/${editId}` : '/api/mevzuat'
    await fetch(url, { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setForm({ title:'', category:'', content:'', fileUrl:'', publishedAt:'' })
    setEditId(null); setLoading(false); load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/mevzuat/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div className="admin-page">
      <h1>Mevzuat</h1>
      <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>{editId?'Düzenle':'Yeni Mevzuat'}</h2>
          <div className="form-group"><label className="form-label">Başlık *</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Kategori *</label><input className="form-input" value={form.category} onChange={e=>set('category',e.target.value)} placeholder="Asgari Ücret, Kanunlar, vb."/></div>
          <div className="form-group"><label className="form-label">Yayın Tarihi</label><input className="form-input" type="date" value={form.publishedAt} onChange={e=>set('publishedAt',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">PDF URL</label><input className="form-input" value={form.fileUrl} onChange={e=>set('fileUrl',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">İçerik (HTML)</label><textarea className="form-textarea" rows={6} value={form.content} onChange={e=>set('content',e.target.value)} style={{fontFamily:'monospace',fontSize:13}}/></div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 20px'}}>{loading?'...':editId?'Güncelle':'Ekle'}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({title:'',category:'',content:'',fileUrl:'',publishedAt:''})}} className="admin-btn admin-btn-ghost" style={{padding:'10px 14px'}}>İptal</button>}
          </div>
        </div>
        <div className="admin-card" style={{padding:0}}>
          <table className="admin-table">
            <thead><tr><th>Başlık</th><th>Kategori</th><th>Tarih</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td><span className="badge badge-gray">{m.category}</span></td>
                  <td style={{color:'var(--gray)'}}>{new Date(m.publishedAt).toLocaleDateString('tr-TR')}</td>
                  <td><div style={{display:'flex',gap:6}}><button onClick={()=>{setEditId(m.id);setForm({title:m.title,category:m.category,content:'',fileUrl:'',publishedAt:m.publishedAt.slice(0,10)})}} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>Düzenle</button><button onClick={()=>del(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
