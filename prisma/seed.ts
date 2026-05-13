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
    { key: 'ste_banner_text', value: 'Bursa Tabip Odası STE Komisyonu Bilim Kurulları tarafından yönetilen Bursa Tabip Odası Mesleki Eğitim Portalıdır' },
    { key: 'ste_banner_active', value: 'true' },
  ]

  for (const a of ayarlar) {
    await prisma.siteAyar.upsert({ where: { key: a.key }, update: { value: a.value }, create: a })
  }
  console.log('✓ Site ayarları oluşturuldu')

  // STE Kategorileri
  const steKategoriler = [
    { name: 'Çocuk Sağlığı ve Hastalıkları', slug: 'cocuk-sagligi', description: 'Pediatri alanında sürekli tıp eğitimi programları ve güncel gelişmeler. Yan dalları ile birlikte.', iconEmoji: '👶', order: 1 },
    { name: 'İç Hastalıkları (Dahiliye)', slug: 'ic-hastaliklari', description: 'İç hastalıkları ana dal ve yan dalları ile birlikte. Dahili bilim dalları dahil.', iconEmoji: '🩺', order: 2 },
    { name: 'Genel Cerrahi', slug: 'genel-cerrahi', description: 'Cerrahi yenilikler, minimal invaziv teknikler ve hasta güvenliği.', iconEmoji: '🔬', order: 3 },
    { name: 'Kadın Hastalıkları ve Doğum', slug: 'kadin-hastaliklari', description: 'Jinekoloji ve obstetrik alanında güncel bilgi ve eğitim materyalleri.', iconEmoji: '🤱', order: 4 },
    { name: 'Kardiyoloji', slug: 'kardiyoloji', description: 'Kalp ve damar hastalıkları alanında güncel tedavi protokolleri.', iconEmoji: '❤️', order: 5 },
    { name: 'Nöroloji', slug: 'noroloji', description: 'Nörolojik hastalıkların tanı ve tedavisinde güncel yaklaşımlar.', iconEmoji: '🧠', order: 6 },
    { name: 'Ortopedi ve Travmatoloji', slug: 'ortopedi', description: 'Kas-iskelet sistemi hastalıkları ve travma cerrahisinde güncel bilgiler.', iconEmoji: '🦴', order: 7 },
    { name: 'Göz Hastalıkları', slug: 'goz-hastaliklari', description: 'Oftalmoloji alanında güncel cerrahi ve medikal tedavi yaklaşımları.', iconEmoji: '👁️', order: 8 },
    { name: 'Kulak Burun Boğaz (KBB)', slug: 'kulak-burun-bogaz', description: 'KBB alanında güncel tanı ve tedavi yöntemleri.', iconEmoji: '👂', order: 9 },
    { name: 'Acil Tıp', slug: 'acil-tip', description: 'Acil tıp uygulamalarında kanıta dayalı protokoller ve algoritmalar.', iconEmoji: '🚑', order: 10 },
    { name: 'Psikiyatri', slug: 'psikiyatri', description: 'Ruh sağlığı alanında güncel tedavi yaklaşımları ve psikoterapiler.', iconEmoji: '🧘', order: 11 },
    { name: 'Radyoloji', slug: 'radyoloji', description: 'Görüntüleme yöntemlerinde güncel gelişmeler ve yapay zeka uygulamaları.', iconEmoji: '📡', order: 12 },
    { name: 'Adli Tıp', slug: 'adli-tip', description: 'Adli tıp uygulamaları, otopsi, raporlama ve hukuki süreçler.', iconEmoji: '⚖️', order: 13 },
    { name: 'Aile Hekimliği', slug: 'aile-hekimligi-ste', description: 'Birinci basamak sağlık hizmetleri ve aile hekimliği eğitimi.', iconEmoji: '🏠', order: 14 },
    { name: 'Anesteziyoloji ve Reanimasyon', slug: 'anesteziyoloji', description: 'Anestezi, yoğun bakım ve reanimasyon uygulamalarında güncel yaklaşımlar.', iconEmoji: '💉', order: 15 },
    { name: 'Çocuk Cerrahisi', slug: 'cocuk-cerrahisi', description: 'Çocuklarda cerrahi hastalıklar, prenatal cerrahi ve minimal invaziv teknikler.', iconEmoji: '🔧', order: 16 },
    { name: 'Dermatoloji', slug: 'dermatoloji', description: 'Deri hastalıkları, dermatoskopi ve estetik dermatoloji uygulamaları.', iconEmoji: '🧴', order: 17 },
    { name: 'Enfeksiyon Hastalıkları', slug: 'enfeksiyon-hastaliklari', description: 'Enfeksiyon hastalıkları tanı, tedavi ve antibiyotik yönetimi.', iconEmoji: '🦠', order: 18 },
    { name: 'Farmakoloji', slug: 'farmakoloji', description: 'İlaç etki mekanizmaları, farmakokinetik ve klinik farmakoloji.', iconEmoji: '💊', order: 19 },
    { name: 'Fizik Tedavi ve Rehabilitasyon', slug: 'fizik-tedavi', description: 'Fiziksel tıp, rehabilitasyon ve ağrı yönetimi yaklaşımları.', iconEmoji: '🏃', order: 20 },
    { name: 'Genetik', slug: 'genetik', description: 'Tıbbi genetik, genetik danışmanlık ve genomik tıp uygulamaları.', iconEmoji: '🧬', order: 21 },
    { name: 'Göğüs Hastalıkları', slug: 'gogus-hastaliklari', description: 'Solunum sistemi hastalıkları, astım, KOAH ve pulmoner rehabilitasyon.', iconEmoji: '🫁', order: 22 },
    { name: 'Göğüs Cerrahisi', slug: 'gogus-cerrahisi', description: 'Toraks cerrahisi, akciğer kanseri cerrahisi ve minimal invaziv teknikler.', iconEmoji: '🫀', order: 23 },
    { name: 'Halk Sağlığı', slug: 'halk-sagligi-ste', description: 'Epidemiyoloji, toplum sağlığı ve koruyucu hekimlik programları.', iconEmoji: '🌍', order: 24 },
    { name: 'İmmünoloji', slug: 'immunoloji', description: 'Bağışıklık sistemi hastalıkları, otoimmünite ve immünoterapi.', iconEmoji: '🛡️', order: 25 },
    { name: 'Kalp ve Damar Cerrahisi', slug: 'kalp-damar-cerrahisi', description: 'Kardiyovasküler cerrahi, bypass, kapak cerrahisi ve endovasküler girişimler.', iconEmoji: '❤️‍🩹', order: 26 },
    { name: 'Klinik Biyokimya', slug: 'klinik-biyokimya', description: 'Laboratuvar tıbbı, biyokimyasal testler ve kalite güvencesi.', iconEmoji: '🧪', order: 27 },
    { name: 'Klinik Mikrobiyoloji', slug: 'klinik-mikrobiyoloji', description: 'Mikrobiyolojik tanı yöntemleri, antimikrobiyal direnç ve enfeksiyon kontrolü.', iconEmoji: '🔬', order: 28 },
    { name: 'Nöroşirürji', slug: 'norosirurji', description: 'Beyin ve sinir cerrahisi, spinal cerrahi ve nörovasküler girişimler.', iconEmoji: '🧠', order: 29 },
    { name: 'Nükleer Tıp', slug: 'nukleer-tip', description: 'Nükleer tıp görüntüleme, radyofarmasötikler ve teranostik uygulamalar.', iconEmoji: '☢️', order: 30 },
    { name: 'Patoloji', slug: 'patoloji', description: 'Histopatoloji, sitopatoloji ve moleküler patoloji uygulamaları.', iconEmoji: '🔬', order: 31 },
    { name: 'Plastik, Rekonstrüktif ve Estetik Cerrahi', slug: 'plastik-cerrahi', description: 'Rekonstrüktif cerrahi, estetik uygulamalar ve yara iyileşmesi.', iconEmoji: '✨', order: 32 },
    { name: 'Radyasyon Onkolojisi', slug: 'radyasyon-onkolojisi', description: 'Radyoterapi teknikleri, tedavi planlama ve kanser tedavisinde güncel yaklaşımlar.', iconEmoji: '☢️', order: 33 },
    { name: 'Üroloji', slug: 'uroloji', description: 'Üriner sistem hastalıkları, endoüroloji ve robotik cerrahi.', iconEmoji: '🏥', order: 34 },
    { name: 'Anatomi', slug: 'anatomi', description: 'İnsan anatomisi, klinik anatomi ve kadavra eğitimi.', iconEmoji: '🦷', order: 35 },
    { name: 'Biyofizik', slug: 'biyofizik', description: 'Tıbbi biyofizik, radyasyon fiziği ve biyomedikal uygulamalar.', iconEmoji: '⚛️', order: 36 },
    { name: 'Biyoistatistik ve Tıbbi Bilişim', slug: 'biyoistatistik', description: 'Biyoistatistik yöntemler, araştırma tasarımı ve tıbbi bilişim uygulamaları.', iconEmoji: '📊', order: 37 },
    { name: 'Histoloji ve Embriyoloji', slug: 'histoloji-embriyoloji', description: 'Doku bilimi, gelişim biyolojisi ve hücre kültürü teknikleri.', iconEmoji: '🔬', order: 38 },
    { name: 'Tıp Tarihi ve Deontoloji', slug: 'tip-tarihi-deontoloji', description: 'Tıp tarihi, tıp etiği ve deontolojik ilkeler.', iconEmoji: '📜', order: 39 },
    { name: 'Fizyoloji', slug: 'fizyoloji', description: 'İnsan fizyolojisi ve organ sistemlerinin işleyişi.', iconEmoji: '🫀', order: 40 },
    { name: 'Tıbbi Mikrobiyoloji', slug: 'tibbi-mikrobiyoloji', description: 'Bakteriyoloji, viroloji, mikoloji ve parazitoloji.', iconEmoji: '🦠', order: 41 },
    { name: 'Tıbbi Farmakoloji', slug: 'tibbi-farmakoloji', description: 'İlaç tedavisi prensipleri, farmakodinamik ve klinik farmakoloji.', iconEmoji: '💊', order: 42 },
    { name: 'Tıbbi Biyokimya', slug: 'tibbi-biyokimya', description: 'Biyokimyasal süreçler, metabolizma ve laboratuvar tıbbı temelleri.', iconEmoji: '🧪', order: 43 },
    { name: 'Tıbbi Patoloji', slug: 'tibbi-patoloji', description: 'Genel patoloji, hastalık mekanizmaları ve tanısal patoloji.', iconEmoji: '🔬', order: 44 },
    { name: 'Halk Sağlığı (Temel Bilim)', slug: 'halk-sagligi-temel', description: 'Epidemiyoloji, biyoistatistik, sağlık yönetimi ve koruyucu hekimlik temelleri.', iconEmoji: '🌐', order: 45 },
    { name: 'Göğüs Hastalıkları ve Tüberküloz', slug: 'gogus-hastaliklari-tuberkuloz', description: 'Tüberküloz tanı ve tedavisi, göğüs hastalıkları acilleri.', iconEmoji: '🫁', order: 46 },
    { name: 'Onkoloji (Tıbbi Onkoloji)', slug: 'tibbi-onkoloji', description: 'Kanser biyolojisi, kemoterapi protokolleri ve immünoterapi.', iconEmoji: '🎗️', order: 47 },
    { name: 'Endokrinoloji ve Metabolizma', slug: 'endokrinoloji', description: 'Hormonal hastalıklar, diyabet yönetimi ve metabolik sendrom.', iconEmoji: '⚡', order: 48 },
    { name: 'Gastroenteroloji', slug: 'gastroenteroloji', description: 'Sindirim sistemi hastalıkları, endoskopi ve hepatoloji.', iconEmoji: '🫘', order: 49 },
    { name: 'Nefroloji', slug: 'nefroloji', description: 'Böbrek hastalıkları, diyaliz ve transplantasyon.', iconEmoji: '🫘', order: 50 },
    { name: 'Hematoloji', slug: 'hematoloji', description: 'Kan hastalıkları, kemik iliği transplantasyonu ve koagülasyon.', iconEmoji: '🩸', order: 51 },
    { name: 'Romatoloji', slug: 'romatoloji', description: 'Romatizmal hastalıklar, otoimmün bozukluklar ve biyolojik tedaviler.', iconEmoji: '🦴', order: 52 },
    { name: 'Geriatri', slug: 'geriatri', description: 'Yaşlı sağlığı, çoklu ilaç kullanımı ve yaşlı bakımı.', iconEmoji: '🧓', order: 53 },
    { name: 'Yoğun Bakım', slug: 'yogun-bakim', description: 'Yoğun bakım protokolleri, mekanik ventilasyon ve organ yetmezliği.', iconEmoji: '🏥', order: 54 },
    { name: 'Spor Hekimliği', slug: 'spor-hekimligi', description: 'Sporcu sağlığı, egzersiz fizyolojisi ve spor yaralanmaları.', iconEmoji: '🏅', order: 55 },
    { name: 'Algoloji (Ağrı Tıbbı)', slug: 'algoloji', description: 'Kronik ağrı yönetimi, girişimsel ağrı tedavisi ve palyatif bakım.', iconEmoji: '💆', order: 56 },
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
    { kategoriSlug: 'acil-tip', members: [
      { name: 'Prof. Dr. Sercan Yılmaz', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Elif Kaya', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'adli-tip', members: [
      { name: 'Prof. Dr. Murat Çetin', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Seda Arslan', title: 'Doç. Dr.', institution: 'Bursa Adli Tıp Kurumu', order: 2 },
    ]},
    { kategoriSlug: 'aile-hekimligi-ste', members: [
      { name: 'Uzm. Dr. Hülya Şahin', title: 'Uzm. Dr.', institution: 'Bursa 1 No\'lu ASM', order: 1 },
      { name: 'Uzm. Dr. Kemal Polat', title: 'Uzm. Dr.', institution: 'Nilüfer Aile Sağlığı Merkezi', order: 2 },
    ]},
    { kategoriSlug: 'anesteziyoloji', members: [
      { name: 'Prof. Dr. Gülden Akdağ', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Tarık Uslu', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'cocuk-sagligi', members: [
      { name: 'Prof. Dr. Ayşe Kara', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Mehmet Yıldız', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
      { name: 'Uzm. Dr. Fatma Demir', title: 'Uzm. Dr.', institution: 'Bursa Çekirge Devlet Hastanesi', order: 3 },
    ]},
    { kategoriSlug: 'cocuk-cerrahisi', members: [
      { name: 'Prof. Dr. Bülent Narin', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Zehra Güneş', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'dermatoloji', members: [
      { name: 'Prof. Dr. Nilgün Atakan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Özlem Yücel', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'enfeksiyon-hastaliklari', members: [
      { name: 'Prof. Dr. Emel Yılmaz', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Caner Aktaş', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'farmakoloji', members: [
      { name: 'Prof. Dr. İbrahim Özdemir', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Arzu Yıldırım', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'fizik-tedavi', members: [
      { name: 'Prof. Dr. Nesrin Demirsoy', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Selim Öner', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'genel-cerrahi', members: [
      { name: 'Prof. Dr. Hasan Çelik', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Emre Toprak', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
      { name: 'Uzm. Dr. Selin Korkmaz', title: 'Uzm. Dr.', institution: 'Medicana Hastanesi', order: 3 },
    ]},
    { kategoriSlug: 'genetik', members: [
      { name: 'Prof. Dr. Hüseyin Onay', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Filiz Yılmaz', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'gogus-hastaliklari', members: [
      { name: 'Prof. Dr. Oya İtil', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Tuncay Göksel', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'gogus-cerrahisi', members: [
      { name: 'Prof. Dr. Kutsal Turhan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Adem Güngör', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'goz-hastaliklari', members: [
      { name: 'Prof. Dr. Bülent Yılmaz', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Aysun Apaydın', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'halk-sagligi-ste', members: [
      { name: 'Prof. Dr. Reyhan Uçku', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Levent Akın', title: 'Doç. Dr.', institution: 'Bursa İl Sağlık Müdürlüğü', order: 2 },
    ]},
    { kategoriSlug: 'ic-hastaliklari', members: [
      { name: 'Prof. Dr. Ali Özkan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Prof. Dr. Zeynep Acar', title: 'Prof. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'immunoloji', members: [
      { name: 'Prof. Dr. Cengiz Kırkpınar', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Sibel Nacar', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'kadin-hastaliklari', members: [
      { name: 'Prof. Dr. Meral Saraçoğlu', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Ahmet Kaya', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'kalp-damar-cerrahisi', members: [
      { name: 'Prof. Dr. Osman Tansel', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Volkan Yüksel', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'kardiyoloji', members: [
      { name: 'Prof. Dr. Uğur Önsel Türk', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Tuncay Güçlü', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'klinik-biyokimya', members: [
      { name: 'Prof. Dr. Osman Değer', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Sema Ünlüer', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'klinik-mikrobiyoloji', members: [
      { name: 'Prof. Dr. Beyza Ener', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Nihal Akçay', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'kulak-burun-bogaz', members: [
      { name: 'Prof. Dr. Orhan Özturan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Bülent Şerbetçioğlu', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'noroloji', members: [
      { name: 'Prof. Dr. Şule Özbilen Acar', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Yaşar Kütükçü', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'norosirurji', members: [
      { name: 'Prof. Dr. Gökmen Kahiloğulları', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Murat Akar', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'nukleer-tip', members: [
      { name: 'Prof. Dr. Mehmet Erdoğan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Ayşen Berk', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'ortopedi', members: [
      { name: 'Prof. Dr. Reha Tandoğan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Muzaffer Sindel', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'patoloji', members: [
      { name: 'Prof. Dr. Nesrin Uğraş', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Sema Hücümenoğlu', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'plastik-cerrahi', members: [
      { name: 'Prof. Dr. Ufuk Emekli', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Erhan Ece', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'psikiyatri', members: [
      { name: 'Prof. Dr. Hüseyin Güleç', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Ayşegül Özel', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'radyasyon-onkolojisi', members: [
      { name: 'Prof. Dr. Sedat Koca', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Murat Dinçer', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'radyoloji', members: [
      { name: 'Prof. Dr. Ahmet Mesut Onat', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Işıl Başara', title: 'Doç. Dr.', institution: 'Bursa Yüksek İhtisas Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'uroloji', members: [
      { name: 'Prof. Dr. Ertuğrul Şefik', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Cem Akbal', title: 'Doç. Dr.', institution: 'Bursa Şehir Hastanesi', order: 2 },
    ]},
    { kategoriSlug: 'anatomi', members: [
      { name: 'Prof. Dr. Ömer Faruk Gökalp', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Selda Demirci', title: 'Doç. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 2 },
    ]},
    { kategoriSlug: 'biyofizik', members: [
      { name: 'Prof. Dr. Yusuf Yıldız', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Tülin Ural', title: 'Doç. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 2 },
    ]},
    { kategoriSlug: 'biyoistatistik', members: [
      { name: 'Prof. Dr. Necdet Süt', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Güzin Zeren Öztürk', title: 'Doç. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 2 },
    ]},
    { kategoriSlug: 'histoloji-embriyoloji', members: [
      { name: 'Prof. Dr. Gülnur Ercan', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Doç. Dr. Sibel Güldiken', title: 'Doç. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 2 },
    ]},
    { kategoriSlug: 'tip-tarihi-deontoloji', members: [
      { name: 'Prof. Dr. Şükrü Öztürk', title: 'Prof. Dr.', institution: 'Uludağ Üniversitesi Tıp Fakültesi', order: 1 },
      { name: 'Dr. Ahmet Yılmaz', title: 'Dr.', institution: 'BTO Etik Kurulu', order: 2 },
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
    { kategoriSlug: 'acil-tip', items: [
      { title: 'Acil Tıp Protokolleri El Kitabı 2026', type: 'KITAP', author: 'BTO Acil Tıp Kurulu', description: 'Acil serviste sık karşılaşılan durumların güncel yönetim algoritmaları.' },
      { title: 'Politravma Hastasına Yaklaşım', type: 'YAYIN', author: 'Prof. Dr. Sercan Yılmaz', description: 'Çoklu travma vakalarında ilk değerlendirme ve stabilizasyon.' },
      { title: 'Kardiyak Arrest Yönetimi — ALS Rehberi', type: 'YAYIN', author: 'BTO STE Komisyonu', description: 'İleri kardiyak yaşam desteği güncel protokolleri.' },
    ]},
    { kategoriSlug: 'adli-tip', items: [
      { title: 'Adli Tıp Uygulamaları Rehberi', type: 'KITAP', author: 'Prof. Dr. Murat Çetin', description: 'Adli olgularda tanı, raporlama ve yasal süreçler.' },
      { title: 'Cinsel Saldırı Olgularında Adli Yaklaşım', type: 'YAYIN', author: 'Doç. Dr. Seda Arslan', description: 'Kanıt toplama, muayene ve belgeleme protokolleri.' },
    ]},
    { kategoriSlug: 'aile-hekimligi-ste', items: [
      { title: 'Birinci Basamakta Kronik Hastalık Yönetimi', type: 'KITAP', author: 'BTO Aile Hekimliği Kurulu', description: 'HT, DM, KOAH ve kalp yetmezliği birinci basamak rehberi.' },
      { title: 'Koruyucu Hekimlik ve Aşılama Takvimi 2026', type: 'YAYIN', author: 'Uzm. Dr. Hülya Şahin', description: 'Erişkin ve çocuk aşı takvimi güncellemeleri.' },
    ]},
    { kategoriSlug: 'anesteziyoloji', items: [
      { title: 'Perioperatif Hasta Yönetimi Kılavuzu', type: 'KITAP', author: 'Prof. Dr. Gülden Akdağ', description: 'Preoperatif değerlendirmeden taburculuğa kadar güncel protokoller.' },
      { title: 'Zor Havayolu Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Tarık Uslu', description: 'Algoritma tabanlı zor entübasyon ve havayolu güvencesi.' },
      { title: 'Regional Anestezi Teknikleri Atlası', type: 'KITAP', author: 'BTO Anestezi Kurulu', description: 'USG eşliğinde sinir bloklarında pratik rehber.' },
    ]},
    { kategoriSlug: 'cocuk-sagligi', items: [
      { title: 'Pediatrik Acil Durumlar El Kitabı', type: 'KITAP', author: 'Prof. Dr. Ayşe Kara', description: 'Çocuklarda sık karşılaşılan acil durumların yönetimi.' },
      { title: 'Çocukluk Çağı Aşıları Güncel Rehber 2026', type: 'YAYIN', author: 'BTO STE Komisyonu', description: 'Türkiye ulusal aşı takvimi ve güncel öneriler.' },
      { title: 'Neonatal Resüsitasyon Protokolü', type: 'YAYIN', author: 'Doç. Dr. Mehmet Yıldız', description: 'Yenidoğan resüsitasyonunda güncel algoritmalar.' },
    ]},
    { kategoriSlug: 'cocuk-cerrahisi', items: [
      { title: 'Pediatrik Cerrahi Aciller Kılavuzu', type: 'KITAP', author: 'Prof. Dr. Bülent Narin', description: 'Çocuklarda apandisit, intussusepsiyon ve cerrahi acillerin yönetimi.' },
      { title: 'Minimal İnvaziv Pediatrik Cerrahi', type: 'YAYIN', author: 'Doç. Dr. Zehra Güneş', description: 'Laparoskopik ve torakoskopik çocuk cerrahisi güncel yaklaşımlar.' },
    ]},
    { kategoriSlug: 'dermatoloji', items: [
      { title: 'Dermatoloji Atlas: Sık Görülen Hastalıklar', type: 'KITAP', author: 'Prof. Dr. Nilgün Atakan', description: 'Klinik fotoğraflarla dermatit, psöriyazis ve melanom ayırıcı tanısı.' },
      { title: 'Dermoskopi Temel Eğitim Materyali', type: 'YAYIN', author: 'Doç. Dr. Özlem Yücel', description: 'Pigmente lezyonların dermoskopik değerlendirilmesi.' },
      { title: 'Biyolojik Tedaviler — Dermatoloji', type: 'YAYIN', author: 'BTO Dermatoloji Kurulu', description: 'Psöriyazis ve atopik dermatitin biyolojik ajanlarla yönetimi.' },
    ]},
    { kategoriSlug: 'enfeksiyon-hastaliklari', items: [
      { title: 'Antibiyotik Kullanım Rehberi 2026', type: 'KITAP', author: 'Prof. Dr. Emel Yılmaz', description: 'Sık enfeksiyonlarda ampirik ve hedefe yönelik antibiyotik seçimi.' },
      { title: 'Sepsis ve Septik Şok Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Caner Aktaş', description: 'Surviving Sepsis Campaign güncel öneriler ve Türkiye verileri.' },
    ]},
    { kategoriSlug: 'farmakoloji', items: [
      { title: 'Klinik Farmakoloji El Kitabı', type: 'KITAP', author: 'Prof. Dr. İbrahim Özdemir', description: 'İlaç etkileşimleri, doz ayarlamaları ve farmakovigilans.' },
      { title: 'Yaşlıda Polifarmasi Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Arzu Yıldırım', description: 'Geriatrik hastalarda ilaç güvenliği ve deprescrıbing rehberi.' },
    ]},
    { kategoriSlug: 'fizik-tedavi', items: [
      { title: 'Kas-İskelet Rehabilitasyonu Kılavuzu', type: 'KITAP', author: 'Prof. Dr. Nesrin Demirsoy', description: 'Omuz, diz ve bel problemlerinde kanıta dayalı tedavi protokolleri.' },
      { title: 'Kronik Ağrı Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Selim Öner', description: 'Multidisipliner yaklaşım ve girişimsel ağrı tedavisi.' },
    ]},
    { kategoriSlug: 'genel-cerrahi', items: [
      { title: 'Laparoskopik Cerrahi Atlas', type: 'KITAP', author: 'Prof. Dr. Hasan Çelik', description: 'Minimal invaziv cerrahi tekniklerin görsel rehberi.' },
      { title: 'Cerrahi Yara Bakımı Protokolleri', type: 'YAYIN', author: 'Doç. Dr. Emre Toprak', description: 'Postoperatif yara bakımında güncel yaklaşımlar.' },
      { title: 'Kolorektal Kanser Tarama Rehberi', type: 'YAYIN', author: 'BTO Cerrahi Kurulu', description: 'Kolorektal kanserin erken tanısı ve cerrahi tedavisi.' },
    ]},
    { kategoriSlug: 'genetik', items: [
      { title: 'Tıbbi Genetik Danışmanlık Rehberi', type: 'KITAP', author: 'Prof. Dr. Hüseyin Onay', description: 'Genetik hastalıklarda tanı, risk hesaplama ve aile danışmanlığı.' },
      { title: 'NGS ve Genomik Tıp Uygulamaları', type: 'YAYIN', author: 'Doç. Dr. Filiz Yılmaz', description: 'Yeni nesil dizileme teknolojileri ve klinik yorumlama.' },
    ]},
    { kategoriSlug: 'gogus-hastaliklari', items: [
      { title: 'KOAH Yönetimi GOLD 2026 Güncellemesi', type: 'YAYIN', author: 'Prof. Dr. Oya İtil', description: 'Kronik obstrüktif akciğer hastalığında güncel tanı ve tedavi.' },
      { title: 'Astım Kontrol Rehberi', type: 'KITAP', author: 'BTO Göğüs Hastalıkları Kurulu', description: 'Astım basamak tedavisi ve biyolojik tedavi seçimi.' },
    ]},
    { kategoriSlug: 'gogus-cerrahisi', items: [
      { title: 'Torakoskopik Cerrahi Temel Eğitim', type: 'KITAP', author: 'Prof. Dr. Kutsal Turhan', description: 'VATS teknikleri, akciğer rezeksiyonu ve mediastinoskopi.' },
      { title: 'Akciğer Kanseri Multidisipliner Yaklaşım', type: 'YAYIN', author: 'Doç. Dr. Adem Güngör', description: 'Evreleme, rezektabilite ve adjuvan tedavi kararları.' },
    ]},
    { kategoriSlug: 'goz-hastaliklari', items: [
      { title: 'Retinal Hastalıklar Tanı Atlası', type: 'KITAP', author: 'Prof. Dr. Bülent Yılmaz', description: 'DRİ, AMD, retinal ven tıkanıklıklarının görüntüleme ve tedavisi.' },
      { title: 'Katarakt Cerrahisi Komplikasyon Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Aysun Apaydın', description: 'Fakoemülsifikasyon komplikasyonları ve yönetim protokolleri.' },
    ]},
    { kategoriSlug: 'halk-sagligi-ste', items: [
      { title: 'Epidemiyoloji Araştırma Yöntemleri', type: 'KITAP', author: 'Prof. Dr. Reyhan Uçku', description: 'Kesitsel, kohort ve vaka-kontrol çalışmalarında metodoloji.' },
      { title: 'Aşı Güvenliliği ve Halk Sağlığı', type: 'YAYIN', author: 'Doç. Dr. Levent Akın', description: 'Aşı kararsızlığıyla mücadele ve iletişim stratejileri.' },
    ]},
    { kategoriSlug: 'ic-hastaliklari', items: [
      { title: 'İç Hastalıkları Tanı ve Tedavi Kılavuzu', type: 'KITAP', author: 'Prof. Dr. Ali Özkan', description: 'Dahili hastalıklarda kanıta dayalı tedavi yaklaşımları.' },
      { title: 'Diyabet Yönetimi 2026 Güncelleme', type: 'YAYIN', author: 'Prof. Dr. Zeynep Acar', description: 'Tip 2 diyabet tedavisinde yeni ajanlar ve yaşam tarzı müdahaleleri.' },
    ]},
    { kategoriSlug: 'immunoloji', items: [
      { title: 'Otoimmün Hastalıklarda Güncel Tedaviler', type: 'KITAP', author: 'Prof. Dr. Cengiz Kırkpınar', description: 'Romatoid artrit, SLE ve vaskülit biyolojik tedavi rehberi.' },
      { title: 'Primer İmmün Yetmezlik Tanı Rehberi', type: 'YAYIN', author: 'Doç. Dr. Sibel Nacar', description: 'Erişkin ve çocuklarda immün yetmezlik tanı algoritmaları.' },
    ]},
    { kategoriSlug: 'kadin-hastaliklari', items: [
      { title: 'Perinatoloji El Kitabı', type: 'KITAP', author: 'Prof. Dr. Meral Saraçoğlu', description: 'Yüksek riskli gebelik yönetimi ve fetal izlem protokolleri.' },
      { title: 'Minimal İnvaziv Jinekolojik Cerrahi', type: 'YAYIN', author: 'Doç. Dr. Ahmet Kaya', description: 'Histeroskopi, laparoskopi ve robotik cerrahi uygulamaları.' },
    ]},
    { kategoriSlug: 'kalp-damar-cerrahisi', items: [
      { title: 'Aort Cerrahisi Güncel Yaklaşımlar', type: 'KITAP', author: 'Prof. Dr. Osman Tansel', description: 'Açık ve endovasküler aort cerrahisi teknikleri ve sonuçları.' },
      { title: 'Koroner Bypass Cerrahisi Rehberi', type: 'YAYIN', author: 'Doç. Dr. Volkan Yüksel', description: 'KABG teknik seçimi, greft korunması ve perioperatif bakım.' },
    ]},
    { kategoriSlug: 'kardiyoloji', items: [
      { title: 'Akut Koroner Sendrom Yönetimi', type: 'KITAP', author: 'BTO Kardiyoloji Kurulu', description: 'AKS tanı ve tedavisinde güncel algoritmalar.' },
      { title: 'Kalp Yetmezliği Tedavi Rehberi 2026', type: 'YAYIN', author: 'BTO STE Komisyonu', description: 'Kronik kalp yetmezliğinde kanıta dayalı tedavi yaklaşımları.' },
    ]},
    { kategoriSlug: 'klinik-biyokimya', items: [
      { title: 'Laboratuvar Tanı Rehberi', type: 'KITAP', author: 'Prof. Dr. Osman Değer', description: 'Biyokimyasal parametrelerin klinik yorumlanması ve tuzaklar.' },
      { title: 'Kardiyak Biyobelirteçler Güncel Kullanım', type: 'YAYIN', author: 'Doç. Dr. Sema Ünlüer', description: 'Troponin, BNP ve yeni biyobelirteçlerin klinik uygulaması.' },
    ]},
    { kategoriSlug: 'klinik-mikrobiyoloji', items: [
      { title: 'Antimikrobiyal Direnç Yönetimi', type: 'KITAP', author: 'Prof. Dr. Beyza Ener', description: 'MRSA, VRE, KPC ve diğer dirençli mikroorganizma kontrolü.' },
      { title: 'Moleküler Mikrobiyoloji Tanı Yöntemleri', type: 'YAYIN', author: 'Doç. Dr. Nihal Akçay', description: 'PCR, NGS ve hızlı tanı testlerinin klinik laboraturvarda kullanımı.' },
    ]},
    { kategoriSlug: 'kulak-burun-bogaz', items: [
      { title: 'KBB Cerrahisi Temel Eğitim Atlası', type: 'KITAP', author: 'Prof. Dr. Orhan Özturan', description: 'Septoplasti, tonsillektomi ve endoskopik sinüs cerrahisi teknikleri.' },
      { title: 'İşitme Kayıpları ve Rehabilitasyon', type: 'YAYIN', author: 'Doç. Dr. Bülent Şerbetçioğlu', description: 'Sensörinöral işitme kaybında tanı ve implant seçimi.' },
    ]},
    { kategoriSlug: 'noroloji', items: [
      { title: 'İnme Yönetimi Güncel Rehber 2026', type: 'KITAP', author: 'Prof. Dr. Şule Özbilen Acar', description: 'İskemik ve hemorajik inme akut tedavi ve ikincil korunma.' },
      { title: 'Multipl Skleroz Tedavi Algoritması', type: 'YAYIN', author: 'Doç. Dr. Yaşar Kütükçü', description: 'MS hastalık modifiye edici tedaviler güncel kılavuz.' },
    ]},
    { kategoriSlug: 'norosirurji', items: [
      { title: 'Spinal Cerrahi Endikasyon Rehberi', type: 'KITAP', author: 'Prof. Dr. Gökmen Kahiloğulları', description: 'Disk hernisi, spinal stenoz ve stabilizasyon cerrahisi.' },
      { title: 'Beyin Tümörleri Multidisipliner Yaklaşım', type: 'YAYIN', author: 'Doç. Dr. Murat Akar', description: 'Gliomalar, meninjiomlar ve metastazlarda cerrahi ve ek tedaviler.' },
    ]},
    { kategoriSlug: 'nukleer-tip', items: [
      { title: 'PET/CT Klinik Uygulamalar Rehberi', type: 'KITAP', author: 'Prof. Dr. Mehmet Erdoğan', description: 'Onkoloji, kardiyoloji ve nörolojide PET/CT yorumlama.' },
      { title: 'Radyoiyot Tedavisi Protokolleri', type: 'YAYIN', author: 'Doç. Dr. Ayşen Berk', description: 'Tiroid kanseri ve hipertiroidide I-131 tedavisi.' },
    ]},
    { kategoriSlug: 'ortopedi', items: [
      { title: 'Diz ve Kalça Artroplastisi Rehberi', type: 'KITAP', author: 'Prof. Dr. Reha Tandoğan', description: 'Total protez cerrahisinde endikasyon, teknik ve komplikasyon.' },
      { title: 'Spor Yaralanmaları Tedavi Protokolleri', type: 'YAYIN', author: 'Doç. Dr. Muzaffer Sindel', description: 'ACL, menisküs ve Achilles yaralanmalarında güncel tedavi.' },
    ]},
    { kategoriSlug: 'patoloji', items: [
      { title: 'Kanser Patolojisi Tanı Rehberi', type: 'KITAP', author: 'Prof. Dr. Nesrin Uğraş', description: 'Meme, kolon ve akciğer kanserlerinin histopatolojik tanısı.' },
      { title: 'Dijital Patoloji ve Yapay Zeka', type: 'YAYIN', author: 'Doç. Dr. Sema Hücümenoğlu', description: 'Dijital görüntüleme sistemleri ve AI destekli tanı araçları.' },
    ]},
    { kategoriSlug: 'plastik-cerrahi', items: [
      { title: 'Yanık Tedavisi Protokolleri', type: 'KITAP', author: 'Prof. Dr. Ufuk Emekli', description: 'Yanık resüsitasyonu, debritman ve greftleme teknikleri.' },
      { title: 'Rekonstrüktif Mikrocerrahi Atlası', type: 'YAYIN', author: 'Doç. Dr. Erhan Ece', description: 'Flap seçimi ve serbest doku transferi teknikleri.' },
    ]},
    { kategoriSlug: 'psikiyatri', items: [
      { title: 'Psikiyatrik Aciller Yönetim Rehberi', type: 'KITAP', author: 'Prof. Dr. Hüseyin Güleç', description: 'İntihar girişimi, ajitasyon ve psikotik kriz yönetimi.' },
      { title: 'Biyolojik Psikiyatri Tedaviler 2026', type: 'YAYIN', author: 'Doç. Dr. Ayşegül Özel', description: 'Antipsikotik, antidepresan ve duygudurum düzenleyici güncel kılavuz.' },
    ]},
    { kategoriSlug: 'radyasyon-onkolojisi', items: [
      { title: 'Stereotaktik Radyoterapi Rehberi', type: 'KITAP', author: 'Prof. Dr. Sedat Koca', description: 'SBRT/SRS teknikleri, doz sınırları ve klinik uygulamalar.' },
      { title: 'Radyoterapi Yan Etkileri Yönetimi', type: 'YAYIN', author: 'Doç. Dr. Murat Dinçer', description: 'Akut ve kronik radyasyon toksisitesi önleme ve tedavi.' },
    ]},
    { kategoriSlug: 'radyoloji', items: [
      { title: 'Girişimsel Radyoloji El Kitabı', type: 'KITAP', author: 'Prof. Dr. Ahmet Mesut Onat', description: 'Biyopsi, drenaj, embolizasyon ve ablasyon prosedürleri.' },
      { title: 'MR Görüntüleme Atlası — Nöroanatomi', type: 'YAYIN', author: 'Doç. Dr. Işıl Başara', description: 'Beyin MR anatomisi ve sık patolojik bulgular.' },
    ]},
    { kategoriSlug: 'uroloji', items: [
      { title: 'Ürolojik Onkoloji Rehberi', type: 'KITAP', author: 'Prof. Dr. Ertuğrul Şefik', description: 'Prostat, mesane ve böbrek kanserlerinde güncel tedavi algoritmaları.' },
      { title: 'Robotik Üroloji Cerrahisi', type: 'YAYIN', author: 'Doç. Dr. Cem Akbal', description: 'Robotik radikal prostatektomi ve nefroüroektomi teknikleri.' },
    ]},
    { kategoriSlug: 'anatomi', items: [
      { title: 'Klinik Anatomi Atlası', type: 'KITAP', author: 'Prof. Dr. Ömer Faruk Gökalp', description: 'Cerrahi girişimler için anatomik yapılar ve landmark\'lar.' },
      { title: 'Ultrason Anatomisi Rehberi', type: 'YAYIN', author: 'Doç. Dr. Selda Demirci', description: 'Kas-iskelet ve damar anatomisinin ultrasonografik değerlendirilmesi.' },
    ]},
    { kategoriSlug: 'biyoistatistik', items: [
      { title: 'Klinik Araştırma Tasarımı El Kitabı', type: 'KITAP', author: 'Prof. Dr. Necdet Süt', description: 'Randomize kontrollü çalışma, kohort ve meta-analiz metodolojisi.' },
      { title: 'SPSS ile Biyoistatistik Uygulamaları', type: 'YAYIN', author: 'Doç. Dr. Güzin Zeren Öztürk', description: 'Klinik veri analizi için pratik istatistik rehberi.' },
    ]},
    { kategoriSlug: 'tip-tarihi-deontoloji', items: [
      { title: 'Hekimlik Etiği Vaka Kitabı', type: 'KITAP', author: 'Prof. Dr. Şükrü Öztürk', description: 'Onam, gizlilik, hasta özerkliği ve çıkar çatışması vaka incelemeleri.' },
      { title: 'Tıp Hukuku Temel Kavramlar', type: 'YAYIN', author: 'Dr. Ahmet Yılmaz', description: 'Malpraktis, advers olay bildirimi ve hekimin hukuki sorumluluğu.' },
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
