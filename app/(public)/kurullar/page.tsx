import { prisma } from '@/lib/prisma'

const denetlemeKurulu = [
  { ad: 'Dr. Ahmet Yıldız', gorev: 'Başkan' },
  { ad: 'Dr. Fatma Şahin', gorev: 'Üye' },
  { ad: 'Dr. Mehmet Aktaş', gorev: 'Üye' },
]
const onurKurulu = [
  { ad: 'Dr. Hasan Erdoğan', gorev: 'Başkan' },
  { ad: 'Dr. Ayşe Kara', gorev: 'Üye' },
  { ad: 'Dr. Ali Çelik', gorev: 'Üye' },
]

export default async function KurullarPage() {
  const ykUyeleri = await prisma.yonetimKurulu.findMany({ where: { active: true }, orderBy: { order: 'asc' } })

  function KurulSection({ id, title, members }: { id:string; title:string; members:{ad:string;gorev:string}[] }) {
    return (
      <div id={id} style={{marginBottom:64}}>
        <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:700,marginBottom:24,paddingBottom:16,borderBottom:'2px solid var(--red)'}}>
          {title}
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {members.map((m,i) => (
            <div key={i} style={{background:'var(--white)',borderRadius:12,padding:24,boxShadow:'var(--shadow)',display:'flex',gap:16,alignItems:'center'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#f0e0e0,#d9917e)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>👤</div>
              <div>
                <strong style={{display:'block',fontSize:15}}>{m.ad}</strong>
                <span style={{fontSize:13,color:'var(--gray)'}}>{m.gorev}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">KURULLAR</div>
          <h1>BTO Kurulları</h1>
          <p>Yönetim, denetleme ve onur kurullarımız</p>
        </div>
      </div>
      <div className="page-content">
        <div id="yonetim" style={{marginBottom:64}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:700,marginBottom:24,paddingBottom:16,borderBottom:'2px solid var(--red)'}}>
            Yönetim Kurulu
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {ykUyeleri.map(m => (
              <div key={m.id} style={{background:'var(--white)',borderRadius:12,padding:24,boxShadow:'var(--shadow)',display:'flex',gap:16,alignItems:'center'}}>
                <div style={{width:60,height:60,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'2px solid var(--border)'}}>
                  {m.photoUrl ? <img src={m.photoUrl} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{background:'linear-gradient(135deg,#f0e0e0,#d9917e)',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>👤</div>}
                </div>
                <div>
                  <strong style={{display:'block',fontSize:15,color: m.position==='Başkan' ? 'var(--red)' : 'var(--text)'}}>{m.title} {m.name}</strong>
                  <span style={{fontSize:13,color:'var(--gray)'}}>{m.position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <KurulSection id="denetleme" title="Denetleme Kurulu" members={denetlemeKurulu}/>
        <KurulSection id="onur" title="Onur Kurulu" members={onurKurulu}/>
      </div>
    </>
  )
}
