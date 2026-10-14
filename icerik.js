// NÖBETÇİ TANITIM SİTESİ — TÜM METİNLER BU DOSYADADIR.
// Yeni sürümde yalnız bu dosya (ve gerekirse ekran görüntüleri) güncellenir; HTML / animasyon koduna dokunmak gerekmez.
//  - surum / tarih: alt bilgideki sürüm işareti.
//  - menu: üst menü (sayfa = <body data-sayfa="…"> değeri; etkin bağlantı buna göre işaretlenir).
//  - yenilikler: "Yenilikler" sayfası ve ana sayfa bölümü (EN YENİ EN ÜSTTE; her kayıt: surum, tarih, 3–5 kısa madde).
//  - vitrin: ana sayfadaki "Neler yapar" bölümü (üzerine gelince oynayan sahneler); faydalar: "Neden Nöbetçi" kutuları.
//  - nasilSayfa: "Nasıl çalışır" sayfasının adımları. Her adım "kareler" ile gerçek ekran görüntüsünde sırayla yakınlaşır
//    (ekran = assets/ekranlar/<ad>.webp, hedef = konumlar.js'teki ad ya da bolge: [x, y, g, y] 0–1); telefon: true ise
//    Telegram telefonu; tur: "Bu adımı izle" düğmesinin açtığı tur bölümünün sırası (0'dan).
//  - ozellikSayfa / guvenlikSayfa: ilgili sayfaların kartları ve blokları.
//  - tur: "İzle" tanıtım turu. Her adım bir ekran görüntüsünü ve o görüntüdeki bir hedefi gösterir. yazi ≤ 8 sözcük.
window.ICERIK = {
  // Yedek sürüm bilgisi: GitHub'dan son sürüm okunamazsa gösterilir (son yayımlanan sürüm).
  surum: 'v2.2',
  tarih: '14 Ekim 2026',

  marka: { ad: 'Nöbetçi', slogan: 'Testlerin Nöbetçisi' },

  menu: [
    { ad: 'Ana sayfa', adres: 'index.html', sayfa: 'ana' },
    { ad: 'Nasıl çalışır', adres: 'nasil-calisir.html', sayfa: 'nasil' },
    { ad: 'Özellikler', adres: 'ozellikler.html', sayfa: 'ozellikler' },
    { ad: 'Güvenlik', adres: 'guvenlik.html', sayfa: 'guvenlik' },
    { ad: 'Yenilikler', adres: 'yenilikler.html', sayfa: 'yenilikler' },
    { ad: 'SSS', adres: 'sss.html', sayfa: 'sss' },
    { ad: 'İletişim', adres: 'iletisim.html', sayfa: 'iletisim' },
    { ad: 'İndir', adres: 'indir.html', sayfa: 'indir' }
  ],

  kahraman: {
    etiket: 'Kod yazmadan test otomasyonu',
    baslik: 'Testlerin Nöbetçisi',
    dugme: 'İzle',
    // Giriş demosu: Nöbetçi penceresinde döngüde oynayan beş aşama (ad ≤ 1 sözcük; yol = pencerenin üst satırı).
    adimlar: [
      { id: 'tara', ad: 'Tara', yol: 'Ekranlar / Müşteri kaydı / Nöbetçi taraması', sure: 4600 },
      { id: 'oner', ad: 'Öner', yol: 'Senaryolar / Öneriler', sure: 4200 },
      { id: 'kos', ad: 'Koş', yol: 'Koşu · Gece nöbeti · TEST', sure: 4600 },
      { id: 'yakala', ad: 'Yakala', yol: 'Sonuçlar / Kart ile ödeme', sure: 5600 },
      { id: 'rapor', ad: 'Raporla', yol: 'Pano · Genel', sure: 4600 }
    ],
    demo: {
      alanlar: [['Ad soyad', 'metin'], ['E-posta', 'e-posta'], ['Telefon', 'telefon'], ['Şehir', 'seçim'], ['Doğum tarihi', 'tarih'], ['Sözleşme onayı', 'onay']],
      bulunan: 'Bulunan alanlar', modelHazir: 'Ekran modeli hazır',
      oneriBaslik: 'Nöbetçi 4 eksik durum buldu', senaryo: 'Senaryo', ekle: 'Ekle', eklendi: 'Eklendi',
      oneriler: [['Sınır değer', 'Doğum tarihi: bugün'], ['Boş alan', 'E-posta boş bırakılırsa'], ['Geçersiz biçim', 'Telefon: 9 hane'], ['Kombinasyon', 'Şehir × sözleşme onayı']],
      kosuAdi: 'Gece nöbeti · TEST', senaryolar: ['Yeni müşteri — Ankara', 'Kitap siparişi', 'Kampanyalı sepet', 'Kart ile ödeme', 'Profil güncelleme'], kalan: 3,
      hataBaslik: 'Kart ile ödeme', kaldi: 'Kaldı', duzeldi: 'Geçti', hataNeden: 'Ödeme onayı 15 sn içinde görünmedi',
      beklenen: 'Beklenen', gorulen: 'Görülen', tekrar: 'Tekrar koş', bildirim: '1 test kaldı · Kart ile ödeme',
      telefon: ['❌ Kart ile ödeme kaldı', '↻ Tekrar koş', '✅ Kart ile ödeme geçti'],
      basari: 'Başarı', trend: 'Son 14 gece', ekranlar: 'Ekranlar', servisler: 'Servisler', sabah: 'Günaydın · 60 / 60 geçti'
    }
  },

  tanitim: { etiket: 'Kısa tanıtım', baslik: '2 dakikada Nöbetçi', alt: 'Gerçek ekranlar. Tıklayın, baştan sona izleyin.' },

  // Ana sayfa "Neler yapar" vitrini: soldaki başlığın ya da sahnenin üzerine gelince animasyon oynar (dokunmatikte dokununca).
  // id sırası serbesttir; her id'nin görseli index.html'de (.vitrin-panel[data-sahne]) ya da js/site.js'te (YENI_SAHNE) kuruludur.
  // ad ≤ 4 sözcük, satir ≤ 10 sözcük. sure: animasyon süresi (ms).
  vitrin: {
    ust: 'Neler yapar',
    baslik: 'Bütün test süreci, tek uygulamada.',
    ipucu: 'Üzerine gelin',
    ipucuDokun: 'Dokunun, izleyin',
    liste: [
      { id: 'tarama', ikon: 'tarama', ad: 'Ekran ekran tarar', satir: 'Alanları ve değişiklikleri kendisi bulur.', sure: 3400, rozet: 'Yeni alan' },
      { id: 'oneri', ikon: 'oneri', ad: 'Senaryo önerir', satir: 'Eksik kalan durumları gerekçesiyle önerir.', sure: 3800,
        baslik: '4 öneri, gerekçesiyle', ekle: 'Ekle', eklendi: 'Eklendi', sayac: 'Senaryo', ilk: 3,
        oneriler: [['Sınır değer', 'Adet: 0 ve 1000'], ['Boş alan', 'E-posta boş bırakılırsa'], ['Geçersiz biçim', 'Telefon: 9 hane'], ['Kombinasyon', 'Şehir × teslimat türü']] },
      { id: 'kodsuz', ikon: 'kod', ad: 'Kod yazmadan', satir: 'Girişi bir kez gösterin, formu doldurun.', sure: 4200 },
      { id: 'akis', ikon: 'akis', ad: 'Kendi akışınız', satir: 'Ekran, servis ve SQL tek akışta.', sure: 3800,
        baslik: 'Yeni sipariş · uçtan uca', palet: 'Adım ekle', sonuc: 'Akış geçti',
        adimlar: [['ekran', 'Ekran', 'Sipariş formu'], ['servis', 'Servis', 'Stok kontrolü'], ['veri', 'SQL', 'Sipariş kaydı']] },
      { id: 'pano', ikon: 'pano', ad: 'Size özel pano', satir: 'Kartları dizin; süreci tek ekrandan yönetin.', sure: 4000,
        baslik: 'Özet panosu', basari: 'Başarı', bugun: 'Bugün', trend: 'Son 14 gece', servis: 'Servisler',
        sql: 'Bekleyen sipariş', esik: 'Eşik aşıldı', bildirim: 'Bekleyen sipariş 25’i geçti' },
      { id: 'ekip', ikon: 'ekip', ad: 'Ekiple paylaşın', satir: 'Bir kez yayınlayın, herkes tek tıkla günceller.', sure: 3800,
        siz: 'Sizin Nöbetçi’niz', yayinla: 'Yayınla', guncelle: 'Güncelle', guncel: 'Güncel',
        kisiler: ['Deniz', 'Ece', 'Mert'] },
      { id: 'gece', ikon: 'saat', ad: 'Siz uyurken koşar', satir: 'Sabah özet hazır, sorun cebinizde.', sure: 4200,
        sabah: { baslik: 'Günaydın', satir: '58 / 60 test geçti', dikkat: '1 ekran dikkat istiyor' } },
      { id: 'kasa', ikon: 'kilit', ad: 'Verileriniz sizde', satir: 'Şifreli kasa, bulut yok.', sure: 3000 }
    ]
  },

  // "Neden Nöbetçi": dört kısa fayda (buyuk ≤ 3 sözcük, satir ≤ 6 sözcük).
  faydalar: {
    baslik: 'Neden Nöbetçi?',
    liste: [
      { ikon: 'hedef', buyuk: 'Hata payı en aza', satir: 'Her ekran, her koşuda kontrol.' },
      { ikon: 'kod', buyuk: '0 satır kod', satir: 'Formu doldurun, test hazır.' },
      { ikon: 'pano', buyuk: 'Tek panel', satir: 'Tara, koş, izle, raporla.' },
      { ikon: 'ekip', buyuk: 'Bütün ekip', satir: 'Bir kez kurun, herkes kullansın.' }
    ]
  },

  // Telegram sohbeti (Nasıl çalışır, Özellikler ve turun Telegram bölümü)
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

  kapanis: { baslik: "Nöbetçi'yi izleyin", alt: 'İki dakika. Bilgisayarınızda çalışır, hesap gerekmez.', dugme: 'İzle' },

  // Ana sayfadaki kısa bölüm (Nasıl çalışır sayfasına bağlanır)
  nasil: {
    baslik: 'Nasıl çalışır',
    // {ozet} = bu listedeki adım sayısı, {tam} = Nasıl çalışır sayfasındaki adım sayısı (kendiliğinden yazılır).
    alt: 'Özetle {ozet} adım; tamamı {tam} adım.',
    adimlar: [
      { ad: 'Ortam ekle', metin: 'Test edeceğiniz adresi yazın: TEST, HAZIRLIK…' },
      { ad: 'Girişi öğret', metin: 'Bir kez giriş yapın; Nöbetçi kaydeder, 2FA dahil.' },
      { ad: 'Ekranı tara', metin: 'Alanları, adımları ve seçenekleri kendisi bulur.' },
      { ad: 'Senaryo yaz', metin: 'Değerleri formdan girin. Kod yok.' },
      { ad: 'Koş ve izle', metin: 'Şimdi, gece ya da telefondan. Sonuç panoda.' }
    ]
  },

  yenilikler: {
    baslik: 'Yenilikler',
    alt: 'Her sürümde neler değişti.',
    // EN YENİ EN ÜSTTE. yakinda: true → henüz yayımlanmadı ("Yakında" rozeti; yeni sürüm çıkınca maddeleri o sürüme taşıyın).
    liste: [
      {
        surum: 'v2.2', tarih: '14 Ekim 2026',
        maddeler: [
          'Windows paketi: Nöbetçi artık Windows 10/11’de de çalışır',
          'Hata kalıpları: ekranda çıkan hata penceresini tek tıkla tanıtın; koşu yalnız tanıttığınız kalıplarla hata verir',
          'Nöbetçi taraması: Web, Mobil ve Tablet birlikte; tarayıcı penceresinde izleme',
          'Hatırlatıcılar ve Bildirimler sayfası (Nöbetçi zili, Telegram ve ses)',
          'Koşu iyileştirmeleri'
        ]
      },
      {
        surum: 'v2.1', tarih: '13 Ekim 2026',
        maddeler: [
          'Web sitelerinde kelime arama testi özelliği',
          'Telefon ve tablet görünümünde ekran testleri özelliği',
          'Oracle veritabanı bağlantısında kolaylaştırma',
          'Nöbetçi taramasında iyileştirmeler'
        ]
      },
      {
        surum: 'v2.0', tarih: '12 Ekim 2026',
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
          'Bağlı listeler kendiliğinden bulunur',
          'Site pencereleri testi kilitlemez; dosya alanları desteklenir'
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
      macArm: { ad: 'Nobetci-mac-arm64.tar.gz', dugme: 'M serisi Mac için indir', not: 'M1, M2, M3, M4 · macOS 14+' },
      macIntel: { ad: 'Nobetci-mac-x64.tar.gz', dugme: 'Intel Mac için indir', not: 'Intel işlemcili · macOS 14+', baglanti: 'Intel Mac için indir' },
      // Mac kartında hangisinin seçileceğini anlatan tek satır.
      macHangisi: 'Hangisi sizinki? Elma menüsü › Bu Mac Hakkında: "Yonga: Apple M…" yazıyorsa üstteki, "İşlemci: Intel" yazıyorsa alttaki.'
    },
    digerleri: 'Diğer sistemler',
    kurulumNotu: 'Kurulum adımları indirilen dosyanın içinde.',
    // Mac'te "açılamıyor" uyarısı için SSS bağlantısı (tek satır).
    macIpucu: { metin: 'Mac “açılamıyor” derse:', baglanti: 'ne yapılır?', adres: 'sss.html#mac-acilamiyor' },
    ilkAcilis: 'İlk açılışta kasa parolanızı belirlersiniz; parola yalnız sizde kalır.'
  },

  // Ana sayfa bölümlerinin altındaki bağlantı metni
  devami: 'Ayrıntılar',

  // ------------------------------------------------------------------ Nasıl çalışır sayfası
  nasilSayfa: {
    ust: 'Süreç',
    baslik: 'Kurulumdan sabah raporuna.',
    alt: '{tam} adım. Görselin üzerine gelin, izleyin.',
    izle: 'Bu adımı izle',
    adimlar: [
      { ad: 'İlk açılış', baslik: 'Yedekten ya da sıfırdan.', satir: 'Yedeğinizi yükleyin ya da yeni proje başlatıp kasa parolanızı belirleyin.', tur: 0,
        kareler: [{ ekran: 'ilk-acilis', hedef: 'secenekler', not: 'Yedek yükle · Yeni proje' }, { ekran: 'ilk-kasa', hedef: 'form', not: 'Kasa parolası' }] },
      { ad: 'Ortam ekle', baslik: 'Önce adres.', satir: 'TEST, HAZIRLIK, CANLI: test edeceğiniz ortamı sihirbazla ekleyin.', tur: 1,
        kareler: [{ ekran: 'ortamlar', hedef: 'ortamEkle', not: 'Ortam ekle' }, { ekran: 'ortam-sihirbazi', hedef: 'adres', not: 'Adres ve tür' }] },
      { ad: 'Girişi öğret', baslik: 'Girişi bir kez gösterin.', satir: 'Siz giriş yaparsınız; Nöbetçi adımları kaydeder. 2FA dahil.', tur: 2,
        kareler: [{ ekran: 'ortamlar', hedef: 'girisiOgret', not: 'Girişi öğret' }, { ekran: 'giris-ogret', hedef: 'ogret', not: 'Tek tık, kayıt başlar' }] },
      { ad: 'Ekranı tara', baslik: 'Nöbetçi ekranı tanır.', satir: 'Alanları, adımları, seçenekleri bulur; ekran değişince fark eder.', tur: 3,
        kareler: [{ ekran: 'ekran-ekle', hedef: 'tarama', not: 'Nöbetçi taraması' }, { ekran: 'degisiklikler', hedef: 'yeniAlan', not: 'Yeni alan bulundu' }] },
      { ad: 'Senaryo', baslik: 'Form doldurun, kod yazmayın.', satir: 'Değerleri girin; hazırlık kontrolü eksikleri anında söyler.', tur: 4,
        kareler: [{ ekran: 'senaryo', hedef: 'baslik', not: 'Değerler' }, { ekran: 'senaryo', hedef: 'hazirlik', not: 'Hazırlık kontrolü' }] },
      { ad: 'Koş', baslik: 'Canlı izleyin.', satir: 'Her senaryo sırayla koşar; dışarıdan başlayan koşular da ekranda görünür.', tur: 5,
        kareler: [{ ekran: 'senaryolar', hedef: 'kosuyuBaslat', not: 'Koşuyu başlat' }, { ekran: 'kosu', hedef: 'panel', bolge: [0.628, 0.097, 0.36, 0.52], not: 'Koşu göstergesi' }] },
      { ad: 'Sonuçlar ve pano', baslik: 'Bir bakışta durum.', satir: 'Başarı oranı, trend ve SQL kartları; eşik aşılınca kart uyarır.', tur: 6,
        kareler: [{ ekran: 'pano', hedef: 'ozetKutulari', not: 'Özet kutuları' }, { ekran: 'pano-sql', hedef: 'rozet', not: 'Eşik aşıldı: 1 uyarıda' }] },
      { ad: 'Telegram ve bildirimler', baslik: 'Sorun size gelir.', satir: 'Telefondan koşturun; uyarı ve sonuç hem cebinizde hem zilde.', tur: 7, telefon: true,
        kareler: [{ ekran: 'bildirim-merkezi', hedef: 'panel', not: 'Bildirim merkezi' }] },
      { ad: 'Planlı koşular', baslik: 'Her gece, kendiliğinden.', satir: 'Saati seçin; kaçan koşu bile sabah panoda uyarı olarak görünür.', tur: 9,
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
      { ikon: 'ekran', ad: 'Ekran testleri', metin: 'Web formlarını modelden koşturur.', tur: 4,
        maddeler: ['Çok adımlı formlar ve bağlı listeler', 'Koşullu alanlar, iş kuralı mesajları', 'Playwright koduna dışa aktarma'],
        medya: { ekran: 'ekran-modeli', bolge: [0.2, 0.265, 0.525, 0.55] } },
      { ikon: 'servis', ad: 'Servis testleri', metin: 'SOAP, REST ve uçtan uca akışlar.', tur: 10,
        maddeler: ['WSDL ve cURL’den senaryo', 'Yanıt kontrolleri: durum kodu, JSON, XML', 'Servisleri zincirleyen uçtan uca akış'],
        medya: { ekran: 'servis', bolge: [0.198, 0.26, 0.786, 0.27] } },
      { ikon: 'veri', ad: 'SQL kontrolleri', metin: 'Veritabanını okur; panoda ve koşuda.', tur: 6,
        maddeler: ['Yalnız okuma bağlantısı', 'Panoda tablo, sayı ve grafik kartları', 'Koşudan sonra veritabanında doğrulama'],
        medya: { ekran: 'pano-sql', bolge: [0.2, 0.395, 0.457, 0.53] } },
      { ikon: 'tarama', ad: 'Değişiklik bulguları', metin: 'Ekran değişince önce siz görürsünüz.', tur: 3,
        maddeler: ['Yeni alan, değişen etiket, kaybolan seçenek', 'Kabul et ya da reddet; model güncellenir', 'Etkilenen senaryolar listelenir'],
        medya: { ekran: 'degisiklikler', bolge: [0.198, 0.21, 0.786, 0.58] } },
      { ikon: 'saat', ad: 'Planlı koşular', metin: 'Gece, hafta sonu, her sabah.', tur: 9,
        maddeler: ['Gün ve saat seçimi, her N saatte bir', 'Kaçan koşu panoda uyarı olur', 'Kasa kilitliyken de çalışabilir (izinle)'],
        medya: { ekran: 'planli', bolge: [0.142, 0.24, 0.716, 0.25] } },
      { ikon: 'pano', ad: 'Pano uyarıları', metin: 'Eşik aşılınca haber verir.', tur: 7,
        maddeler: ['Kartta “Bildirimler”: kural bir cümle', 'Eşik, hızlı artış, yeni satır, veri yok', 'Önizle: bildirim göndermeden dene'],
        medya: { ekran: 'pano-uyari', bolge: [0.2, 0.105, 0.785, 0.53] } },
      { ikon: 'telefon', ad: 'Telegram botu', metin: 'Telefondan koşun, sonucu alın.', tur: 8,
        maddeler: ['/senaryolar ile seç, koştur', 'Sonuç aynı mesajda güncellenir', 'Komutlar izinle açılır'],
        medya: { mikro: 'telefon' } },
      { ikon: 'zil', ad: 'Bildirim merkezi', metin: 'Uyarı, düzelme, koşu sonu: tek zilde.', tur: 7,
        maddeler: ['Okunmamışlar zilde sayılır', 'Bilgisayar bildirimi ve ses (isteğe bağlı)', 'Telegram ve webhook’a da gider'],
        medya: { ekran: 'bildirim-merkezi', hedef: 'panel' } },
      { ikon: 'rapor', ad: 'PDF raporlar', metin: 'Döneme göre, maskeli rapor.', tur: 11,
        maddeler: ['Ekran, servis ya da tüm proje', 'Önceki dönemle karşılaştırma', 'Kişisel veriler maskelenir'],
        medya: { ekran: 'raporlar', bolge: [0.2, 0.22, 0.785, 0.39] } },
      { ikon: 'ekip', ad: 'Ekip ve roller', metin: 'Kim neyi açar, siz seçersiniz.', tur: 12,
        maddeler: ['Admin ve Kullanıcı rolleri', 'Liste kasada şifreli', 'Ortak klasörle ekip paylaşımı'],
        medya: { ekran: 'ekip', bolge: [0.2, 0.6, 0.72, 0.385] } },
      { ikon: 'yedek', ad: 'Yedekleme', metin: 'Tek dosya, şifreli yedek.', tur: 13,
        maddeler: ['.tayedek: kasa parolasıyla şifreli', 'Otomatik yedek ve saklama süresi', 'Başka bilgisayara tek adımda taşıma'],
        medya: { ekran: 'yedekleme', bolge: [0.2, 0.105, 0.72, 0.29] } }
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

  // ------------------------------------------------------------------ İletişim sayfası
  // Form Web3Forms ile e-posta olarak iletilir (sitede e-posta adresi yoktur; yalnız herkese açık erişim anahtarı).
  // anahtar boşsa form gösterilir ama gönderilemez ("yakında" notu).
  iletisimSayfa: {
    ust: 'İletişim',
    baslik: 'Bize yazın.',
    alt: 'Bilgi almak, görüş ya da öneri: mesajınızı bırakın, size dönelim.',
    anahtar: '2c2d6bfd-35a5-4e33-a9f4-7d4db46b7feb',
    servis: 'https://api.web3forms.com/submit',
    konular: ['Ürün hakkında bilgi', 'Görüş', 'Öneri', 'Diğer'],
    etiketler: { ad: 'Ad soyad', eposta: 'E-posta', telefon: 'Telefon', konu: 'Konu', mesaj: 'Mesajınız' },
    ipuclari: { telefon: 'İsteğe bağlı', mesaj: 'Ne hakkında yazıyorsunuz?' },
    onay: 'Bilgilerimin yalnızca bu mesaja dönüş için kullanılmasını kabul ediyorum.',
    gonder: 'Gönder',
    gonderiliyor: 'Gönderiliyor…',
    basari: 'Teşekkürler, mesajınız ulaştı. En kısa sürede dönüş yapacağız.',
    hata: 'Mesaj gönderilemedi. Biraz sonra yeniden deneyin.',
    eksik: 'Lütfen işaretli alanları doldurun.',
    yakinda: 'İletişim formu çok yakında açılacak.',
    gizlilik: 'Mesajınız e-posta olarak iletilir; site çerez ya da takip kullanmaz.'
  },

  // ------------------------------------------------------------------ Sıkça Sorulanlar (sss.html)
  // Her soru tıklayınca açılır. id: bağlantı adresi (sss.html#<id>). Yanıt 1–3 kısa cümle; `ters tırnak` içi kod olarak gösterilir.
  sssSayfa: {
    ust: 'Yardım',
    baslik: 'Sıkça Sorulanlar',
    alt: 'Kısa sorular, kısa yanıtlar.',
    sorular: [
      { id: 'mac-acilamiyor', soru: 'Mac “Nöbetçi açılamıyor” ya da “geliştiricisi doğrulanamadı” diyor.',
        yanit: [
          'Paket henüz Apple imzalı değil; macOS bu yüzden uyarır.',
          'Sistem Ayarları › Gizlilik ve Güvenlik’te “Yine de Aç”a basın. macOS 15 ve sonrasında yalnız sağ tık › Aç yetmeyebilir.',
          'Olmazsa Terminal’de şunu çalıştırın: `xattr -dr com.apple.quarantine "/Applications/Nobetci.app"`'
        ] },
      { id: 'terminal', soru: 'Neden bir Terminal penceresi açılıyor?',
        yanit: ['Nöbetçi’nin yerel sunucusu o pencerede çalışır. Pencere açık kaldıkça Nöbetçi çalışır; kapatınca Nöbetçi de kapanır.'] },
      { id: 'planli', soru: 'Planlı (gece) koşular nasıl çalışır?',
        yanit: [
          'Bilgisayar açık ve uyanık, Nöbetçi de açık olmalı.',
          'Ayarlar › İzinler’de “Arka plan çalışması” izni açık olmalı. Kasa kilitliyken de çalışır; bu seçenek varsayılan açıktır.'
        ] },
      { id: 'veriler', soru: 'Verilerim nerede?',
        yanit: ['Yalnız bu bilgisayarda, şifreli kasada. İnternete gönderilmez.'] },
      { id: 'windows', soru: 'Windows’ta çalışır mı?',
        yanit: ['Evet. Windows 10/11 (64 bit) için paketi İndir sayfasından alın; açtığınız klasördeki Nöbetçi.exe ile başlatın.'] },
      { id: 'guncelleme', soru: 'Güncelleme nasıl yapılır?',
        yanit: [
          'Eski uygulamayı silin, yenisini yerine koyun. Verileriniz uygulamanın dışında durduğu için kaybolmaz.',
          'Yine de önce Ayarlar’dan yedek almanız önerilir.'
        ] }
    ]
  },

  yenilikSayfa: { ust: 'Sürüm notları', baslik: 'Yenilikler', alt: 'Her sürümde neler değişti.', yeni: 'yeni' },

  tur: {
    baslik: 'Nöbetçi turu',
    // Ana sayfadaki kısa döngü: [bölüm sırası, adım sırası]
    tanitim: [[2, 0], [3, 1], [5, 2], [6, 1]],
    bolumler: [
      { ad: 'İlk açılış', adimlar: [
        { ekran: 'ilk-acilis', hedef: 'secenekler', yazi: 'İlk açılışta iki yol var' },
        { ekran: 'ilk-acilis', hedef: 'yedekYukle', yazi: 'Yedeğiniz varsa tek dosyayla yükleyin' },
        { ekran: 'ilk-acilis', hedef: 'yeniProje', tik: true, yazi: 'Yoksa yeni proje başlatın' },
        { ekran: 'ilk-kasa', hedef: 'form', yazi: 'Önce kasa parolanızı belirleyin' }
      ] },
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
      ] },
      { ad: 'Servis testleri', adimlar: [
        { ekran: 'servis', hedef: 'tablo', yazi: 'SOAP ve REST senaryoları tek listede' }
      ] },
      { ad: 'PDF raporlar', adimlar: [
        { ekran: 'raporlar', hedef: 'tablo', yazi: 'Döneme göre rapor, tek tıkla indir' }
      ] },
      { ad: 'Ekip ve roller', adimlar: [
        { ekran: 'ekip', hedef: 'bolum', yazi: 'Kim Admin, kim Kullanıcı: siz seçin' }
      ] },
      { ad: 'Yedekleme', adimlar: [
        { ekran: 'yedekleme', hedef: 'cizelge', yazi: 'Ne zaman ne silinir, siz belirleyin' }
      ] }
    ]
  },

  altbilgi: {
    not: 'Nöbetçi kendi bilgisayarınızda çalışır. Sürüm bilgisi için GitHub’a tek bir istek yapılır; çerez yok, takip yok.',
    izle: 'Turu izle'
  }
};
