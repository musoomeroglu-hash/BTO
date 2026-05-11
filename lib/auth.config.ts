import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/admin/giris',
    error: '/admin/giris',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.komisyonId = (user as any).komisyonId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.komisyonId = token.komisyonId as any
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig
