import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STE Yayınları — Bursa Tabip Odası',
  description: 'Bursa Tabip Odası STE Yayınları. Sağlık haberleri, etkinlikler, komisyonlar ve eğitim materyalleri.',
  keywords: 'Sürekli Tıp Eğitimi, STE, Bursa Tabip Odası, BTO, hekimler, sağlık, tıp',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
