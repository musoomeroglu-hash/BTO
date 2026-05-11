'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/haberler', label: 'Haberler', icon: '📰' },
  { href: '/admin/etkinlikler', label: 'Etkinlikler', icon: '📅' },
  { href: '/admin/duyurular', label: 'Duyurular', icon: '📢' },
  { href: '/admin/komisyonlar', label: 'Komisyonlar', icon: '🏛️' },
  { href: '/admin/yonetim-kurulu', label: 'Yönetim Kurulu', icon: '👥' },
  { href: '/admin/unutamadiklari', label: 'Unutamadıklarımız', icon: '🕯️' },
  { href: '/admin/yayinlar', label: 'Yayınlar', icon: '📚' },
  { href: '/admin/mevzuat', label: 'Mevzuat', icon: '⚖️' },
  { href: '/admin/quiz', label: 'Quiz', icon: '❓' },
  { href: '/admin/ste', label: 'STE Portalı', icon: '🎓' },
  { href: '/admin/medya', label: 'Medya', icon: '🖼️' },
  { href: '/admin/iletisim', label: 'İletişim', icon: '💬' },
  { href: '/admin/bulten', label: 'E-Bülten', icon: '📧' },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: '👤', adminOnly: true },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: '⚙️', adminOnly: true },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/admin/giris') return <>{children}</>

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F9FAFB'}}>
      {/* Sidebar */}
      <aside style={{width:240,background:'#1A1A1A',display:'flex',flexDirection:'column',flexShrink:0,position:'fixed',top:0,left:0,height:'100vh',overflowY:'auto'}}>
        <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14,flexShrink:0}}>B</div>
            <div>
              <div style={{color:'white',fontWeight:700,fontSize:13}}>BTO Yönetim</div>
              <div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>Admin Panel</div>
            </div>
          </Link>
        </div>
        <nav style={{flex:1,padding:'12px 0'}}>
          {navItems.filter(item => !item.adminOnly || isSuperAdmin).map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 20px',fontSize:13,fontWeight:active?600:400,color:active?'white':'rgba(255,255,255,0.6)',background:active?'var(--red)':'transparent',borderRadius:active?0:0,transition:'all 0.15s',borderLeft:active?'3px solid rgba(255,255,255,0.5)':'3px solid transparent'}}>
                <span style={{fontSize:16}}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div style={{padding:'12px 20px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          {session?.user && (
            <div style={{marginBottom:12}}>
              <div style={{color:'white',fontSize:12,fontWeight:600}}>{session.user.name}</div>
              <div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>{session.user.role}</div>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/admin/giris' })} style={{width:'100%',padding:'8px',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)',border:'none',borderRadius:8,cursor:'pointer',fontSize:13,transition:'all 0.2s'}}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{flex:1,marginLeft:240,display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{background:'white',borderBottom:'1px solid var(--border)',padding:'0 32px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50}}>
          <div style={{fontSize:14,color:'var(--gray)'}}>
            {navItems.find(n => pathname.startsWith(n.href))?.label ?? 'Dashboard'}
          </div>
          <Link href="/" style={{fontSize:13,color:'var(--red)',fontWeight:600}}>← Siteye Dön</Link>
        </header>
        <main style={{flex:1,overflow:'auto'}}>
          {children}
        </main>
      </div>
    </div>
  )
}
