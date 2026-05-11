'use client'
import { SessionProvider } from 'next-auth/react'
import AdminShell from './AdminShell'

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  )
}
