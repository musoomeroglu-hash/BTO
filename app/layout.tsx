import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bursa Tabip Odası — Hekimlerin Sesi, Toplumun Güvencesi',
  description: 'Bursa Tabip Odası resmi web sitesi. Sağlık haberleri, etkinlikler, komisyonlar ve üyelik bilgileri.',
  keywords: 'Bursa Tabip Odası, BTO, hekimler, sağlık, tıp',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
