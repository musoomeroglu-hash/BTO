import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const sql = readFileSync(join(__dirname, 'migrations/20260511143240_init/migration.sql'), 'utf8')

  const statements = sql
    .split(';')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0)

  console.log(`${statements.length} SQL ifadesi uygulanacak...`)

  for (const stmt of statements) {
    try {
      await client.execute(stmt)
      console.log('✓', stmt.slice(0, 60))
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log('↷ Zaten var:', stmt.slice(0, 60))
      } else {
        console.error('✗ Hata:', e.message, '\n  SQL:', stmt.slice(0, 60))
      }
    }
  }

  console.log('\n✅ Migration tamamlandı!')
  client.close()
}

main().catch(console.error)
