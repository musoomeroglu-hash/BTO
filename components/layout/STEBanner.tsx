import { prisma } from '@/lib/prisma'

export default async function STEBanner() {
  const [textRow, activeRow] = await Promise.all([
    prisma.siteAyar.findUnique({ where: { key: 'ste_banner_text' } }),
    prisma.siteAyar.findUnique({ where: { key: 'ste_banner_active' } }),
  ])

  if (activeRow?.value !== 'true') return null
  if (!textRow?.value) return null

  const text = textRow.value

  return (
    <div className="ste-banner">
      <div className="ste-banner-track">
        <span className="ste-banner-text">{text}</span>
        <span className="ste-banner-sep" aria-hidden>✦</span>
        <span className="ste-banner-text" aria-hidden>{text}</span>
        <span className="ste-banner-sep" aria-hidden>✦</span>
        <span className="ste-banner-text" aria-hidden>{text}</span>
        <span className="ste-banner-sep" aria-hidden>✦</span>
      </div>
    </div>
  )
}
