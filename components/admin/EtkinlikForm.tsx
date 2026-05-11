'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Etkinlik {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  location: string
  startDate: Date
  endDate: Date
  imageUrl: string | null
  published: boolean
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}

function toDateInput(d: Date | string) {
  return new Date(d).toISOString().slice(0,16)
}

export default function EtkinlikForm({ etkinlik }: { etkinlik?: Etkinlik }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: etkinlik?.title ?? '',
    slug: etkinlik?.slug ?? '',
    description: etkinlik?.description ?? '',
    content: etkinlik?.content ?? '',
    location: etkinlik?.location ?? 'Bursa',
    startDate: etkinlik ? toDateInput(etkinlik.startDate) : '',
    endDate: etkinlik ? toDateInput(etkinlik.endDate) : '',
    imageUrl: etkinlik?.imageUrl ?? '',
    published: etkinlik?.published ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: unknown) { setForm(p => ({...p, [k]: v})) }

  async function save(publish: boolean) {
    setLoading(true); setError('')
    try {
      const body = { ...form, published: publish }
      const url = etkinlik ? `/api/etkinlikler/${etkinlik.id}` : '/api/etkinlikler'
      const method = etkinlik ? 'PUT' : 'POST'
      const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!r.ok) { const e = await r.json(); setError(e.error ?? 'Hata'); return }
      router.push('/admin/etkinlikler'); router.refresh()
    } catch { setError('Bağlantı hatası') } finally { setLoading(false) }
  }

  async function del() {
    if (!etkinlik || !confirm('Silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/etkinlikler/${etkinlik.id}`, { method: 'DELETE' })
    router.push('/admin/etkinlikler'); router.refresh()
  }

  return (
    <div style={{maxWidth:800}}>
      {error && <div style={{background:'#fee2e2',color:'var(--red-dark)',padding:12,borderRadius:8,marginBottom:20}}>{error}</div>}
      <div className="admin-card">
        <div className="form-group">
          <label className="form-label">Başlık *</label>
          <input className="form-input" required value={form.title} onChange={e=>{set('title',e.target.value);if(!etkinlik)set('slug',slugify(e.target.value))}}/>
        </div>
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" value={form.slug} onChange={e=>set('slug',e.target.value)}/>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Başlangıç Tarihi *</label>
            <input className="form-input" type="datetime-local" value={form.startDate} onChange={e=>set('startDate',e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Bitiş Tarihi *</label>
            <input className="form-input" type="datetime-local" value={form.endDate} onChange={e=>set('endDate',e.target.value)}/>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Konum</label>
          <input className="form-input" value={form.location} onChange={e=>set('location',e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Görsel URL</label>
          <input className="form-input" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea className="form-textarea" rows={3} value={form.description} onChange={e=>set('description',e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">İçerik (HTML)</label>
          <textarea className="form-textarea" rows={10} value={form.content} onChange={e=>set('content',e.target.value)} style={{fontFamily:'monospace',fontSize:13}}/>
        </div>
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'space-between',marginTop:8}}>
        <div style={{display:'flex',gap:12}}>
          <button onClick={() => save(false)} disabled={loading} className="admin-btn admin-btn-ghost" style={{padding:'12px 24px'}}>Taslak</button>
          <button onClick={() => save(true)} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'12px 24px'}}>{loading ? 'Kaydediliyor...' : 'Yayınla'}</button>
        </div>
        {etkinlik && <button onClick={del} className="admin-btn admin-btn-danger" style={{padding:'12px 24px'}}>Sil</button>}
      </div>
    </div>
  )
}
