'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Etkinlik {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  startDate: Date | string
  location: string
}

export default function EtkinlikCarousel({ etkinlikler }: { etkinlikler: Etkinlik[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (etkinlikler.length <= 1) return
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % etkinlikler.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [etkinlikler.length])

  if (etkinlikler.length === 0) return null

  const current = etkinlikler[active]

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="etkinlik-carousel">
      {/* Büyük görsel */}
      <Link href={`/etkinlikler/${current.slug}`} className="etkinlik-carousel-main">
        {current.imageUrl ? (
          <img src={current.imageUrl} alt={current.title} />
        ) : (
          <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1a2a4a,#c44)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'rgba(255,255,255,0.5)',fontSize:48}}>📅</span>
          </div>
        )}
        <div className="etkinlik-carousel-overlay">
          <div className="etkinlik-carousel-meta">{current.location} · {formatDate(current.startDate)}</div>
          <h3 className="etkinlik-carousel-title">{current.title}</h3>
        </div>
      </Link>

      {/* Thumbnail'ler */}
      {etkinlikler.length > 1 && (
        <div className="etkinlik-carousel-thumbs">
          {etkinlikler.map((e, i) => (
            <button
              key={e.id}
              className={`etkinlik-carousel-thumb${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={e.title}
            >
              {e.imageUrl ? (
                <img src={e.imageUrl} alt={e.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              ) : (
                <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1a2a4a,#c44)'}}/>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
