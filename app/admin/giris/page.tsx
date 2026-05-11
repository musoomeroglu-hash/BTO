export const dynamic = 'force-dynamic'
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function GirisPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      username: form.username,
      password: form.password,
    })
    setLoading(false)
    if (res?.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      setError('Kullanıcı adı veya şifre hatalı.')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1A1A1A 0%,#2D1B2E 50%,#4a1020 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'white',borderRadius:24,padding:48,width:'100%',maxWidth:400,boxShadow:'0 24px 80px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{width:60,height:60,borderRadius:'50%',background:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:24,fontWeight:700,margin:'0 auto 16px'}}>B</div>
          <h1 style={{fontFamily:'var(--serif)',fontSize:26,fontWeight:700,marginBottom:6}}>BTO Yönetim Paneli</h1>
          <p style={{color:'var(--gray)',fontSize:14}}>Lütfen giriş yapın</p>
        </div>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Kullanıcı Adı</label>
            <input className="form-input" required autoFocus value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} placeholder="admin"/>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Şifre</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="••••••••"/>
          </div>
          {error && <p style={{color:'var(--red)',fontSize:13,textAlign:'center'}}>{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{padding:'14px',borderRadius:12,fontSize:15,marginTop:8}}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
