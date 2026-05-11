'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Komisyon { id: string; name: string }
interface User { id: string; name: string; email: string; username: string; role: string; active: boolean; komisyonId: string | null }

export default function KullaniciForm({ user, komisyonlar }: { user?: User; komisyonlar: Komisyon[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    username: user?.username ?? '',
    password: '',
    role: user?.role ?? 'VIEWER',
    active: user?.active ?? true,
    komisyonId: user?.komisyonId ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: unknown) { setForm(p=>({...p,[k]:v})) }

  async function save() {
    setLoading(true); setError('')
    try {
      const body = { ...form, komisyonId: form.komisyonId || null }
      const url = user ? `/api/kullanicilar/${user.id}` : '/api/kullanicilar'
      const method = user ? 'PUT' : 'POST'
      const r = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!r.ok) { const e = await r.json(); setError(e.error ?? 'Hata'); return }
      router.push('/admin/kullanicilar'); router.refresh()
    } catch { setError('Bağlantı hatası') } finally { setLoading(false) }
  }

  async function del() {
    if (!user || !confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return
    const r = await fetch(`/api/kullanicilar/${user.id}`, { method:'DELETE' })
    if (!r.ok) { const e = await r.json(); setError(e.error); return }
    router.push('/admin/kullanicilar'); router.refresh()
  }

  return (
    <div style={{maxWidth:600}}>
      {error && <div style={{background:'#fee2e2',color:'var(--red-dark)',padding:12,borderRadius:8,marginBottom:20}}>{error}</div>}
      <div className="admin-card">
        <div className="form-grid-2">
          <div className="form-group"><label className="form-label">Ad Soyad *</label><input className="form-input" required value={form.name} onChange={e=>set('name',e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Kullanıcı Adı *</label><input className="form-input" required value={form.username} onChange={e=>set('username',e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">E-posta *</label><input className="form-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)}/></div>
        <div className="form-group"><label className="form-label">{user ? 'Yeni Şifre (boş bırakın = değişmesin)' : 'Şifre *'}</label><input className="form-input" type="password" value={form.password} onChange={e=>set('password',e.target.value)} required={!user}/></div>
        <div className="form-grid-2">
          <div className="form-group"><label className="form-label">Rol</label>
            <select className="form-select" value={form.role} onChange={e=>set('role',e.target.value)}>
              {['SUPER_ADMIN','EDITOR','MODERATOR','KOMISYON_YONETICISI','VIEWER'].map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Komisyon</label>
            <select className="form-select" value={form.komisyonId} onChange={e=>set('komisyonId',e.target.value)}>
              <option value="">— Seçin —</option>
              {komisyonlar.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>
        </div>
        <label style={{display:'flex',alignItems:'center',gap:8,fontSize:14,cursor:'pointer',marginBottom:20}}>
          <input type="checkbox" checked={form.active} onChange={e=>set('active',e.target.checked)}/> Aktif hesap
        </label>
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'space-between',marginTop:8}}>
        <button onClick={save} disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'12px 32px'}}>
          {loading ? 'Kaydediliyor...' : (user ? 'Güncelle' : 'Oluştur')}
        </button>
        {user && <button onClick={del} className="admin-btn admin-btn-danger" style={{padding:'12px 24px'}}>Sil</button>}
      </div>
    </div>
  )
}
