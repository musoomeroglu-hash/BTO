import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import sanitizeHtml from 'sanitize-html'

export default async function KomisyonDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const komisyon = await prisma.komisyon.findUnique({
    where: { slug, active: true },
    include: {
      haberler: { where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 6 },
    },
  })
  if (!komisyon) notFound()

  return (
    <>
      <div className="page-hero" style={{textAlign:'left',background:'var(--dark)',color:'white'}}>
        <div className="page-hero-inner">
          <Link href="/komisyonlar" style={{color:'rgba(255,255,255,0.7)',fontSize:13}}>← Komisyonlar</Link>
          <h1 style={{color:'white',marginTop:12}}>{komisyon.name}</h1>
          {komisyon.chairName && <p style={{color:'rgba(255,255,255,0.8)',marginTop:8}}>Komisyon Başkanı: {komisyon.chairName}</p>}
        </div>
      </div>
      <div className="page-content">
        {komisyon.description && <p style={{fontSize:18,color:'var(--body)',marginBottom:32,lineHeight:1.7}}>{komisyon.description}</p>}
        {komisyon.content && <div className="prose" dangerouslySetInnerHTML={{__html: sanitizeHtml(komisyon.content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']), allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['class', 'style'], img: ['src', 'alt', 'width', 'height'] } })}}/>}

        {komisyon.haberler.length > 0 && (
          <>
            <h2 style={{marginTop:64,marginBottom:24}}>Komisyon Haberleri</h2>
            <div className="cards-grid">
              {komisyon.haberler.map(h => (
                <Link href={`/haberler/${h.slug}`} key={h.id} className="news-card">
                  <div className="news-card-img">
                    {h.imageUrl ? <img src={h.imageUrl} alt={h.title}/> : <div style={{background:'linear-gradient(135deg,#f0e0e0,#c44)',width:'100%',height:'100%'}}/>}
                  </div>
                  <div className="news-card-body">
                    <h3>{h.title}</h3>
                    {h.excerpt && <p>{h.excerpt}</p>}
                    <span style={{color:'var(--red)',fontSize:13,fontWeight:600}}>Devamını Oku →</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
