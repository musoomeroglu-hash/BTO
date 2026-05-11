export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'MODERATOR' | 'KOMISYON_YONETICISI' | 'VIEWER'

export const ROLES: Role[] = ['SUPER_ADMIN', 'EDITOR', 'MODERATOR', 'KOMISYON_YONETICISI', 'VIEWER']

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Süper Admin',
  EDITOR: 'Editör',
  MODERATOR: 'Moderatör',
  KOMISYON_YONETICISI: 'Komisyon Yöneticisi',
  VIEWER: 'İzleyici',
}

export function can(role: string, action: string, komisyonId?: string | null, targetKomisyonId?: string | null): boolean {
  switch (action) {
    case 'dashboard:view': return true
    case 'haber:create': return ['SUPER_ADMIN', 'EDITOR', 'KOMISYON_YONETICISI'].includes(role)
    case 'haber:publish': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'haber:delete': return role === 'SUPER_ADMIN'
    case 'haber:edit':
      if (['SUPER_ADMIN', 'EDITOR'].includes(role)) return true
      if (role === 'KOMISYON_YONETICISI' && komisyonId && targetKomisyonId) return komisyonId === targetKomisyonId
      return false
    case 'etkinlik:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'duyuru:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'komisyon:edit':
      if (role === 'SUPER_ADMIN') return true
      if (role === 'KOMISYON_YONETICISI' && komisyonId && targetKomisyonId) return komisyonId === targetKomisyonId
      return false
    case 'yk:manage': return role === 'SUPER_ADMIN'
    case 'unutamadigi:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'yayin:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'mevzuat:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'quiz:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'ste:manage': return ['SUPER_ADMIN', 'EDITOR'].includes(role)
    case 'medya:upload': return ['SUPER_ADMIN', 'EDITOR', 'KOMISYON_YONETICISI'].includes(role)
    case 'medya:delete': return role === 'SUPER_ADMIN'
    case 'iletisim:view': return ['SUPER_ADMIN', 'MODERATOR'].includes(role)
    case 'kullanici:manage': return role === 'SUPER_ADMIN'
    case 'ayarlar:manage': return role === 'SUPER_ADMIN'
    default: return false
  }
}
