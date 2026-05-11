'use client'
import { useEffect, useState } from 'react'

interface Abone { id:string; email:string; confirmed:boolean; createdAt:string }

export default function AdminBultenPage() {
  const [items, setItems] = useState<Abone[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  async function load() {
    const r = await fetch(`/api/bulten/list?page=${page}`)
    const d = await r.json()
    setItems(d.items)
    setTotal(d.total)
  }
  useEffect(() => { load() }, [page])

  async function del(id: string) {
    if (!confirm('Bu abone silinsin mi?')) return
    await fetch(`/api/bulten/list?id=${id}`, { method:'DELETE' })
    load()
  }

  function exportCsv() {
    const header = "Email,KayitTarihi\n";
    const csv = items.map(i => `${i.email},${new Date(i.createdAt).toLocaleDateString('tr-TR')}`).join('\n');
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulten-aboneleri-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>E-Bülten Aboneleri</h1>
        <button onClick={exportCsv} className="admin-btn admin-btn-primary" style={{padding:'10px 20px'}}>CSV İndir</button>
      </div>
      
      <div className="admin-card" style={{padding:0}}>
        <table className="admin-table">
          <thead><tr><th>E-posta</th><th>Kayıt Tarihi</th><th>İşlem</th></tr></thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id}>
                <td><strong>{m.email}</strong></td>
                <td style={{color:'var(--gray)'}}>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                  <button onClick={()=>del(m.id)} className="admin-btn admin-btn-danger" style={{fontSize:11,padding:'3px 8px'}}>Sil</button>
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
