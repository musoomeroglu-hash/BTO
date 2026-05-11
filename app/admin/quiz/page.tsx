'use client'
import { useEffect, useState } from 'react'

interface Quiz { id:string; question:string; options:string; correctOption:number; explanation:string; active:boolean; weekDate:string }

export default function AdminQuizPage() {
  const [items, setItems] = useState<Quiz[]>([])
  const [form, setForm] = useState({ question:'', options:['','','',''], correctOption:0, explanation:'', imageUrl:'', imageCaption:'', weekDate:'', active:true })
  const [editId, setEditId] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/quiz')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  function setOpt(i: number, v: string) {
    setForm(p => { const opts = [...p.options]; opts[i]=v; return {...p, options:opts} })
  }

  async function save() {
    setLoading(true)
    const body = { ...form, options: JSON.stringify(form.options) }
    const url = editId ? `/api/quiz/${editId}` : '/api/quiz'
    await fetch(url, { method: editId?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setForm({ question:'', options:['','','',''], correctOption:0, explanation:'', imageUrl:'', imageCaption:'', weekDate:'', active:true })
    setEditId(null); setLoading(false); load()
  }

  async function del(id: string) {
    if (!confirm('Silinsin mi?')) return
    await fetch(`/api/quiz/${id}`, { method:'DELETE' })
    load()
  }

  function edit(q: Quiz) {
    setEditId(q.id)
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    setForm({ question:q.question, options:opts, correctOption:q.correctOption, explanation:q.explanation, imageUrl:'', imageCaption:'', weekDate:q.weekDate.slice(0,10), active:q.active })
  }

  return (
    <div className="admin-page">
      <h1>Quiz Yönetimi</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        <div className="admin-card">
          <h2 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>{editId ? 'Düzenle' : 'Yeni Quiz'}</h2>
          <div className="form-group"><label className="form-label">Soru *</label><textarea className="form-textarea" rows={3} value={form.question} onChange={e=>setForm(p=>({...p,question:e.target.value}))}/></div>
          {form.options.map((opt,i) => (
            <div key={i} className="form-group">
              <label className="form-label">
                Şık {String.fromCharCode(65+i)}
                {form.correctOption === i && <span style={{color:'var(--green-600,#16a34a)',marginLeft:8,fontSize:11}}>✓ Doğru</span>}
              </label>
              <div style={{display:'flex',gap:8}}>
                <input className="form-input" value={opt} onChange={e=>setOpt(i,e.target.value)} style={{flex:1}}/>
                <button type="button" onClick={()=>setForm(p=>({...p,correctOption:i}))} className={`admin-btn ${form.correctOption===i?'admin-btn-primary':'admin-btn-ghost'}`} style={{padding:'8px 14px',fontSize:12}}>Doğru</button>
              </div>
            </div>
          ))}
          <div className="form-group"><label className="form-label">Açıklama *</label><textarea className="form-textarea" rows={3} value={form.explanation} onChange={e=>setForm(p=>({...p,explanation:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Hafta Tarihi</label><input className="form-input" type="date" value={form.weekDate} onChange={e=>setForm(p=>({...p,weekDate:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Görsel URL</label><input className="form-input" value={form.imageUrl} onChange={e=>setForm(p=>({...p,imageUrl:e.target.value}))}/></div>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14,marginBottom:20}}>
            <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/> Bu haftanın sorusu (aktif)
          </label>
          <div style={{display:'flex',gap:8}}>
            <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'10px 24px'}}>{loading?'...':editId?'Güncelle':'Ekle'}</button>
            {editId && <button onClick={()=>{setEditId(null);setForm({question:'',options:['','','',''],correctOption:0,explanation:'',imageUrl:'',imageCaption:'',weekDate:'',active:true})}} className="admin-btn admin-btn-ghost" style={{padding:'10px 16px'}}>İptal</button>}
          </div>
        </div>
        <div>
          {items.map(q => (
            <div key={q.id} className="admin-card" style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span className={`badge ${q.active?'badge-green':'badge-gray'}`}>{q.active?'Aktif':'Pasif'}</span>
                <span style={{fontSize:12,color:'var(--gray)'}}>{new Date(q.weekDate).toLocaleDateString('tr-TR')}</span>
              </div>
              <p style={{fontSize:14,fontWeight:600,marginBottom:12}}>{q.question}</p>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>edit(q)} className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 12px'}}>Düzenle</button>
                <button onClick={()=>del(q.id)} className="admin-btn admin-btn-danger" style={{fontSize:12,padding:'4px 12px'}}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
