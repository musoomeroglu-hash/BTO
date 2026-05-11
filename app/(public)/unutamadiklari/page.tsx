export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import UnutamadiklariClient from './UnutamadiklariClient'

export default async function UnutamadiklariPage() {
  const kisiler = await prisma.unutamadigi.findMany({ orderBy: { name: 'asc' } })
  return <UnutamadiklariClient kisiler={kisiler} />
}
