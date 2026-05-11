export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'

export default async function EtkinlikDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const etkinlik = await prisma.etkinlik.findUnique({ where: { slug } })
  if (!etkinlik || !etkinlik.published) notFound()

  function fmtDate(d: Date | string) {
    return new Date(d).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })
  }

  return (
    <>
      <div className="page-hero" style={{textAlign:'left'}}>
        <div className="page-hero-inner">
          <Link href="/etkinlikler" style={{color:'var(--red)',fontSize:13}}>← Etkinlikler</Link>
          <h1 style={{marginTop:12}}>{etkinlik.title}</h1>
          <div className="news-meta" style={{marginTop:12}}>
            <span>📍 {etkinlik.location}</span>
            <span>·</span>
            <span>📅 {fmtDate(etkinlik.startDate)} — {fmtDate(etkinlik.endDate)}</span>
          </div>
        </div>
      </div>
      <div className="page-content" style={{maxWidth:800}}>
        {etkinlik.imageUrl && <img src={etkinlik.imageUrl} alt={etkinlik.title} style={{width:'100%',borderRadius:16,marginBottom:32,objectFit:'cover',maxHeight:400}}/>}
        {etkinlik.description && <p style={{fontSize:18,color:'var(--body)',marginBottom:24,lineHeight:1.7}}>{etkinlik.description}</p>}
        {etkinlik.content && <div className="prose" dangerouslySetInnerHTML={{__html: sanitizeHtml(etkinlik.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']), allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'style'], img: ['src', 'alt', 'width', 'height'] } })}}/>}
      </div>
    </>
  )
}
