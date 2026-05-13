import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sürekli Tıp Eğitimi — Bursa Tabip Odası',
  description: 'Bursa Tabip Odası Sürekli Tıp Eğitimi Portalı. Sağlık haberleri, etkinlikler, komisyonlar ve üyelik bilgileri.',
  keywords: 'Sürekli Tıp Eğitimi, STE, Bursa Tabip Odası, BTO, hekimler, sağlık, tıp',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
