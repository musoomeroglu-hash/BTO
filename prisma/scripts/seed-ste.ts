import { PrismaClient } from '../../app/generated/prisma/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const adapter = new PrismaLibSql({ url: `file:${path.resolve(__dirname, '../../dev.db')}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🎓 STE Seed başlıyor...')

  // STE Kategorileri
  const steKategoriler = [
    { name: 'Çocuk Sağlığı ve Hastalıkları', slug: 'cocuk-sagligi', description: 'Pediatri alanında sürekli tıp eğitimi programları ve güncel gelişmeler.', iconEmoji: '👶', order: 1 },
    { name: 'Dahiliye (İç Hastalıkları)', slug: 'dahiliye', description: 'İç hastalıkları branşında güncel tanı ve tedavi yaklaşımları.', iconEmoji: '🫀', order: 2 },
    { name: 'Genel Cerrahi', slug: 'genel-cerrahi', description: 'Cerrahi yenilikler, minimal invaziv teknikler ve hasta güvenliği.', iconEmoji: '🔬', order: 3 },
    { name: 'Kadın Hastalıkları ve Doğum', slug: 'kadin-hastaliklari', description: 'Jinekoloji ve obstetrik alanında güncel bilgi ve eğitim materyalleri.', iconEmoji: '🤱', order: 4 },
    { name: 'Kardiyoloji', slug: 'kardiyoloji', description: 'Kalp ve damar hastalıkları alanında güncel tedavi protokolleri.', iconEmoji: '❤️', order: 5 },
    { name: 'Nöroloji', slug: 'noroloji', description: 'Nörolojik hastalıkların tanı ve tedavisinde güncel yaklaşımlar.', iconEmoji: '🧠', order: 6 },
    { name: 'Ortopedi ve Travmatoloji', slug: 'ortopedi', description: 'Kas-iskelet sistemi hastalıkları ve travma cerrahisinde güncel bilgiler.', iconEmoji: '🦴', order: 7 },
    { name: 'Göz Hastalıkları', slug: 'goz-hastaliklari', description: 'Oftalmoloji alanında güncel cerrahi ve medikal tedavi yaklaşımları.', iconEmoji: '👁️', order: 8 },
    { name: 'Kulak Burun Boğaz', slug: 'kulak-burun-bogaz', description: 'KBB alanında güncel tanı ve tedavi yöntemleri.', iconEmoji: '👂', order: 9 },
    { name: 'Acil Tıp', slug: 'acil-tip', description: 'Acil tıp uygulamalarında kanıta dayalı protokoller ve algoritmalar.', iconEmoji: '🚑', order: 10 },
    { name: 'Psikiyatri', slug: 'psikiyatri', description: 'Ruh sağlığı alanında güncel tedavi yaklaşımları ve psikoterapiler.', iconEmoji: '🧠', order: 11 },
    { name: 'Radyoloji', slug: 'radyoloji', description: 'Görüntüleme yöntemlerinde güncel gelişmeler ve yapay zeka uygulamaları.', iconEmoji: '📡', order: 12 },
  ]

  const createdKategoriler: Array<{ id: string; slug: string }> = []
  for (const sk of steKategoriler) {
    const created = await prisma.steKategori.upsert({
      where: { slug: sk.slug },
      update: {},
      create: { ...sk, active: true },
    })
    createdKategoriler.push({ id: created.id, slug: created.slug })
  }
  console.log('✓ STE Kategorileri oluşturuldu')

  // STE Kurul Üyeleri
  const kurulData = [
    { kategoriSlug: 'cocuk-sagligi', members: [
      { name: 'Prof. Dr. Ayşe Kara', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Mehmet Yıldız', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
      { name: 'Uzm. Dr. Fatma Demir', title: 'Uzm. Dr.', institution: 'Bursa Çekirge Devlet Hastanesi', order: 3 },
    ]},
    { kategoriSlug: 'dahiliye', members: [
      { name: 'Prof. Dr. Ali Özkan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Prof. Dr. Zeynep Acar', title: 'Prof. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'genel-cerrahi', members: [
      { name: 'Prof. Dr. Hasan Çelik', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Emre Toprak', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
      { name: 'Uzm. Dr. Selin Korkmaz', title: 'Uzm. Dr.', institution: 'Medicana Hastanesi', order: 3 },
    ]},
  ]

  for (const kd of kurulData) {
    const kat = createdKategoriler.find(k => k.slug === kd.kategoriSlug)
    if (kat) {
      for (const m of kd.members) {
        await prisma.steKurulUyesi.create({ data: { ...m, kategoriId: kat.id } }).catch(() => {})
      }
    }
  }
  console.log('✓ STE Kurul Üyeleri oluşturuldu')

  // STE Materyaller
  const materyalData = [
    { kategoriSlug: 'cocuk-sagligi', items: [
      { title: 'Pediatrik Acil Durumlar El Kitabı', type: 'KITAP', author: 'Prof. Dr. Ayşe Kara', description: 'Çocuklarda sık karşılaşılan acil durumların yönetimi.' },
      { title: 'Çocukluk Çağı Aşıları Güncel Rehber 2026', type: 'YAYIN', author: 'BTO STE Komisyonu', description: 'Türkiye ulusal aşı takvimi ve güncel öneriler.' },
      { title: 'Neonatal Resüsitasyon Protokolü', type: 'YAYIN', author: 'Doç. Dr. Mehmet Yıldız', description: 'Yenidoğan resüsitasyonunda güncel algoritmalar.' },
    ]},
    { kategoriSlug: 'dahiliye', items: [
      { title: 'İç Hastalıkları Tanı ve Tedavi Kılavuzu', type: 'KITAP', author: 'Prof. Dr. Ali Özkan', description: 'Dahili hastalıklarda kanıta dayalı tedavi yaklaşımları.' },
      { title: 'Diyabet Yönetimi 2026 Güncelleme', type: 'YAYIN', author: 'Prof. Dr. Zeynep Acar', description: 'Tip 2 diyabet tedavisinde yeni ajanlar ve yaşam tarzı müdahaleleri.' },
    ]},
    { kategoriSlug: 'genel-cerrahi', items: [
      { title: 'Laparoskopik Cerrahi Atlas', type: 'KITAP', author: 'Prof. Dr. Hasan Çelik', description: 'Minimal invaziv cerrahi tekniklerin görsel rehberi.' },
      { title: 'Cerrahi Yara Bakımı Protokolleri', type: 'YAYIN', author: 'Doç. Dr. Emre Toprak', description: 'Postoperatif yara bakımında güncel yaklaşımlar.' },
    ]},
    { kategoriSlug: 'kardiyoloji', items: [
      { title: 'Akut Koroner Sendrom Yönetimi', type: 'KITAP', author: 'BTO Kardiyoloji Kurulu', description: 'AKS tanı ve tedavisinde güncel algoritmalar.' },
      { title: 'Kalp Yetmezliği Tedavi Rehberi 2026', type: 'YAYIN', author: 'BTO STE Komisyonu', description: 'Kronik kalp yetmezliğinde kanıta dayalı tedavi yaklaşımları.' },
    ]},
  ]

  for (const md of materyalData) {
    const kat = createdKategoriler.find(k => k.slug === md.kategoriSlug)
    if (kat) {
      for (const item of md.items) {
        await prisma.steMateryal.create({ data: { ...item, kategoriId: kat.id } }).catch(() => {})
      }
    }
  }
  console.log('✓ STE Materyalleri oluşturuldu')

  console.log('\n✅ STE Seed tamamlandı!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
