'use client'
import { useState } from 'react'

export default function EBultenSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const r = await fetch('/api/bulten', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
      setStatus(r.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  return (
    <section className="ebulten-section">
      <div className="section-inner">
        <div className="ebulten-card">
          <div className="sphere sphere-red" style={{width:100,height:100,top:-25,right:200,opacity:.8}}/>
          <div className="sphere sphere-pink" style={{width:70,height:70,bottom:-15,right:80,opacity:.9}}/>
          <div className="ebulten-photo">
            <div style={{background:'linear-gradient(135deg,#fff0ec,#f7cfc5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,borderRadius:'50%',width:'100%',height:'100%'}}>👨‍⚕️</div>
          </div>
          <div className="ebulten-content">
            <h2 className="ebulten-title"><em>Güncel Kalın</em></h2>
            <p>Bilim ve sağlık haberleri doğrudan e-postanıza gelsin! BTO E-Bülteni&apos;ne ücretsiz kayıt olun.</p>
            {status === 'ok' ? (
              <p style={{color:'#4ade80',fontWeight:600,marginTop:16}}>✓ Kayıt başarılı! Teşekkürler.</p>
            ) : (
              <form onSubmit={subscribe} className="ebulten-form">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={status==='loading'} aria-label="Kayıt Ol">→</button>
              </form>
            )}
            {status === 'err' && <p style={{color:'#fca5a5',fontSize:13,marginTop:8}}>Bir hata oluştu. Lütfen tekrar deneyin.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
