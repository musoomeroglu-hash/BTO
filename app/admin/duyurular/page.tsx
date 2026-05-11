export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'

interface Duyuru { id: string; title: string; active: boolean; priority: number; expiresAt: string | null; createdAt: string }

export default function AdminDuyurularPage() {
  const [items, setItems] = useState<Duyuru[]>([])
  const [form, setForm] = useState({ title: '', content: '', url: '', priority: 0, active: true })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/duyurular')
    const d = await r.json()
    setItems(d.items ?? d)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setLoading(true)
    const url = editId ? `/api/duyurular/${editId}` : '/api/duyurular'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setForm({ title:'', content:'', url:'', priority:0, active:true })
    setEditId(null)
    setLoading(false)
    load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/duyurular/${id}`, { method: 'DELETE' })
    load()
  }

  function edit(d: Duyuru) {
    setEditId(d.id)
    setForm({ title: d.title, content: '', url: '', priority: d.priority, active: d.active })
  }

  return (
    <div className="admin-page">
      <h1>Duyurular</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:20,marginBottom:20}}>{editId ? 'Düzenle' : 'Yeni Duyuru'}</h2>
          <div className="form-group"><label className="form-label">Başlık *</label><input className="form-input" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">İçerik</label><textarea className="form-textarea" rows={3} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">URL (opsiyonel)</label><input className="form-input" value={form.url} onChange={e=>setForm(p=>({...p,url:e.target.value}))}/></div>
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">Öncelik</label><input className="form-input" type="number" value={form.priority} onChange={e=>setForm(p=>({...p,priority:+e.target.value}))}/></div>
            <div className="form-group" style={{display:'flex',alignItems:'flex-end',paddingBottom:4}}>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14}}>
                <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/>
                Aktif
              </label>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 24px'}}>{loading ? '...' : (editId ? 'Güncelle' : 'Ekle')}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({title:'',content:'',url:'',priority:0,active:true})}} className="admin-btn admin-btn-ghost" style={{padding:'10px 16px'}}>İptal</button>}
          </div>
        </div>
        <div className="admin-card" style={{padding:0}}>
          <table className="admin-table">
            <thead><tr><th>Başlık</th><th>Öncelik</th><th>Durum</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(d => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td>{d.priority}</td>
                  <td><span className={`badge ${d.active ? 'badge-green' : 'badge-gray'}`}>{d.active ? 'Aktif' : 'Pasif'}</span></td>
                  <td><div style={{display:'flex',gap:6}}><button onClick={()=>edit(d)} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>Düzenle</button><button onClick={()=>del(d.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
