'use client'
import { useEffect, useRef, useState } from 'react'

interface Medya { id:string; filename:string; url:string; mimeType:string; size:number; createdAt:string }

export default function AdminMedyaPage() {
  const [items, setItems] = useState<Medya[]>([])
  const [type, setType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const r = await fetch(`/api/medya?page=${page}${type?`&type=${type}`:''}`)
    const d = await r.json()
    setItems(d.items)
    setTotal(d.total)
  }
  useEffect(() => { load() }, [page, type])

  async function upload(files: FileList) {
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      await fetch('/api/medya', { method: 'POST', body: fd })
    }
    setUploading(false)
    load()
  }

  async function del(id: string, url: string) {
    if (!confirm(`${url} silinsin mi?`)) return
    await fetch(`/api/medya/${id}`, { method: 'DELETE' })
    load()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url)
    alert('URL kopyalandı!')
  }

  function fmt(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB'
    return (bytes/1024/1024).toFixed(1) + ' MB'
  }

  return (
    <div className="admin-page">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
        <h1 style={{marginBottom:0}}>Medya Kütüphanesi</h1>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="admin-btn admin-btn-primary" style={{padding:'10px 24px'}}>
          {uploading ? 'Yükleniyor...' : '+ Dosya Yükle'}
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,.pdf" style={{display:'none'}} onChange={e=>e.target.files&&upload(e.target.files)}/>
      </div>

      <div className="filter-bar" style={{marginBottom:24}}>
        {[['','Tümü'],['image','Görseller'],['pdf','PDF']].map(([v,l])=>(
          <button key={v} onClick={()=>{setType(v);setPage(1)}} className={`filter-btn${type===v?' active':''}`}>{l}</button>
        ))}
      </div>

      <p style={{color:'var(--gray)',fontSize:14,marginBottom:16}}>{total} dosya</p>

      {/* Drop zone */}
      <div onDrop={e=>{e.preventDefault();upload(e.dataTransfer.files)}} onDragOver={e=>e.preventDefault()} style={{border:'2px dashed var(--border)',borderRadius:16,padding:32,textAlign:'center',marginBottom:24,color:'var(--gray)',fontSize:14,cursor:'pointer'}} onClick={()=>inputRef.current?.click()}>
        Dosyaları buraya sürükleyin veya tıklayın
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12}}>
        {items.map(m => (
          <div key={m.id} style={{background:'var(--white)',borderRadius:12,overflow:'hidden',boxShadow:'var(--shadow)'}}>
            <div style={{height:100,background:'var(--light-bg)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
              {m.mimeType.startsWith('image') ? (
                <img src={m.url} alt={m.filename} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              ) : (
                <span style={{fontSize:32}}>📄</span>
              )}
            </div>
            <div style={{padding:'8px 10px'}}>
              <p style={{fontSize:11,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:4}}>{m.filename}</p>
              <p style={{fontSize:10,color:'var(--gray)',marginBottom:8}}>{fmt(m.size)}</p>
              <div style={{display:'flex',gap:4}}>
                <button onClick={()=>copyUrl(m.url)} className="admin-btn admin-btn-ghost" style={{fontSize:10,padding:'2px 6px',flex:1}}>Kopyala</button>
                <button onClick={()=>del(m.id, m.url)} className="admin-btn admin-btn-danger" style={{fontSize:10,padding:'2px 6px'}}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {Math.ceil(total/24) > 1 && (
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:24}}>
          {page > 1 && <button onClick={()=>setPage(p=>p-1)} className="admin-btn admin-btn-ghost" style={{padding:'8px 16px'}}>‹ Önceki</button>}
          <span style={{padding:'8px 16px',background:'var(--white)',borderRadius:8,border:'1px solid var(--border)'}}>{page} / {Math.ceil(total/24)}</span>
          {page < Math.ceil(total/24) && <button onClick={()=>setPage(p=>p+1)} className="admin-btn admin-btn-ghost" style={{padding:'8px 16px'}}>Sonraki ›</button>}
        </div>
      )}
    </div>
  )
}
