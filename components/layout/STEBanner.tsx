import { prisma } from '@/lib/prisma'

export default async function STEBanner() {
  const [textRow, activeRow] = await Promise.all([
    prisma.siteAyar.findUnique({ where: { key: 'ste_banner_text' } }),
    prisma.siteAyar.findUnique({ where: { key: 'ste_banner_active' } }),
  ])

  if (activeRow?.value !== 'true') return null
  if (!textRow?.value) return null

  return (
    <div className="ste-banner">
      <div className="ste-banner-inner">
        <p>{textRow.value}</p>
      </div>
    </div>
  )
}
