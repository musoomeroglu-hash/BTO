'use client'
import { useState } from 'react'

export default function IletisimForm() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')

  function set(k: string, v: string) { setForm(prev => ({...prev, [k]: v})) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/iletisim', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      setStatus(r.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  if (status === 'ok') {
    return (
      <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:16,padding:32,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <h3 style={{fontFamily:'var(--serif)',fontSize:24,marginBottom:8}}>Mesajınız iletildi!</h3>
        <p style={{color:'var(--body)'}}>En kısa sürede size dönüş yapacağız.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{marginBottom:24}}>Bize Yazın</h2>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
        <div className="form-grid-2">
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Ad Soyad *</label>
            <input className="form-input" required value={form.name} onChange={e=>set('name',e.target.value)}/>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">E-posta *</label>
            <input className="form-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)}/>
          </div>
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Konu</label>
          <input className="form-input" value={form.subject} onChange={e=>set('subject',e.target.value)}/>
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Mesaj *</label>
          <textarea className="form-textarea" required value={form.message} onChange={e=>set('message',e.target.value)} rows={5}/>
        </div>
        {status === 'err' && <p style={{color:'var(--red)',fontSize:13}}>Bir hata oluştu. Lütfen tekrar deneyin.</p>}
        <button type="submit" className="admin-btn admin-btn-primary" disabled={status==='loading'} style={{padding:'14px 32px',borderRadius:12,fontSize:15}}>
          {status === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
    </div>
  )
}
