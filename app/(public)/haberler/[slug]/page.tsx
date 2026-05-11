import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'

export default async function HaberDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const haber = await prisma.haber.findUnique({
    where: { slug },
    include: { author: { select: { name: true } }, komisyon: { select: { name: true } } },
  })
  if (!haber || !haber.published) notFound()

  // Increment view count
  await prisma.haber.update({ where: { id: haber.id }, data: { viewCount: { increment: 1 } } })

  return (
    <>
      <div className="page-hero" style={{textAlign:'left'}}>
        <div className="page-hero-inner">
          <div className="news-meta" style={{marginBottom:12}}>
            <Link href="/haberler" style={{color:'var(--red)',fontSize:13}}>← Haberler</Link>
            <span style={{color:'var(--gray)',fontSize:13}}>·</span>
            <span className="card-badge">{haber.category === 'BASIN_ACIKLAMASI' ? 'Basın Açıklaması' : haber.category === 'DUYURU' ? 'Duyuru' : 'Haber'}</span>
          </div>
          <h1>{haber.title}</h1>
          <div className="news-meta" style={{marginTop:12}}>
            <span>{new Date(haber.publishedAt ?? haber.createdAt).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</span>
            <span>·</span>
            <span>{haber.author.name}</span>
            {haber.komisyon && <><span>·</span><span>{haber.komisyon.name}</span></>}
            <span>·</span>
            <span>{haber.viewCount} görüntülenme</span>
          </div>
        </div>
      </div>
      <div className="page-content" style={{maxWidth:800}}>
        {haber.imageUrl && (
          <img src={haber.imageUrl} alt={haber.title} style={{width:'100%',borderRadius:16,marginBottom:32,objectFit:'cover',maxHeight:400}}/>
        )}
        <div className="prose" dangerouslySetInnerHTML={{__html: sanitizeHtml(haber.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']), allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'style'], img: ['src', 'alt', 'width', 'height'] } })}}/>
      </div>
    </>
  )
}
