'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function YeniSTEKategoriPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    const res = await fetch('/api/ste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        description: fd.get('description'),
        iconEmoji: fd.get('iconEmoji'),
        order: parseInt(fd.get('order') as string) || 0,
      }),
    })

    if (res.ok) {
      router.push('/admin/ste')
      router.refresh()
    } else {
      alert('Hata oluştu')
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <h1>Yeni STE Kategorisi</h1>
      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Kategori Adı *</label>
              <input name="name" className="form-input" required placeholder="Örn: Çocuk Sağlığı ve Hastalıkları"/>
            </div>
            <div className="form-group">
              <label className="form-label">İkon (Emoji)</label>
              <input name="iconEmoji" className="form-input" placeholder="Örn: 👶"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Açıklama</label>
            <textarea name="description" className="form-textarea" rows={3} placeholder="Bu branşın kısa açıklaması..."/>
          </div>
          <div className="form-group" style={{maxWidth:200}}>
            <label className="form-label">Sıralama</label>
            <input name="order" type="number" className="form-input" defaultValue={0}/>
          </div>
          <div style={{display:'flex',gap:12,marginTop:24}}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</button>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={() => router.back()}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  )
}
