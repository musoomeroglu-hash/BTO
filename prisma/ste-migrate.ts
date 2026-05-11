import { createClient } from '@libsql/client'

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const stmts = [
    `CREATE TABLE IF NOT EXISTS "SteKategori" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "description" TEXT,
      "iconEmoji" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "active" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "SteKategori_slug_key" ON "SteKategori"("slug")`,
    `CREATE TABLE IF NOT EXISTS "SteKurulUyesi" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "title" TEXT,
      "institution" TEXT,
      "photoUrl" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "kategoriId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("kategoriId") REFERENCES "SteKategori"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "SteMateryal" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'KITAP',
      "author" TEXT,
      "description" TEXT,
      "coverUrl" TEXT,
      "fileUrl" TEXT,
      "publishedAt" DATETIME,
      "kategoriId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("kategoriId") REFERENCES "SteKategori"("id") ON DELETE CASCADE
    )`,
  ]

  for (const s of stmts) {
    try {
      await client.execute(s)
      console.log('✓', s.trim().slice(0, 60))
    } catch (e: any) {
      console.error('✗', e.message)
    }
  }

  client.close()
  console.log('Done!')
}

main().catch(console.error)
