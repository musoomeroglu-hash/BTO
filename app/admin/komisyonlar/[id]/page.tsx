export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function KomisyonEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState({ name:'', slug:'', description:'', content:'', chairName:'', order:0, active:true })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/komisyonlar/${id}`).then(r=>r.json()).then(d=>{
      setForm({ name:d.name, slug:d.slug, description:d.description??'', content:d.content??'', chairName:d.chairName??'', order:d.order, active:d.active })
    })
  }, [id])

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  async function save() {
    setLoading(true)
    await fetch(`/api/komisyonlar/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    setLoading(false)
    router.push('/admin/komisyonlar'); router.refresh()
  }

  return (
    <div className="admin-page">
      <h1>Komisyonu Düzenle</h1>
      <div className="admin-card" style={{maxWidth:800}}>
        <div className="form-group"><label className="form-label">Ad</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Slug</label><input className="form-input" value={form.slug} onChange={e=>set('slug',e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Komisyon Başkanı</label><input className="form-input" value={form.chairName} onChange={e=>set('chairName',e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Sıra</label><input className="form-input" type="number" value={form.order} onChange={e=>set('order',+e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Açıklama</label><textarea className="form-textarea" rows={3} value={form.description} onChange={e=>set('description',e.target.value)}/></div>
        <div className="form-group"><label className="form-label">İçerik (HTML)</label><textarea className="form-textarea" rows={12} value={form.content} onChange={e=>set('content',e.target.value)} style={{fontFamily:'monospace',fontSize:13}}/></div>
        <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,cursor:'pointer',marginBottom:20}}>
          <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)}/> Aktif
        </label>
        <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'12px 32px'}}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
