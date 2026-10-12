// NÖBETÇİ TANITIM SİTESİ — TÜM METİNLER BU DOSYADADIR.
// Yeni sürümde yalnız bu dosya (ve gerekirse ekran görüntüleri) güncellenir; HTML / animasyon koduna dokunmak gerekmez.
//  - surum / tarih: alt bilgideki sürüm işareti.
//  - menu: üst menü (sayfa = <body data-sayfa="…"> değeri; etkin bağlantı buna göre işaretlenir).
//  - yenilikler: "Yenilikler" sayfası ve ana sayfa bölümü (EN YENİ EN ÜSTTE; her kayıt: surum, tarih, 3–5 kısa madde).
//  - sahneler: ana sayfadaki kaydırmalı hikâye (başlık ≤ 8 sözcük, satır ≤ 15 sözcük). Sahnelerin görselleri index.html'dedir;
//    sıraları ve "id"leri değişmemelidir.
//  - nasilSayfa: "Nasıl çalışır" sayfasının adımları. Her adım "kareler" ile gerçek ekran görüntüsünde sırayla yakınlaşır
//    (ekran = assets/ekranlar/<ad>.webp, hedef = konumlar.js'teki ad ya da bolge: [x, y, g, y] 0–1); telefon: true ise
//    Telegram telefonu; tur: "Bu adımı izle" düğmesinin açtığı tur bölümünün sırası (0'dan).
//  - ozellikSayfa / guvenlikSayfa: ilgili sayfaların kartları ve blokları.
//  - tur: "İzle" tanıtım turu. Her adım bir ekran görüntüsünü ve o görüntüdeki bir hedefi gösterir. yazi ≤ 8 sözcük.
window.ICERIK = {
  // Yedek sürüm bilgisi: GitHub'dan son sürüm okunamazsa gösterilir (son yayımlanan sürüm).
  surum: 'v1.9',
  tarih: '9 Ekim 2026',

  marka: { ad: 'Nöbetçi', slogan: 'Siz uyurken, testleriniz nöbette.' },

  menu: [
    { ad: 'Ana sayfa', adres: 'index.html', sayfa: 'ana' },
    { ad: 'Nasıl çalışır', adres: 'nasil-calisir.html', sayfa: 'nasil' },
    { ad: 'Özellikler', adres: 'ozellikler.html', sayfa: 'ozellikler' },
    { ad: 'Güvenlik', adres: 'guvenlik.html', sayfa: 'guvenlik' },
    { ad: 'Yenilikler', adres: 'yenilikler.html', sayfa: 'yenilikler' },
    { ad: 'İndir', adres: 'indir.html', sayfa: 'indir' }
  ],

  kahraman: {
    baslik: 'Siz uyurken, testleriniz nöbette.',
    alt: 'Kod yazmadan web, servis ve veri testleri. Kendi bilgisayarınızda.',
    dugme: 'İzle',
    dugmeNotu: '90 saniyelik tur',
    // Canlı mini arayüz (sağdaki döngü)
    kosuAdi: 'Gece nöbeti · TEST',
    kilitNotu: 'Gece nöbeti sürüyor',
    adimlar: ['Müşteri kaydı', 'Sipariş', 'Sepet onayı', 'Ürün listesi', 'Kullanıcı profili'],
    kalanAdim: 2,
    bildirimler: {
      kaldi: '❌ 1 test kaldı',
      kaldiAyrinti: 'Sepet onayı · TEST',
      tekrar: '↻ Tekrar koş',
      kosuyor: '⏳ Koşuyor…',
      gecti: '✅ Geçti',
      gectiAyrinti: '5 / 5 senaryo'
    }
  },

  tanitim: { etiket: 'Kısa tanıtım', baslik: '90 saniyede Nöbetçi', alt: 'Gerçek ekranlar. Tıklayın, baştan sona izleyin.' },

  sahneler: [
    { id: 'tarama', ust: 'Ekran taraması', baslik: 'Ekran değişti mi? Nöbetçi fark eder.', satir: 'Yeni alan, değişen etiket, kaybolan seçenek — test kırılmadan önce görürsünüz.', rozet: 'Yeni alan' },
    { id: 'kodsuz', ust: 'Girişi öğret', baslik: 'Kod yazmadan.', satir: 'Girişi bir kez gösterin; Nöbetçi adımları öğrenir, senaryoyu kurar.' },
    { id: 'gece', ust: 'Planlı koşular', baslik: 'Gece 03:00.', satir: 'Siz uyurken koşar. Sabah özet hazırdır.', sabah: { baslik: 'Günaydın', satir: '58 / 60 test geçti', dikkat: '1 ekran dikkat istiyor' } },
    { id: 'cep', ust: 'Telegram botu', baslik: 'Cebinizde.', satir: 'Telefondan koşturun, sonucu aynı mesajda izleyin.' },
    { id: 'kasa', ust: 'Gizlilik', baslik: 'Verileriniz sizde.', satir: 'Her şey kendi bilgisayarınızda, şifreli kasada durur.', maddeler: ['Şifreli kasa', 'Bulut yok', 'İzinler kapalı başlar'] }
  ],

  // Telegram sohbeti (sahne 4, Nasıl çalışır ve turun Telegram bölümü)
  telegram: {
    botAdi: 'Nöbetçi',
    botDurum: 'bot',
    komut: '/senaryolar',
    liste: 'Hangi senaryo koşsun?',
    secenekler: ['Kitap siparişi', 'Yeni müşteri — Ankara', 'Standart teslimat'],
    secilen: 'Kitap siparişi',
    kosuyor: '▶ Kitap siparişi · TEST\n⏳ Koşuyor… 2 / 4 adım',
    sonuc: '✅ Kitap siparişi geçti\nTEST · 38 sn · 4 / 4 adım'
  },

  kapanis: { baslik: "Nöbetçi'yi izleyin", alt: 'Doksan saniye. Kurulum yok, kayıt yok.', dugme: 'İzle' },

  // Ana sayfadaki kısa bölümler (her biri kendi sayfasına bağlanır)
  sorunlar: {
    baslik: 'Neyi çözer?',
    alt: 'Testlerin en yorucu üç hâli.',
    liste: [
      { sorun: 'Ekran değişti, testler sessizce kırıldı.', cozum: 'Nöbetçi ekranı tarar, farkı gösterir; tek tıkla modele işlersiniz.' },
      { sorun: 'Test yazmak kod bilgisi istiyor.', cozum: 'Formu doldurun; senaryo, giriş ve kontroller hazır.' },
      { sorun: 'Gece koşusunu sabah kimse görmüyor.', cozum: 'Pano, uyarı kuralları ve Telegram; sorun size gelir.' }
    ]
  },

  nasil: {
    baslik: 'Nasıl çalışır',
    alt: 'Beş adım. İlki bir dakika sürer.',
    adimlar: [
      { ad: 'Ortam ekle', metin: 'Test edeceğiniz adresi yazın: TEST, HAZIRLIK…' },
      { ad: 'Girişi öğret', metin: 'Bir kez giriş yapın; Nöbetçi kaydeder, 2FA dahil.' },
      { ad: 'Ekranı tara', metin: 'Alanları, adımları ve seçenekleri kendisi bulur.' },
      { ad: 'Senaryo yaz', metin: 'Değerleri formdan girin. Kod yok.' },
      { ad: 'Koş ve izle', metin: 'Şimdi, gece ya da telefondan. Sonuç panoda.' }
    ]
  },

  ozellikler: {
    baslik: 'Özellikler',
    alt: 'Bir test ekibinin ihtiyaç duyduğu her şey, tek uygulamada.',
    sayaclar: [
      { deger: 3, son: '', etiket: 'test türü: web · servis · SQL' },
      { deger: 256, son: '-bit', etiket: 'AES şifreli yerel kasa' },
      { deger: 0, son: '', etiket: 'bulut sunucusu' },
      { deger: 1, son: ' kez', etiket: 'girişi öğretmeniz yeter' }
    ],
    kartlar: [
      { ikon: 'ekran', ad: 'Web ekranları', metin: 'Ekran modeli, çok adımlı formlar, bağlı listeler.' },
      { ikon: 'servis', ad: 'SOAP ve REST', metin: 'Servis senaryoları, yanıt kontrolleri, uçtan uca akışlar.' },
      { ikon: 'veri', ad: 'SQL kontrolleri', metin: 'Koşudan sonra veritabanında doğrulama, yalnız okuma.' },
      { ikon: 'tarama', ad: 'Ekran taraması', metin: 'Arayüz değişince bulgular; kabul et ya da reddet.' },
      { ikon: 'saat', ad: 'Planlı koşular', metin: 'Gece, hafta sonu, her sabah. Kaçan koşu uyarısı.' },
      { ikon: 'pano', ad: 'Özet panosu', metin: 'Trend, dikkat kartları ve uyarı kuralları.' },
      { ikon: 'telefon', ad: 'Telegram botu', metin: 'Telefondan koşturun, uyarıyı anında alın.' },
      { ikon: 'zil', ad: 'Bildirim merkezi', metin: 'Uyarı ve koşu sonucu tek zilde.' },
      { ikon: 'rapor', ad: 'PDF raporlar', metin: 'Döneme göre rapor; kişisel veri maskeli.' }
    ]
  },

  guvenlik: {
    baslik: 'Güvenlik',
    alt: 'Veriniz bilgisayarınızdan hiç ayrılmaz.',
    maddeler: [
      { ad: 'Şifreli kasa', metin: 'Parolalar, 2FA anahtarları ve ortam adresleri AES-256 ile şifrelenir.' },
      { ad: 'Bulut yok', metin: 'Sunucu sizin bilgisayarınızdır; hiçbir veri dışarı gönderilmez.' },
      { ad: 'İzinler kapalı başlar', metin: 'Tarayıcı açma, dış gönderim, Telegram komutu: siz açana kadar kapalı.' },
      { ad: 'Canlı ortam onayı', metin: 'Canlı ortamda her koşu ayrıca onay ister.' },
      { ad: 'Kişisel veri maskesi', metin: 'Rapor ve ekranlarda kişisel veriler maskelenir.' }
    ]
  },

  yenilikler: {
    baslik: 'Yenilikler',
    alt: 'Her sürümde neler değişti.',
    // EN YENİ EN ÜSTTE. yakinda: true → henüz yayımlanmadı ("Yakında" rozeti; yeni sürüm çıkınca maddeleri o sürüme taşıyın).
    liste: [
      {
        surum: 'Sıradaki sürüm', tarih: 'Yakında', yakinda: true,
        maddeler: [
          'Ortamlar ve giriş tek sayfada: adım adım sihirbaz, ortam başına "Hesap"',
          'Telegram botu: telefondan komutla koşu ve anlık bildirim',
          'Pano uyarıları: eşik aşılınca haber; kartlarda "Bildirimler" düğmesi',
          'Koşu göstergesi: başka yerden başlayan koşular da ekranda',
          'Bildirim merkezi (zil), bilgisayar bildirimi ve ses; Lokal ortam ve "Ortamı kopyala"'
        ]
      },
      {
        surum: 'v1.9', tarih: '9 Ekim 2026',
        maddeler: [
          'Ekip paylaşımı: ortak klasörden sürümlü yayın, "Güncelle" ve eski sürüme dönüş',
          'Ekip listesi ve roller (Admin / Kullanıcı)',
          '"Hızlı test" artık "Nöbetçi taraması"; değişiklikler test verisi tablosuna da işlenebilir',
          'Ayarlar sadeleşti: her bölüm tek, açılıp kapanan kutu'
        ]
      },
      {
        surum: 'v1.8', tarih: '7 Ekim 2026',
        maddeler: [
          'Kişisel veri maskeleme tek anahtarla (varsayılan açık)',
          'Önceki adımda okunan değer artık her tür alanda kullanılabilir',
          'SQL ve servis adımından sonra bekleme eklenebilir'
        ]
      },
      {
        surum: 'v1.7', tarih: '7 Ekim 2026',
        maddeler: [
          'Panoda satıra tıklayınca ayrıntı sorgusu: ilgili kayıtlar hemen altında',
          'Ekran akışında SQL ve servis adımları daha esnek',
          'Tüm uygulamada ince, sade kaydırma çubukları'
        ]
      },
      {
        surum: 'v1.6.1', tarih: '6 Ekim 2026',
        maddeler: [
          'Pano kutucukları kartla birlikte büyür; fark gösterimi sadeleşti',
          'Renk eşiği başka bir sütuna göre uygulanabilir',
          'Otomatik yenilemede 1 ve 2 saat seçenekleri'
        ]
      },
      {
        surum: 'v1.6', tarih: '6 Ekim 2026',
        maddeler: [
          'Özet panosu izleme ekranı oldu: sürükle-bırak kartlar, kart başına dönem',
          'Panoda ortam seçimi (TEST / CANLI); CANLI sorgu tek onayla',
          'Ekran akışında servis isteği adımı ve koşul düzenleyici',
          'Hızlı test daha çok alan türünü tanır, kaldığı yerden devam eder'
        ]
      },
      {
        surum: 'v1.5.1', tarih: '2 Ekim 2026',
        maddeler: [
          'Güvenli tıklama: gönderim düğmesine asla iki kez basılmaz',
          'Bağlı listeler (il → ilçe gibi) kendiliğinden bulunur',
          'Site pencereleri testi kilitlemez; dosya alanları desteklenir',
          '16 farklı örnek ekran türünde baştan sona denendi'
        ]
      },
      {
        surum: 'v1.5', tarih: '1 Ekim 2026',
        maddeler: [
          'Hızlı test: adresi verin, Nöbetçi ekranı keşfedip kaydetsin',
          'Doldur: boş alanlar yalnız test verisinden, siz seçersiniz',
          'Maskeli alanlara gerçekçi yazım; bekleme süreleri kısaldı',
          'Basit mod (deneysel): sade Testlerim · Sonuçlar · Ayarlar görünümü'
        ]
      },
      {
        surum: 'v1.4', tarih: '29 Eylül 2026',
        maddeler: [
          'Hazırlık kontrolü ve "Neden çalışmıyor?" açıklaması',
          'Rehberler isteğe bağlı; aynı anda tek pencere',
          'Hızlı arama (Ctrl+K) servisleri ve eylemleri de bulur',
          'Test verisi ve servis formlarında birçok kolaylık'
        ]
      },
      {
        surum: 'v1.3.1', tarih: '29 Eylül 2026',
        maddeler: ['Binlerce kayıt seçiliyken yedekten yükleme artık sorunsuz']
      },
      {
        surum: 'v1.3', tarih: '29 Eylül 2026',
        maddeler: [
          'Taranan ekran koşulabilir test üretir; koşullu alanlar ve bağlı listeler dahil',
          'Sayfada seç: düğmeyi ve sonucu tıklayarak işaretleyin',
          'İlk kullanım için "Başlarken" listesi',
          'Terimler sadeleşti: Planlı koşular, Test verisi, Başarısız'
        ]
      },
      {
        surum: 'v1.2.1', tarih: '29 Eylül 2026',
        maddeler: ['Servis senaryo önerileri ekranlardakiyle aynı yerde ve düzende']
      },
      {
        surum: 'v1.2', tarih: '29 Eylül 2026',
        maddeler: [
          'PDF dönem raporları ve kapsam matrisi',
          'Gerekçeli senaryo önerileri (ekran ve servis)',
          'Kurtarma kuralları: "şu olursa şunu yap"',
          'cURL yapıştırarak servis ekleme'
        ]
      },
      {
        surum: 'v1.1', tarih: '28 Eylül 2026',
        maddeler: [
          'Tablo satırı başına ayrı test; başarısızları tekrar çalıştırma',
          'Senaryo tasarım yardımcısı: sınır değer ve eksik kombinasyon önerileri',
          'Dosya içeriği doğrulama (CSV, XLSX, PDF) ve servis sözleşmesi testi',
          'Uçtan uca akış: ekran + servis + SQL; izinler ve riskli ortam seçimi'
        ]
      },
      {
        surum: 'v1.0', tarih: '27 Eylül 2026',
        maddeler: [
          'İlk sürüm: Windows ve Mac için tek paket',
          'Şifreli kasa; parola yalnız sizde',
          'Tüm izinler kapalı başlar'
        ]
      }
    ]
  },

  // ------------------------------------------------------------------ İndir (sürüm ve dosyalar GitHub'dan canlı okunur)
  indir: {
    depo: 'nobetciapp/indir',
    ust: 'İndir',
    baslik: 'Nöbetçi’yi indirin.',
    alt: 'Ücretsiz. Kendi bilgisayarınızda çalışır.',
    yakinda: 'İlk sürüm yakında',
    sonSurum: 'Son sürüm',
    // Kartlarda yalnız düğme ve tek satır gereksinim; kurulum adımları indirilen dosyanın içindeki OKUBENI'dedir.
    sistemler: { windows: 'Windows', mac: 'Mac' },
    buBilgisayar: 'Bu bilgisayar',
    dosyalar: {
      windows: { ad: 'Nobetci-windows.zip', dugme: 'Windows için indir', not: 'Windows 10/11 · 64 bit' },
      macArm: { ad: 'Nobetci-mac-arm64.tar.gz', dugme: 'Mac için indir', not: 'Apple Silicon · macOS 14+' },
      macIntel: { ad: 'Nobetci-mac-x64.tar.gz', dugme: 'Mac için indir', not: 'Intel · macOS 14+', baglanti: 'Intel Mac için' }
    },
    digerleri: 'Diğer sistemler',
    kurulumNotu: 'Kurulum adımları indirilen dosyanın içinde.',
    ilkAcilis: 'İlk açılışta kasa parolanızı belirlersiniz; parola yalnız sizde kalır.'
  },

  // Ana sayfa bölümlerinin altındaki bağlantı metni
  devami: 'Ayrıntılar',

  // ------------------------------------------------------------------ Nasıl çalışır sayfası
  nasilSayfa: {
    ust: 'Süreç',
    baslik: 'Kurulumdan sabah raporuna.',
    alt: 'Sekiz adım. Aşağı kaydırın.',
    izle: 'Bu adımı izle',
    adimlar: [
      { ad: 'Ortam ekle', baslik: 'Önce adres.', satir: 'TEST, HAZIRLIK, CANLI: test edeceğiniz ortamı sihirbazla ekleyin.', tur: 0,
        kareler: [{ ekran: 'ortamlar', hedef: 'ortamEkle', not: 'Ortam ekle' }, { ekran: 'ortam-sihirbazi', hedef: 'adres', not: 'Adres ve tür' }] },
      { ad: 'Girişi öğret', baslik: 'Girişi bir kez gösterin.', satir: 'Siz giriş yaparsınız; Nöbetçi adımları kaydeder. 2FA dahil.', tur: 1,
        kareler: [{ ekran: 'ortamlar', hedef: 'girisiOgret', not: 'Girişi öğret' }, { ekran: 'giris-ogret', hedef: 'ogret', not: 'Tek tık, kayıt başlar' }] },
      { ad: 'Ekranı tara', baslik: 'Nöbetçi ekranı tanır.', satir: 'Alanları, adımları, seçenekleri bulur; ekran değişince fark eder.', tur: 2,
        kareler: [{ ekran: 'ekran-ekle', hedef: 'tarama', not: 'Nöbetçi taraması' }, { ekran: 'degisiklikler', hedef: 'yeniAlan', not: 'Yeni alan bulundu' }] },
      { ad: 'Senaryo', baslik: 'Form doldurun, kod yazmayın.', satir: 'Değerleri girin; hazırlık kontrolü eksikleri anında söyler.', tur: 3,
        kareler: [{ ekran: 'senaryo', hedef: 'baslik', not: 'Değerler' }, { ekran: 'senaryo', hedef: 'hazirlik', not: 'Hazırlık kontrolü' }] },
      { ad: 'Koş', baslik: 'Canlı izleyin.', satir: 'Her senaryo sırayla koşar; dışarıdan başlayan koşular da ekranda görünür.', tur: 4,
        kareler: [{ ekran: 'senaryolar', hedef: 'kosuyuBaslat', not: 'Koşuyu başlat' }, { ekran: 'kosu', hedef: 'panel', bolge: [0.628, 0.097, 0.36, 0.52], not: 'Koşu göstergesi' }] },
      { ad: 'Sonuçlar ve pano', baslik: 'Bir bakışta durum.', satir: 'Başarı oranı, trend ve SQL kartları; eşik aşılınca kart uyarır.', tur: 5,
        kareler: [{ ekran: 'pano', hedef: 'ozetKutulari', not: 'Özet kutuları' }, { ekran: 'pano-sql', hedef: 'rozet', not: 'Eşik aşıldı: 1 uyarıda' }] },
      { ad: 'Telegram ve bildirimler', baslik: 'Sorun size gelir.', satir: 'Telefondan koşturun; uyarı ve sonuç hem cebinizde hem zilde.', tur: 6, telefon: true,
        kareler: [{ ekran: 'bildirim-merkezi', hedef: 'panel', not: 'Bildirim merkezi' }] },
      { ad: 'Planlı koşular', baslik: 'Her gece, kendiliğinden.', satir: 'Saati seçin; kaçan koşu bile sabah panoda uyarı olarak görünür.', tur: 8,
        kareler: [{ ekran: 'planli', hedef: 'kural', bolge: [0.2, 0.31, 0.62, 0.17], not: 'Gece nöbeti · 03:00' }] }
    ]
  },

  // ------------------------------------------------------------------ Özellikler sayfası
  ozellikSayfa: {
    ust: 'Özellikler',
    baslik: 'Tek uygulama, bütün test.',
    alt: 'Bir karta tıklayın; ayrıntısı açılsın.',
    neyiCozer: 'Neyi çözer',
    izle: 'İzle',
    kapat: 'Kapat',
    sorunBaslik: 'Hangi sorunu çözer?',
    sorunlar: [
      { sorun: 'Ekran değişti, testler kırıldı.', cozum: 'Değişiklik bulguları; tek tıkla güncellenir.' },
      { sorun: 'Test yazmak kod istiyor.', cozum: 'Form doldurun; senaryo hazır.' },
      { sorun: 'Gece koşusunu kimse görmüyor.', cozum: 'Pano, uyarı ve Telegram.' },
      { sorun: 'Veri dışarı çıkmamalı.', cozum: 'Şifreli yerel kasa, bulut yok.' }
    ],
    // medya: { ekran, hedef | bolge } gerçek ekran kesiti ya da { mikro: '<tür>' } küçük döngü (örnek metinleri "ornek"te).
    kartlar: [
      { ikon: 'ekran', ad: 'Ekran testleri', metin: 'Web formlarını modelden koşturur.', tur: 3,
        maddeler: ['Çok adımlı formlar ve bağlı listeler', 'Koşullu alanlar, iş kuralı mesajları', 'Playwright koduna dışa aktarma'],
        medya: { ekran: 'ekran-modeli', bolge: [0.19, 0.25, 0.56, 0.5] } },
      { ikon: 'servis', ad: 'Servis testleri', metin: 'SOAP, REST ve uçtan uca akışlar.', tur: 4,
        maddeler: ['WSDL ve cURL’den senaryo', 'Yanıt kontrolleri: durum kodu, JSON, XML', 'Servisleri zincirleyen uçtan uca akış'],
        medya: { ekran: 'servis', bolge: [0.2, 0.06, 0.8, 0.42] } },
      { ikon: 'veri', ad: 'SQL kontrolleri', metin: 'Veritabanını okur; panoda ve koşuda.', tur: 5,
        maddeler: ['Yalnız okuma bağlantısı', 'Panoda tablo, sayı ve grafik kartları', 'Koşudan sonra veritabanında doğrulama'],
        medya: { ekran: 'pano-sql', bolge: [0.205, 0.4, 0.45, 0.55] } },
      { ikon: 'tarama', ad: 'Değişiklik bulguları', metin: 'Ekran değişince önce siz görürsünüz.', tur: 2,
        maddeler: ['Yeni alan, değişen etiket, kaybolan seçenek', 'Kabul et ya da reddet; model güncellenir', 'Etkilenen senaryolar listelenir'],
        medya: { ekran: 'degisiklikler', bolge: [0.19, 0.12, 0.8, 0.55] } },
      { ikon: 'saat', ad: 'Planlı koşular', metin: 'Gece, hafta sonu, her sabah.', tur: 8,
        maddeler: ['Gün ve saat seçimi, her N saatte bir', 'Kaçan koşu panoda uyarı olur', 'Kasa kilitliyken de çalışabilir (izinle)'],
        medya: { ekran: 'planli', bolge: [0.19, 0.23, 0.64, 0.24] } },
      { ikon: 'pano', ad: 'Pano uyarıları', metin: 'Eşik aşılınca haber verir.', tur: 6,
        maddeler: ['Kartta “Bildirimler”: kural bir cümle', 'Eşik, hızlı artış, yeni satır, veri yok', 'Önizle: bildirim göndermeden dene'],
        medya: { ekran: 'pano-uyari', bolge: [0.21, 0.17, 0.44, 0.4] } },
      { ikon: 'telefon', ad: 'Telegram botu', metin: 'Telefondan koşun, sonucu alın.', tur: 7,
        maddeler: ['/senaryolar ile seç, koştur', 'Sonuç aynı mesajda güncellenir', 'Komutlar izinle açılır'],
        medya: { mikro: 'telefon' } },
      { ikon: 'zil', ad: 'Bildirim merkezi', metin: 'Uyarı, düzelme, koşu sonu: tek zilde.', tur: 6,
        maddeler: ['Okunmamışlar zilde sayılır', 'Bilgisayar bildirimi ve ses (isteğe bağlı)', 'Telegram ve webhook’a da gider'],
        medya: { ekran: 'bildirim-merkezi', hedef: 'panel' } },
      { ikon: 'rapor', ad: 'PDF raporlar', metin: 'Döneme göre, maskeli rapor.', tur: 5,
        maddeler: ['Ekran, servis ya da tüm proje', 'Önceki dönemle karşılaştırma', 'Kişisel veriler maskelenir'],
        medya: { ekran: 'raporlar', bolge: [0.215, 0.3, 0.47, 0.29] } },
      { ikon: 'ekip', ad: 'Ekip ve roller', metin: 'Kim neyi açar, siz seçersiniz.', tur: 0,
        maddeler: ['Admin ve Kullanıcı rolleri', 'Liste kasada şifreli', 'Ortak klasörle ekip paylaşımı'],
        medya: { ekran: 'ekip', bolge: [0.205, 0.53, 0.5, 0.45] } },
      { ikon: 'yedek', ad: 'Yedekleme', metin: 'Tek dosya, şifreli yedek.', tur: 0,
        maddeler: ['.tayedek: kasa parolasıyla şifreli', 'Otomatik yedek ve saklama süresi', 'Başka bilgisayara tek adımda taşıma'],
        medya: { ekran: 'yedekleme', bolge: [0.21, 0.17, 0.45, 0.24] } }
    ]
  },

  // ------------------------------------------------------------------ Güvenlik sayfası
  guvenlikSayfa: {
    ust: 'Güvenlik',
    baslik: 'Verileriniz sizde.',
    alt: 'Sakin, sade ve sizin kontrolünüzde.',
    bloklar: [
      { id: 'kasa', baslik: 'Şifreli kasa.', satir: 'Parolalar, 2FA anahtarları, ortam adresleri ve sonuçlar AES-256 ile şifrelenir.',
        ogeler: ['Parolalar', '2FA anahtarları', 'Ortam adresleri', 'Senaryolar', 'Sonuçlar'] },
      { id: 'yerel', baslik: 'Bulut yok.', satir: 'Nöbetçi sizin bilgisayarınızda çalışır; yalnız test ettiğiniz uygulamaya bağlanır.',
        etiketler: { bilgisayar: 'Sizin bilgisayarınız', uygulama: 'Test ettiğiniz uygulama', bulut: 'Bulut' } },
      { id: 'izinler', baslik: 'İzinler kapalı başlar.', satir: 'Nöbetçi sizin adınıza bir şey yapmadan önce izin ister.',
        izinler: ['Web uygulamasına erişim', 'Servis istekleri', 'Telegram’dan komut', 'Arka plan çalışması', 'Dış gönderim'], izinVer: 'İzin ver' },
      { id: 'canli', baslik: 'Canlı ortamda iki kez sorar.', satir: 'Canlı ortamdaki her koşu ayrıca, açık bir onay ister.',
        pencere: { baslik: 'CANLI ortamda çalıştırılsın mı?', kutu: 'Canlı ortamda çalıştırmaya izin veriyorum', dugme: 'Başlat' } },
      { id: 'maske', baslik: 'Kişisel veri görünmez.', satir: 'Rapor, ekran ve bildirimlerde kişisel veriler maskelenir.',
        ornek: [['E-posta', 'deniz.yilmaz@ornek.test', 'd••••••••••@ornek.test'], ['Telefon', '0555 123 45 67', '0555 ••• •• 67'], ['Kart', '4111 1111 1111 1111', '4111 •••• •••• 1111']] },
      { id: 'yedek', baslik: 'Yedek de şifreli.', satir: 'Tek .tayedek dosyası; yalnız kasa parolasıyla açılır.', dosya: 'nobetci-2026-10-12.tayedek' },
      { id: 'ekip', baslik: 'Ekip ve roller.', satir: 'Kimin açabileceğini siz seçersiniz; liste de kasada şifreli.',
        kisiler: [['Deniz', 'Admin'], ['Ece', 'Kullanıcı'], ['Mert', 'Kullanıcı']] }
    ]
  },

  yenilikSayfa: { ust: 'Sürüm notları', baslik: 'Yenilikler', alt: 'Her sürümde neler değişti.', yeni: 'yeni' },

  tur: {
    baslik: 'Nöbetçi turu',
    // Ana sayfadaki kısa döngü: [bölüm sırası, adım sırası]
    tanitim: [[1, 0], [2, 1], [4, 2], [5, 1]],
    bolumler: [
      { ad: 'Ortam ekle', adimlar: [
        { ekran: 'ortamlar', hedef: 'ortamEkle', tik: true, yazi: 'Önce test ortamınızı ekleyin' },
        { ekran: 'ortam-sihirbazi', hedef: 'adres', yazi: 'Adresi yazın, türünü seçin' }
      ] },
      { ad: 'Girişi öğret', adimlar: [
        { ekran: 'ortamlar', hedef: 'girisiOgret', tik: true, yazi: 'Burası: girişi bir kez öğretirsiniz' },
        { ekran: 'giris-ogret', hedef: 'ogret', tik: true, yazi: 'Siz girin, Nöbetçi kaydeder' }
      ] },
      { ad: 'Ekranı tara', adimlar: [
        { ekran: 'ekran-ekle', hedef: 'tarama', yazi: 'Adresi verin, gerisini Nöbetçi yapar' },
        { ekran: 'degisiklikler', hedef: 'yeniAlan', yazi: 'Ekran değişti: yeni alan bulundu' },
        { ekran: 'degisiklikler', hedef: 'hepsiniKabul', tik: true, yazi: 'Tek tıkla modele işleyin' }
      ] },
      { ad: 'Senaryo', adimlar: [
        { ekran: 'senaryo', hedef: 'baslik', yazi: 'Değerleri yazın, kod yok' },
        { ekran: 'senaryo', hedef: 'hazirlik', yazi: 'Eksikleri hazırlık kontrolü söyler' }
      ] },
      { ad: 'Koş', adimlar: [
        { ekran: 'senaryolar', hedef: 'kosuyuBaslat', tik: true, yazi: 'Tek tıkla bütün senaryolar' },
        { ekran: 'izin', hedef: 'pencere', yazi: 'İzinler kapalı başlar; siz açarsınız' },
        { ekran: 'kosu', hedef: 'panel', bolge: [0.628, 0.097, 0.36, 0.52], yazi: 'Her senaryoyu canlı izleyin' }
      ] },
      { ad: 'Sonuç panosu', adimlar: [
        { ekran: 'pano', hedef: 'ozetKutulari', yazi: 'Başarı oranı bir bakışta' },
        { ekran: 'pano', hedef: 'trend', yazi: 'Her gece, tek grafikte' }
      ] },
      { ad: 'Uyarılar ve bildirimler', adimlar: [
        { ekran: 'pano-sql', hedef: 'bildirimler', tik: true, yazi: 'Kartta “Bildirimler”e tıklayın' },
        { ekran: 'pano-uyari', hedef: 'cumle', bolge: [0.218, 0.298, 0.44, 0.06], yazi: 'Kural bir cümle: ADET 25’i geçerse' },
        { ekran: 'bildirim-merkezi', hedef: 'panel', yazi: 'Eşik aşılınca zil haber verir' }
      ] },
      { ad: 'Telegram', telefon: true, adimlar: [
        { olay: 'komut', yazi: 'Telefondan bir komut yeter' },
        { olay: 'secim', yazi: 'Senaryoyu seçin' },
        { olay: 'sonuc', yazi: 'Sonuç aynı mesajda güncellenir' }
      ] },
      { ad: 'Planlı koşular', adimlar: [
        { ekran: 'planli', hedef: 'kural', bolge: [0.2, 0.31, 0.62, 0.17], yazi: 'Her gece 03:00, kendiliğinden' }
      ] }
    ]
  },

  altbilgi: {
    not: 'Nöbetçi kendi bilgisayarınızda çalışır. Sürüm bilgisi için GitHub’a tek bir istek yapılır; çerez yok, takip yok.',
    izle: 'Turu izle'
  }
};
