import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'

const adapter = new PrismaLibSql({ url: `file:${path.resolve(__dirname, '../dev.db')}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seed başlıyor...')

  // Admin kullanıcı
  const adminHash = await bcrypt.hash('bto2026!', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Sistem Yöneticisi',
      email: 'admin@bto.org.tr',
      username: 'admin',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      active: true,
    },
  })

  const editorHash = await bcrypt.hash('editor2026!', 12)
  await prisma.user.upsert({
    where: { username: 'editor' },
    update: {},
    create: {
      name: 'İçerik Editörü',
      email: 'editor@bto.org.tr',
      username: 'editor',
      passwordHash: editorHash,
      role: 'EDITOR',
      active: true,
    },
  })

  console.log('✓ Kullanıcılar oluşturuldu')

  // 15 Komisyon
  const komisyonlar = [
    { name: 'Özel Hekimlik Komisyonu', slug: 'ozel-hekimlik', description: 'Özel hekimlik uygulamaları ve politikaları ile ilgilenen komisyon.', order: 1 },
    { name: 'Sürekli Tıp Eğitimi Komisyonu', slug: 'sureklitip-egitimi', description: 'Hekimlerin mesleki gelişimini destekleyen eğitim programları düzenleyen komisyon.', order: 2 },
    { name: 'Yayın Kurulu', slug: 'yayin-kurulu', description: 'Hekimce Bakış dergisi ve diğer BTO yayınlarını yöneten kurul.', order: 3 },
    { name: 'Burs Komisyonu', slug: 'burs', description: 'Tıp öğrencilerine burs imkânı sağlayan komisyon.', order: 4 },
    { name: 'Çevre Komisyonu', slug: 'cevre', description: 'Çevre sağlığı sorunlarını ele alan ve politika üreten komisyon.', order: 5 },
    { name: 'Aile Hekimliği Komisyonu', slug: 'aile-hekimligi', description: 'Birinci basamak sağlık hizmetleri ve aile hekimliğine odaklanan komisyon.', order: 6 },
    { name: 'İşçi Sağlığı ve İşyeri Hekimliği Komisyonu', slug: 'isci-sagligi', description: 'Çalışan sağlığı ve işyeri hekimliği alanında faaliyet gösteren komisyon.', order: 7 },
    { name: 'Kültür-Sanat Komisyonu', slug: 'kultur-sanat', description: 'Hekimler arasında kültürel ve sanatsal faaliyetler düzenleyen komisyon.', order: 8 },
    { name: 'Spor Komisyonu', slug: 'spor', description: 'Hekimlerin sportif faaliyetlerini organize eden komisyon.', order: 9 },
    { name: 'İnsan Hakları Komisyonu', slug: 'insan-haklari', description: 'Sağlık hakkı ve insan hakları alanında çalışan komisyon.', order: 10 },
    { name: 'Sağlık Politikaları Komisyonu', slug: 'saglik-politikalari', description: 'Ulusal ve yerel sağlık politikalarını izleyen ve değerlendiren komisyon.', order: 11 },
    { name: 'Olağandışı Durumlarda Sağlık Hizmetleri Komisyonu', slug: 'olagandisi-durumlar', description: 'Afet ve olağandışı durumlarda sağlık hizmetleri koordinasyonu.', order: 12 },
    { name: 'Kadın Hekimlik ve Kadın Sağlığı Komisyonu', slug: 'kadin-hekimlik', description: 'Kadın hekimlerin sorunları ve kadın sağlığı politikaları ile ilgilenen komisyon.', order: 13 },
    { name: 'Emekli Hekimler Komisyonu', slug: 'emekli-hekimler', description: 'Emekli hekimlerin mesleki ve sosyal haklarını destekleyen komisyon.', order: 14 },
    { name: 'Halk Sağlığı Komisyonu', slug: 'halk-sagligi', description: 'Toplum sağlığı sorunları ve koruyucu sağlık hizmetleri alanında çalışan komisyon.', order: 15 },
  ]

  for (const k of komisyonlar) {
    await prisma.komisyon.upsert({
      where: { slug: k.slug },
      update: {},
      create: { ...k, active: true },
    })
  }
  console.log('✓ Komisyonlar oluşturuldu')

  // Yönetim Kurulu
  const ykUyeleri = [
    { name: 'Dr. Ferda Firdin', title: 'Dr.', position: 'Başkan', order: 1, startYear: 2024, active: true },
    { name: 'Dr. Deniz Alpan', title: 'Dr.', position: 'Genel Sekreter', order: 2, startYear: 2024, active: true },
    { name: 'Dr. Serdar Sarıtaş', title: 'Dr.', position: 'Sayman', order: 3, startYear: 2024, active: true },
    { name: 'Dr. Özlem Sezen', title: 'Dr.', position: 'Veznedar', order: 4, startYear: 2024, active: true },
    { name: 'Dr. Bülent Aslanhan', title: 'Dr.', position: 'Yönetim Kurulu Üyesi', order: 5, startYear: 2024, active: true },
    { name: 'Dr. Ufuk Aydın', title: 'Dr.', position: 'Yönetim Kurulu Üyesi', order: 6, startYear: 2024, active: true },
  ]

  for (const yk of ykUyeleri) {
    await prisma.yonetimKurulu.create({ data: yk }).catch(() => {})
  }
  console.log('✓ Yönetim Kurulu oluşturuldu')

  // Örnek Haberler
  const haberler = [
    {
      title: 'BTO Özel Hekimlik Komisyonu Toplantısı Gerçekleştirildi',
      slug: 'bto-ozel-hekimlik-komisyonu-toplantisi',
      excerpt: 'Bursa Tabip Odası Özel Hekimlik Komisyonu düzenlenen toplantıda güncel sağlık politikaları değerlendirildi.',
      content: '<p>Bursa Tabip Odası Özel Hekimlik Komisyonu, 8 Mayıs 2026 tarihinde BTO merkez binasında gerçekleştirilen toplantıda güncel sağlık politikalarını ve özel hekimlik mevzuatındaki son değişiklikleri kapsamlı biçimde ele aldı.</p><p>Toplantıya komisyon başkanı ve tüm üyeler katıldı. Gündem maddeleri arasında özel hastane ücret tarifeleri, hasta hakları uygulamaları ve malpraktis sigortası konuları yer aldı.</p>',
      category: 'HABER',
      featured: true,
      published: true,
      publishedAt: new Date('2026-05-08'),
      authorId: admin.id,
    },
    {
      title: 'Bursa Tabip Odasından Bursa Valisine Ziyaret',
      slug: 'bto-bursa-valisine-ziyaret',
      excerpt: 'BTO yönetimi, sağlık alanındaki güncel sorunları paylaşmak üzere Bursa Valisini ziyaret etti.',
      content: '<p>Bursa Tabip Odası Başkanı Dr. Ferda Firdin liderliğindeki BTO yönetim kurulu, Bursa Valisi\'ni makamında ziyaret ederek Bursa\'daki sağlık hizmetlerine ilişkin güncel sorunları aktardı.</p>',
      category: 'HABER',
      featured: false,
      published: true,
      publishedAt: new Date('2026-05-05'),
      authorId: admin.id,
    },
    {
      title: 'Sağlık Emekçilerine Yönelik Şiddete Karşı Açıklama',
      slug: 'saglik-emekci-siddete-aciklama',
      excerpt: 'BTO, sağlık çalışanlarına yönelik şiddet olayları karşısında sert bir basın açıklaması yayımladı.',
      content: '<p>Bursa Tabip Odası, Türkiye genelinde sağlık emekçilerine yönelik artan şiddet olaylarını şiddetle kınayarak acil önlem alınması çağrısında bulundu.</p>',
      category: 'BASIN_ACIKLAMASI',
      featured: false,
      published: true,
      publishedAt: new Date('2026-05-01'),
      authorId: admin.id,
    },
    {
      title: 'Hekimce Bakış 109. Sayısı Yayımlandı',
      slug: 'hekimce-bakis-109-sayi',
      excerpt: 'BTO\'nun bilimsel dergisi Hekimce Bakış\'ın 109. sayısı okuyucularla buluştu.',
      content: '<p>Bursa Tabip Odası\'nın yayın organı Hekimce Bakış dergisinin 109. sayısı Mayıs 2026 itibarıyla tüm üyelerimize ulaştırılmış ve dijital platformda da yayımlanmıştır.</p>',
      category: 'DUYURU',
      featured: false,
      published: true,
      publishedAt: new Date('2026-04-28'),
      authorId: admin.id,
    },
  ]

  for (const h of haberler) {
    await prisma.haber.upsert({
      where: { slug: h.slug },
      update: {},
      create: h,
    })
  }
  console.log('✓ Haberler oluşturuldu')

  // Etkinlikler
  const etkinlikler = [
    {
      title: 'Sürekli Tıp Eğitimi Semineri 2026',
      slug: 'surekli-tip-egitimi-semineri-2026',
      description: 'Hekimlere yönelik güncel tıp eğitimi seminerleri ile mesleki gelişiminizi destekleyin.',
      location: 'Bursa',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-16'),
      published: true,
    },
    {
      title: 'Halk Sağlığı Çalıştayı',
      slug: 'halk-sagligi-calistay-2026',
      description: 'Toplum sağlığı sorunlarına çözüm önerileri geliştirileceği çalıştay.',
      location: 'Bursa',
      startDate: new Date('2026-07-10'),
      endDate: new Date('2026-07-11'),
      published: true,
    },
    {
      title: 'Aile Hekimliği Kongresi 2026',
      slug: 'aile-hekimligi-kongresi-2026',
      description: 'Aile hekimliğinde güncel yaklaşımlar ve vaka tartışmaları.',
      location: 'Bursa',
      startDate: new Date('2026-09-05'),
      endDate: new Date('2026-09-07'),
      published: true,
    },
    {
      title: 'BTO Genel Kurulu',
      slug: 'bto-genel-kurulu-2026',
      description: 'Bursa Tabip Odası yıllık genel kurul toplantısı.',
      location: 'Bursa',
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-10-22'),
      published: true,
    },
  ]

  for (const e of etkinlikler) {
    await prisma.etkinlik.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    })
  }
  console.log('✓ Etkinlikler oluşturuldu')

  // Duyurular
  const duyurular = [
    { title: 'BTO Genel Kurulu 20 Ekim 2026\'da gerçekleşecektir — katılım için kayıt yaptırınız', priority: 5, active: true },
    { title: '2026 Yılı Üyelik Aidatları hakkında bilgi için web sitemizi ziyaret ediniz', priority: 4, active: true },
    { title: 'Hekimce Bakış Dergisi 109. Sayısı yayınlandı', url: '/yayinlar', priority: 3, active: true },
    { title: 'Sürekli Tıp Eğitimi Semineri — 15 Haziran 2026, Bursa', url: '/etkinlikler', priority: 2, active: true },
    { title: 'Asgari Ücret Katsayıları güncellendi — detaylar için tıklayınız', url: '/mevzuat', priority: 1, active: true },
  ]

  for (const d of duyurular) {
    await prisma.duyuru.create({ data: d }).catch(() => {})
  }
  console.log('✓ Duyurular oluşturuldu')

  // Quiz
  await prisma.quiz.create({
    data: {
      question: '65 yaşında erkek hasta, efor dispnesi ve göğüs ağrısı ile başvuruyor. EKG\'de ST elevasyonu mevcut. Tanınız nedir?',
      options: JSON.stringify(['Stabil angina pektoris', 'Akut miyokard infarktüsü (STEMI)', 'Pulmoner emboli', 'Perikardit']),
      correctOption: 1,
      explanation: 'ST elevasyonu ile birlikte klinik bulgular STEMI tanısını desteklemektedir. Acil perkütan koroner girişim (PKG) endikasyonu vardır.',
      weekDate: new Date('2026-05-11'),
      active: true,
    },
  }).catch(() => {})
  console.log('✓ Quiz oluşturuldu')

  // Hekimce Bakış Makaleleri (Yayin)
  const yayinlar = [
    { title: 'Birinci Basamakta Kronik Hastalık Yönetimi', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-05-01') },
    { title: 'Sağlık Çalışanlarında Tükenmişlik Sendromu', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-28') },
    { title: 'Bursa\'da Aşılama Oranları ve Toplum Sağlığı', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-25') },
    { title: 'Yapay Zeka ve Tanısal Tıp', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-22') },
    { title: 'Hekimlerin Hukuki Hakları ve Güncel Mevzuat', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-20') },
    { title: 'Çevre Sağlığı ve Kentsel Dönüşüm', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-18') },
    { title: 'Kadın Hekimlerin Mesleki Zorlukları', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-15') },
    { title: 'Acil Servislerde Şiddete Karşı Önlemler', type: 'DERGI', issueNumber: 109, publishedAt: new Date('2026-04-12') },
  ]

  for (const y of yayinlar) {
    await prisma.yayin.create({ data: y }).catch(() => {})
  }
  console.log('✓ Yayınlar oluşturuldu')

  // Mevzuat
  const mevzuatlar = [
    { title: 'Özel Hekimlik Asgari Ücret Katsayıları (2026)', category: 'Asgari Ücret', publishedAt: new Date('2026-01-01') },
    { title: 'İşyeri Hekimliği Ücret Katsayıları (2026)', category: 'Asgari Ücret', publishedAt: new Date('2026-01-01') },
    { title: 'Türk Tabipleri Birliği Kanunu (6023)', category: 'Kanunlar', publishedAt: new Date('2023-01-01') },
    { title: 'Hekimlik Meslek Etiği Kuralları', category: 'Yönetmelikler', publishedAt: new Date('2024-03-15') },
  ]

  for (const m of mevzuatlar) {
    await prisma.mevzuat.create({ data: m }).catch(() => {})
  }
  console.log('✓ Mevzuat oluşturuldu')

  // Site Ayarları
  const ayarlar = [
    { key: 'site_title', value: 'Bursa Tabip Odası' },
    { key: 'site_description', value: 'Hekimlerin sesi, toplumun güvencesi' },
    { key: 'contact_address', value: 'Akademik Odalar Yerleşkesi Odunluk Mh. Akademi Cad. No:8 A2 Blok K:2 Nilüfer/BURSA' },
    { key: 'contact_phone', value: '+90 (224) 453 52 10' },
    { key: 'contact_fax', value: '+90 (224) 453 52 40' },
    { key: 'contact_email', value: 'bto@bto.org.tr' },
    { key: 'social_instagram', value: 'https://instagram.com/bursatabipodasi' },
    { key: 'social_facebook', value: 'https://facebook.com/bursatabipodasi' },
    { key: 'social_twitter', value: 'https://twitter.com/bursatabipodasi' },
    { key: 'social_youtube', value: 'https://youtube.com/bursatabipodasi' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/bursatabipodasi' },
  ]

  for (const a of ayarlar) {
    await prisma.siteAyar.upsert({ where: { key: a.key }, update: { value: a.value }, create: a })
  }
  console.log('✓ Site ayarları oluşturuldu')

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

  // STE Kurul Üyeleri (ilk 3 kategori için)
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

  console.log('\n✅ Seed tamamlandı!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
