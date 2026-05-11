import SessionProviderWrapper from '@/components/admin/SessionProviderWrapper'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>
}
