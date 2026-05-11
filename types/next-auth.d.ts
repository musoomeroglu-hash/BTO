import type { Role } from '@/lib/permissions'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: Role
      komisyonId: string | null
    }
  }
  interface User {
    role: Role
    komisyonId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    komisyonId: string | null
  }
}
