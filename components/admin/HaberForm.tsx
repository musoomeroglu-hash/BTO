'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Komisyon { id: string; name: string }
interface Haber {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  category: string
  imageUrl: string | null
  featured: boolean
  published: boolean
  komisyonId: string | null
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}

export default function HaberForm({ haber, komisyonlar }: { haber?: Haber; komisyonlar: Komisyon[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: haber?.title ?? '',
    slug: haber?.slug ?? '',
    excerpt: haber?.excerpt ?? '',
    content: haber?.content ?? '',
    category: haber?.category ?? 'HABER',
    imageUrl: haber?.imageUrl ?? '',
    featured: haber?.featured ?? false,
    published: haber?.published ?? false,
    komisyonId: haber?.komisyonId ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: unknown) { setForm(p => ({...p, [k]: v})) }

  function onTitleChange(v: string) {
    set('title', v)
    if (!haber) set('slug', slugify(v))
  }

  async function save(publish: boolean) {
    setLoading(true)
    setError('')
    try {
      const body = { ...form, published: publish }
      const url = haber ? `/api/haberler/${haber.id}` : '/api/haberler'
      const method = haber ? 'PUT' : 'POST'
      const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!r.ok) { const e = await r.json(); setError(e.error ?? 'Hata'); return }
      router.push('/admin/haberler')
      router.refresh()
    } catch { setError('Bağlantı hatası') }
    finally { setLoading(false) }
  }

  async function deleteHaber() {
    if (!haber || !confirm('Bu haberi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/haberler/${haber.id}`, { method: 'DELETE' })
    router.push('/admin/haberler')
    router.refresh()
  }

  return (
    <div style={{maxWidth:900}}>
      {error && <div style={{background:'#fee2e2',color:'var(--red-dark)',padding:12,borderRadius:8,marginBottom:20,fontSize:14}}>{error}</div>}
      <div className="admin-card">
        <div className="form-group">
          <label className="form-label">Başlık *</label>
          <input className="form-input" required value={form.title} onChange={e=>onTitleChange(e.target.value)} placeholder="Haber başlığı"/>
        </div>
        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="haber-basligi"/>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
              <option value="HABER">Haber</option>
              <option value="BASIN_ACIKLAMASI">Basın Açıklaması</option>
              <option value="DUYURU">Duyuru</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Komisyon (opsiyonel)</label>
            <select className="form-select" value={form.komisyonId} onChange={e=>set('komisyonId',e.target.value)}>
              <option value="">— Seçin —</option>
              {komisyonlar.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Öne Çıkan Görsel URL</label>
          <input className="form-input" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://..."/>
        </div>
        <div className="form-group">
          <label className="form-label">Özet</label>
          <textarea className="form-textarea" rows={3} value={form.excerpt} onChange={e=>set('excerpt',e.target.value)} placeholder="Kısa özet..."/>
        </div>
        <div className="form-group">
          <label className="form-label">İçerik *</label>
          <textarea className="form-textarea" rows={16} value={form.content} onChange={e=>set('content',e.target.value)} placeholder="Haber içeriği (HTML desteklenir)..." style={{fontFamily:'monospace',fontSize:13}}/>
        </div>
        <div style={{display:'flex',gap:16,marginBottom:8}}>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14}}>
            <input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)}/> Öne Çıkar
          </label>
        </div>
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'space-between',alignItems:'center',marginTop:8}}>
        <div style={{display:'flex',gap:12}}>
          <button onClick={() => save(false)} disabled={loading} className="admin-btn admin-btn-ghost" style={{padding:'12px 24px'}}>Taslak Kaydet</button>
          <button onClick={() => save(true)} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'12px 24px'}}>
            {loading ? 'Kaydediliyor...' : (form.published ? 'Güncelle' : 'Yayınla')}
          </button>
        </div>
        {haber && <button onClick={deleteHaber} className="admin-btn admin-btn-danger" style={{padding:'12px 24px'}}>Sil</button>}
      </div>
    </div>
  )
}
