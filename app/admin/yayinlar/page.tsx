'use client'
import { useEffect, useState } from 'react'

interface Yayin { id:string; title:string; type:string; issueNumber:number|null; publishedAt:string }

export default function AdminYayinlarPage() {
  const [items, setItems] = useState<Yayin[]>([])
  const [form, setForm] = useState({ title:'', type:'DERGI', description:'', fileUrl:'', coverUrl:'', issueNumber:'', publishedAt:'' })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/yayinlar')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  async function save() {
    setLoading(true)
    const body = { ...form, issueNumber: form.issueNumber ? +form.issueNumber : null }
    const url = editId ? `/api/yayinlar/${editId}` : '/api/yayinlar'
    await fetch(url, { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setForm({ title:'', type:'DERGI', description:'', fileUrl:'', coverUrl:'', issueNumber:'', publishedAt:'' })
    setEditId(null); setLoading(false); load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/yayinlar/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div className="admin-page">
      <h1>Yayınlar</h1>
      <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>{editId?'Düzenle':'Yeni Yayın'}</h2>
          <div className="form-group"><label className="form-label">Başlık *</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Tip</label>
            <select className="form-select" value={form.type} onChange={e=>set('type',e.target.value)}>
              <option value="DERGI">Hekimce Bakış (Dergi)</option>
              <option value="BROSUR">Broşür</option>
              <option value="AFIS">Afiş</option>
            </select>
          </div>
          {form.type === 'DERGI' && <div className="form-group"><label className="form-label">Sayı No</label><input className="form-input" type="number" value={form.issueNumber} onChange={e=>set('issueNumber',e.target.value)}/></div>}
          <div className="form-group"><label className="form-label">Yayın Tarihi</label><input className="form-input" type="date" value={form.publishedAt} onChange={e=>set('publishedAt',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">PDF URL</label><input className="form-input" value={form.fileUrl} onChange={e=>set('fileUrl',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Kapak Görseli URL</label><input className="form-input" value={form.coverUrl} onChange={e=>set('coverUrl',e.target.value)}/></div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 20px'}}>{loading?'...':editId?'Güncelle':'Ekle'}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({title:'',type:'DERGI',description:'',fileUrl:'',coverUrl:'',issueNumber:'',publishedAt:''})}} className="admin-btn admin-btn-ghost" style={{padding:'10px 14px'}}>İptal</button>}
          </div>
        </div>
        <div className="admin-card" style={{padding:0}}>
          <table className="admin-table">
            <thead><tr><th>Başlık</th><th>Tip</th><th>Sayı</th><th>Tarih</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(y => (
                <tr key={y.id}>
                  <td>{y.title}</td>
                  <td><span className="badge badge-gray">{y.type}</span></td>
                  <td style={{color:'var(--gray)'}}>{y.issueNumber ?? '—'}</td>
                  <td style={{color:'var(--gray)'}}>{new Date(y.publishedAt).toLocaleDateString('tr-TR')}</td>
                  <td><div style={{display:'flex',gap:6}}><button onClick={()=>{setEditId(y.id);setForm({title:y.title,type:y.type,description:'',fileUrl:'',coverUrl:'',issueNumber:y.issueNumber?.toString()??'',publishedAt:y.publishedAt.slice(0,10)})}} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>Düzenle</button><button onClick={()=>del(y.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
