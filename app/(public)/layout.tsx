export const dynamic = 'force-dynamic'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import STEBanner from '@/components/layout/STEBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <STEBanner />
      <Header />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
