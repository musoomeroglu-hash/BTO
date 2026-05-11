'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

interface KurulUyesi {
  id: string; name: string; title: string | null; institution: string | null; photoUrl: string | null; order: number
}
interface Materyal {
  id: string; title: string; type: string; author: string | null; description: string | null; coverUrl: string | null; fileUrl: string | null; publishedAt: string | null
}
interface Kategori {
  id: string; name: string; slug: string; description: string | null; iconEmoji: string | null; order: number; active: boolean
  kurulUyeleri: KurulUyesi[]; materyaller: Materyal[]
}

export default function STEKategoriDetail({ kategori }: { kategori: Kategori }) {
  const router = useRouter()
  const [k, setK] = useState(kategori)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'kurul' | 'materyal'>('info')

  // ─── Kategori güncelle ───
  async function saveKategori(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch(`/api/ste/${k.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        slug: fd.get('slug'),
        description: fd.get('description'),
        iconEmoji: fd.get('iconEmoji'),
        order: parseInt(fd.get('order') as string) || 0,
        active: fd.get('active') === 'on',
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setK(prev => ({ ...prev, ...updated }))
      router.refresh()
    } else alert('Güncelleme hatası')
    setSaving(false)
  }

  // ─── Kategori sil ───
  async function deleteKategori() {
    if (!confirm(`"${k.name}" kategorisini ve tüm içeriğini silmek istediğinize emin misiniz?`)) return
    await fetch(`/api/ste/${k.id}`, { method: 'DELETE' })
    router.push('/admin/ste')
    router.refresh()
  }

  // ─── Kurul Üyesi Ekle ───
  async function addKurulUyesi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/ste/kurul-uyeleri', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('uyeName'),
        title: fd.get('uyeTitle'),
        institution: fd.get('uyeInstitution'),
        photoUrl: fd.get('uyePhoto'),
        order: parseInt(fd.get('uyeOrder') as string) || 0,
        kategoriId: k.id,
      }),
    })
    if (res.ok) {
      const uye = await res.json()
      setK(prev => ({ ...prev, kurulUyeleri: [...prev.kurulUyeleri, uye] }))
      e.currentTarget.reset()
    }
  }

  async function deleteKurulUyesi(id: string) {
    if (!confirm('Bu kurul üyesini silmek istiyor musunuz?')) return
    await fetch(`/api/ste/kurul-uyeleri/${id}`, { method: 'DELETE' })
    setK(prev => ({ ...prev, kurulUyeleri: prev.kurulUyeleri.filter(u => u.id !== id) }))
  }

  // ─── Materyal Ekle ───
  async function addMateryal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/ste/materyaller', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: fd.get('matTitle'),
        type: fd.get('matType'),
        author: fd.get('matAuthor'),
        description: fd.get('matDescription'),
        coverUrl: fd.get('matCover'),
        fileUrl: fd.get('matFile'),
        kategoriId: k.id,
      }),
    })
    if (res.ok) {
      const mat = await res.json()
      setK(prev => ({ ...prev, materyaller: [mat, ...prev.materyaller] }))
      e.currentTarget.reset()
    }
  }

  async function deleteMateryal(id: string) {
    if (!confirm('Bu materyali silmek istiyor musunuz?')) return
    await fetch(`/api/ste/materyaller/${id}`, { method: 'DELETE' })
    setK(prev => ({ ...prev, materyaller: prev.materyaller.filter(m => m.id !== id) }))
  }

  const tabs = [
    { key: 'info' as const, label: 'Bilgiler', icon: '📝' },
    { key: 'kurul' as const, label: `Kurul Üyeleri (${k.kurulUyeleri.length})`, icon: '👥' },
    { key: 'materyal' as const, label: `Materyaller (${k.materyaller.length})`, icon: '📚' },
  ]

  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Link href="/admin/ste" style={{color:'var(--gray)',fontSize:13}}>← STE Portalı</Link>
          <h1 style={{marginBottom:0,display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:32}}>{k.iconEmoji || '📋'}</span>
            {k.name}
          </h1>
        </div>
        <Link href={`/ste/${k.slug}`} target="_blank" className="admin-btn admin-btn-ghost">Sitede Gör ↗</Link>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:0,marginBottom:24,borderBottom:'2px solid var(--border)'}}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding:'12px 24px',
              border:'none',
              background:'transparent',
              fontWeight: activeTab === t.key ? 700 : 400,
              color: activeTab === t.key ? 'var(--red)' : 'var(--gray)',
              borderBottom: activeTab === t.key ? '2px solid var(--red)' : '2px solid transparent',
              marginBottom:-2,
              cursor:'pointer',
              fontSize:14,
              fontFamily:'var(--sans)',
              transition:'all 0.2s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Bilgiler */}
      {activeTab === 'info' && (
        <div className="admin-card">
          <form onSubmit={saveKategori}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Kategori Adı *</label>
                <input name="name" className="form-input" defaultValue={k.name} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input name="slug" className="form-input" defaultValue={k.slug}/>
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">İkon (Emoji)</label>
                <input name="iconEmoji" className="form-input" defaultValue={k.iconEmoji || ''}/>
              </div>
              <div className="form-group">
                <label className="form-label">Sıralama</label>
                <input name="order" type="number" className="form-input" defaultValue={k.order}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <textarea name="description" className="form-textarea" rows={3} defaultValue={k.description || ''}/>
            </div>
            <div className="form-group">
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <input name="active" type="checkbox" defaultChecked={k.active}/>
                <span className="form-label" style={{margin:0}}>Aktif</span>
              </label>
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'space-between',marginTop:24}}>
              <div style={{display:'flex',gap:12}}>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Kaydediliyor…' : 'Güncelle'}</button>
              </div>
              <button type="button" className="admin-btn admin-btn-danger" onClick={deleteKategori}>Kategoriyi Sil</button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Kurul Üyeleri */}
      {activeTab === 'kurul' && (
        <>
          <div className="admin-card">
            <h3 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>Yeni Kurul Üyesi Ekle</h3>
            <form onSubmit={addKurulUyesi}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Ad Soyad *</label>
                  <input name="uyeName" className="form-input" required placeholder="Prof. Dr. Ahmet Yılmaz"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Unvan</label>
                  <input name="uyeTitle" className="form-input" placeholder="Prof. Dr."/>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kurum</label>
                  <input name="uyeInstitution" className="form-input" placeholder="Uludağ Üniversitesi Tıp Fakültesi"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Fotoğraf URL</label>
                  <input name="uyePhoto" className="form-input" placeholder="https://..."/>
                </div>
              </div>
              <div className="form-group" style={{maxWidth:200}}>
                <label className="form-label">Sıralama</label>
                <input name="uyeOrder" type="number" className="form-input" defaultValue={0}/>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary">+ Üye Ekle</button>
            </form>
          </div>

          {k.kurulUyeleri.length > 0 && (
            <div className="admin-card" style={{padding:0}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Unvan</th>
                    <th>Kurum</th>
                    <th>Sıra</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {k.kurulUyeleri.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight:500}}>{u.name}</td>
                      <td style={{color:'var(--gray)'}}>{u.title || '–'}</td>
                      <td style={{color:'var(--gray)'}}>{u.institution || '–'}</td>
                      <td style={{color:'var(--gray)'}}>{u.order}</td>
                      <td>
                        <button onClick={() => deleteKurulUyesi(u.id)} className="admin-btn admin-btn-danger" style={{fontSize:12,padding:'4px 10px'}}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Tab: Materyaller */}
      {activeTab === 'materyal' && (
        <>
          <div className="admin-card">
            <h3 style={{fontFamily:'var(--serif)',fontSize:18,marginBottom:16}}>Yeni Materyal Ekle</h3>
            <form onSubmit={addMateryal}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Başlık *</label>
                  <input name="matTitle" className="form-input" required placeholder="Materyal başlığı"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Tür</label>
                  <select name="matType" className="form-select">
                    <option value="KITAP">📖 Kitap</option>
                    <option value="YAYIN">📄 Yayın / Makale</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Yazar</label>
                  <input name="matAuthor" className="form-input" placeholder="Yazar adı"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Kapak URL</label>
                  <input name="matCover" className="form-input" placeholder="https://..."/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea name="matDescription" className="form-textarea" rows={2} placeholder="Kısa açıklama..."/>
              </div>
              <div className="form-group">
                <label className="form-label">Dosya / Link URL</label>
                <input name="matFile" className="form-input" placeholder="https://..."/>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary">+ Materyal Ekle</button>
            </form>
          </div>

          {k.materyaller.length > 0 && (
            <div className="admin-card" style={{padding:0}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Tür</th>
                    <th>Yazar</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {k.materyaller.map(m => (
                    <tr key={m.id}>
                      <td style={{fontWeight:500}}>{m.title}</td>
                      <td><span className={`badge ${m.type === 'KITAP' ? 'badge-orange' : 'badge-green'}`}>{m.type === 'KITAP' ? '📖 Kitap' : '📄 Yayın'}</span></td>
                      <td style={{color:'var(--gray)'}}>{m.author || '–'}</td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          {m.fileUrl && <a href={m.fileUrl} target="_blank" className="admin-btn admin-btn-ghost" style={{fontSize:12,padding:'4px 10px'}}>Dosya ↗</a>}
                          <button onClick={() => deleteMateryal(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:12,padding:'4px 10px'}}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}
