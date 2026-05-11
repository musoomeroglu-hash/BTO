'use client'
import { useEffect, useState } from 'react'

interface Mesaj { id:string; name:string; email:string; subject:string|null; message:string; read:boolean; createdAt:string }

export default function AdminIletisimPage() {
  const [items, setItems] = useState<Mesaj[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  async function load() {
    const r = await fetch(`/api/iletisim?page=${page}`)
    const d = await r.json()
    setItems(d.items)
    setTotal(d.total)
  }
  useEffect(() => { load() }, [page])

  async function toggleRead(id: string, currentRead: boolean) {
    await fetch(`/api/iletisim/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({read: !currentRead}) })
    load()
  }

  async function del(id: string) {
    if (!confirm('Bu mesaj silinsin mi?')) return
    await fetch(`/api/iletisim/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div className="admin-page">
      <h1>İletişim Mesajları</h1>
      
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead><tr><th>Gönderen</th><th>E-posta</th><th>Mesaj</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id} style={{background: m.read ? 'transparent' : 'rgba(210, 35, 42, 0.05)'}}>
                <td><strong>{m.name}</strong></td>
                <td><a href={`mailto:${m.email}`} style={{color:'var(--red)'}}>{m.email}</a></td>
                <td>
                  <div style={{maxWidth:300}}>
                    {m.subject && <strong style={{display:'block',fontSize:12,marginBottom:4}}>{m.subject}</strong>}
                    <span style={{fontSize:13,color:'var(--gray)'}}>{m.message}</span>
                  </div>
                </td>
                <td style={{color:'var(--gray)',whiteSpace:'nowrap'}}>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                  <span className={`badge ${m.read ? 'badge-gray' : 'badge-red'}`}>{m.read ? 'Okundu' : 'Yeni'}</span>
                </td>
                <td>
                  <div style={{display:'flex',gap:6,flexDirection:'column'}}>
                    <button onClick={()=>toggleRead(m.id, m.read)} className="admin-btn admin-btn-ghost" style={{fontSize:11,padding:'3px 8px'}}>
                      {m.read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
                    </button>
                    <button onClick={()=>del(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {Math.ceil(total/20) > 1 && (
          <div style={{display:'flex',gap:8,justifyContent:'center',padding:20,borderTop:'1px solid var(--border)'}}>
            {page > 1 && <button onClick={()=>setPage(p=>p-1)} className="admin-btn admin-btn-ghost">‹ Önceki</button>}
            <span style={{padding:'8px 16px',background:'var(--light-bg)',borderRadius:8}}>{page} / {Math.ceil(total/20)}</span>
            {page < Math.ceil(total/20) && <button onClick={()=>setPage(p=>p+1)} className="admin-btn admin-btn-ghost">Sonraki ›</button>}
          </div>
        )}
      </div>
    </div>
  )
}
