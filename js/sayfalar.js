// NÖBETÇİ TANITIM SİTESİ — alt sayfalar: Nasıl çalışır, Özellikler, Güvenlik, Yenilikler.
// Metinler icerik.js'ten gelir; ortak yardımcılar site.js'teki NobetciOrtak'tır (site.js bu dosyadan sonra yüklenir ve
// window.NobetciSayfa'yı kendi kurulumundan sonra çağırır).
(function () {
  'use strict';

  const KONUM = () => window.EKRAN_KONUMLARI || {};
  const yumusak = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // ------------------------------------------------------------------ gerçek ekran kesiti (yakınlaşan görüntü + ışık)
  /**
   * kareler: [{ ekran, hedef | bolge, not }]. Dönen guncelle(p) 0–1 ilerlemeye göre kamerayı kurar: her karede görüntü
   * önce tümüyle görünür, sonra hedefe yakınlaşır ve ışık yanar; son karede yakın kalır. İlk görüntü kesit görünüme
   * yaklaşınca, sonrakiler sıraları gelmeden hemen önce yüklenir.
   * secenek.dar: dar ekranda (≤ 600 px) çerçeve daha uzun, kamera hep yakın: hedef (kenar payıyla) çerçeveyi doldurur;
   * kareler arasında kamera bir hedeften ötekine kayar.
   */
  const DAR = window.matchMedia('(max-width: 600px)');
  function kesitKur(o, kap, kareler, secenek = {}) {
    const { el, kisit, harita } = o;
    const cerceve = el('div', 'kesit');
    const ic = el('div', 'kesit-kap');
    const gorseller = kareler.map((k) => {
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.className = 'kesit-gorsel';
      img.dataset.src = `assets/ekranlar/${k.ekran}.webp`;
      img.onerror = () => { if (!img.src.endsWith('.png')) img.src = `assets/ekranlar/${k.ekran}.png`; };
      ic.append(img);
      return img;
    });
    const isik = el('div', 'kesit-isik');
    ic.append(isik);
    cerceve.append(ic);
    const not = el('span', 'kesit-not');
    cerceve.append(not);
    kap.append(cerceve);
    if (secenek.dar) cerceve.classList.add('kesit-dar');
    const yukle = (j) => { const g = gorseller[j]; if (g && !g.src) g.src = g.dataset.src; };
    new IntersectionObserver(([g], gz) => { if (g.isIntersecting) { yukle(0); gz.disconnect(); } }, { rootMargin: '250px 0px' }).observe(cerceve);
    const bolge = (k) => (Array.isArray(k.bolge) ? k.bolge : (KONUM()[k.ekran] || {})[k.hedef] || [0.3, 0.3, 0.4, 0.3]);
    let son = -1;
    return function guncelle(p) {
      const n = kareler.length;
      const i = Math.min(n - 1, Math.floor(kisit(p, 0, 0.9999) * n));
      const q = p * n - i;
      const sonKare = i === n - 1;
      const dar = secenek.dar && DAR.matches;
      let z = yumusak(harita(q, 0.06, 0.4));
      if (!sonKare) z *= 1 - yumusak(harita(q, 0.8, 1));
      if (secenek.sabit || dar) z = 1;
      yukle(i);
      if (q > 0.5) yukle(i + 1);
      if (i !== son) { gorseller.forEach((g, j) => g.classList.toggle('acik', j === i)); not.textContent = kareler[i].not || ''; son = i; }
      let r = bolge(kareler[i]);
      // Dar ekran: karenin sonunda kamera bir sonraki hedefe kayar (görüntü sınırda değişir).
      if (dar && !sonKare) {
        const k = yumusak(harita(q, 0.78, 1));
        const r2 = bolge(kareler[i + 1]);
        if (k > 0) r = r.map((v, j) => v + (r2[j] - v) * k);
      }
      const W = cerceve.clientWidth || 1; const H = cerceve.clientHeight || 1;
      // Görüntü 16:10'dur; dar çerçeve daha uzun olabilir (görüntünün yüksekliği genişlikten hesaplanır).
      const Hg = dar ? W * 0.625 : H;
      let cx = r[0] + r[2] / 2; let cy = r[1] + r[3] / 2;
      // Dar ekranda okunabilirlik için en az ~2.6 kat; hedef sığmazsa sol / üst kenarı (yazının başı) görünür kalır.
      const S = dar
        ? kisit(Math.min(1 / (r[2] + 0.08), H / (Hg * (r[3] + 0.1))), Math.max(2.6, H / Hg), 3.6)
        : kisit(Math.min((secenek.oran || 0.6) / r[2], (secenek.oran || 0.6) / r[3]), 1.1, secenek.enCok || 2.2);
      if (dar) {
        const gx = 1 / S; const gy = H / (Hg * S);
        if (r[2] + 0.04 > gx) cx = r[0] - 0.02 + gx / 2;
        if (r[3] + 0.04 > gy) cy = r[1] - 0.02 + gy / 2;
      }
      const s = 1 + (S - 1) * z;
      const tx = kisit(W * 0.5 - W * cx * S, W - W * S, 0) * z;
      const ty = kisit(H * (dar ? 0.5 : 0.46) - Hg * cy * S, H - Hg * S, 0) * z;
      ic.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      Object.assign(isik.style, {
        left: `${(r[0] - 0.008) * 100}%`, top: `${(r[1] - 0.012) * 100}%`, width: `${(r[2] + 0.016) * 100}%`, height: `${(r[3] + 0.024) * 100}%`,
        opacity: secenek.isiksiz ? '0' : String(z), boxShadow: `0 0 0 4000px rgba(2,5,10,${0.55 * z}), 0 0 0 ${2 / s}px rgba(125,211,252,.95), 0 0 ${30 / s}px ${3 / s}px rgba(56,189,248,.5)`
      });
      not.classList.toggle('acik', z > 0.7 && !!kareler[i].not);
    };
  }

  /** Kaydırmaya bağlı yapışkan bölümler: her öğe için f(p). Azaltılmış harekette hepsi son hâlinde. */
  function kaydirmaBagla(o, ogeler, her) {
    if (o.AZ_HAREKET) { ogeler.forEach((x) => x.f(1)); return; }
    let istek = 0;
    const guncelle = () => {
      istek = 0;
      const y = innerHeight;
      ogeler.forEach((x, i) => {
        const r = x.kok.getBoundingClientRect();
        if (r.bottom < -y || r.top > y * 2) return;
        const p = o.kisit(-r.top / Math.max(1, r.height - y));
        if (Math.abs(p - x.son) > 0.0005) { x.son = p; x.f(p); }
        x.kok.style.setProperty('--giris', String(o.kisit((y - r.top) / (y * 0.6))));
        if (her) her(i, r, y);
      });
    };
    const iste = () => { if (!istek) istek = requestAnimationFrame(guncelle); };
    addEventListener('scroll', iste, { passive: true });
    // Boyut değişince (ör. telefon döndürülünce) ilerleme aynı kalsa da kamera yeniden kurulur.
    addEventListener('resize', () => { ogeler.forEach((x) => { x.son = -1; }); iste(); });
    guncelle();
  }

  /** Görünür olunca .canli sınıfı (döngüler yalnız görünürken çalışır). */
  function gorununce(kok, ac, kapat) {
    new IntersectionObserver(([g]) => { kok.classList.toggle('oynuyor', g.isIntersecting); if (g.isIntersecting) ac?.(); else kapat?.(); }, { threshold: 0.25 }).observe(kok);
  }

  // ------------------------------------------------------------------ Nasıl çalışır
  function nasilSayfasi(o) {
    const { ICERIK, el, $ } = o;
    const s = ICERIK.nasilSayfa || {};
    const kap = $('#adim-hikaye');
    const cipler = $('#adim-cipleri');
    const ogeler = [];
    (s.adimlar || []).forEach((a, i) => {
      const no = String(i + 1).padStart(2, '0');
      const li = el('li');
      const c = el('a');
      c.href = `#adim-${i + 1}`;
      c.append(el('b', '', no), document.createTextNode(a.ad));
      li.append(c);
      cipler.append(li);

      const bolum = el('section', 'adim');
      bolum.id = `adim-${i + 1}`;
      bolum.setAttribute('aria-labelledby', `adim-baslik-${i + 1}`);
      const yap = el('div', 'adim-yapiskan');
      const metin = el('div', 'adim-metin');
      const ust = el('span', 'ust-etiket', `${no} · ${a.ad}`);
      const h = el('h2', '', a.baslik);
      h.id = `adim-baslik-${i + 1}`;
      metin.append(ust, h, el('p', '', a.satir), o.izleDugmesi(s.izle || 'Bu adımı izle', a.tur, 'dugme dugme-ikincil izle-ac'));
      const gorsel = el('div', 'adim-gorsel');
      gorsel.setAttribute('aria-hidden', 'true');
      let f;
      if (a.telefon) {
        const tel = el('div', 'sohbet-telefon adim-telefon');
        gorsel.append(tel);
        const durum = window.NobetciTur.telefonKur(tel);
        const telefon = (p) => durum(p < 0.08 ? 0 : p < 0.2 ? 1 : p < 0.36 ? 2 : p < 0.48 ? 3 : p < 0.7 ? 4 : 5);
        f = telefon;
        // Telefon + gerçek ekran: önce telefon, sonra (ilerlemenin son kısmında) ekran kesiti; aynı yerde sırayla.
        if (a.kareler?.length) {
          gorsel.classList.add('cift');
          const ekran = el('div', 'adim-ekran');
          gorsel.append(ekran);
          const kesit = kesitKur(o, ekran, a.kareler, { dar: true });
          const ESIK = 0.55;
          f = (p) => {
            const ikinci = p >= ESIK;
            gorsel.classList.toggle('ikinci', ikinci);
            telefon(Math.min(1, p / ESIK));
            kesit(ikinci ? o.kisit((p - ESIK) / (1 - ESIK)) : 0);
          };
        }
      } else {
        f = kesitKur(o, gorsel, a.kareler || [], { dar: true });
      }
      yap.append(metin, gorsel);
      bolum.append(yap);
      kap.append(bolum);
      ogeler.push({ kok: bolum, f, son: -1 });
    });
    const ciplerA = [...cipler.querySelectorAll('a')];
    const ilerleme = $('#ilerleme');
    kaydirmaBagla(o, ogeler, (i, r, y) => {
      const etkin = r.top <= y * 0.5 && r.bottom > y * 0.5;
      if (etkin) ciplerA.forEach((c, j) => { if (j === i) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current'); });
      const k = kap.getBoundingClientRect();
      ilerleme.style.transform = `scaleX(${o.kisit(-k.top / Math.max(1, k.height - y))})`;
    });
  }

  // ------------------------------------------------------------------ küçük döngüler (Özellikler / Güvenlik)
  const MIKRO = {
    telefon(o) {
      const d = o.el('div', 'mikro mikro-telefon');
      const tel = o.el('div', 'sohbet-telefon');
      d.append(tel);
      const durum = window.NobetciTur.telefonKur(tel);
      let n = 0; let zaman = 0;
      durum(o.AZ_HAREKET ? 5 : 0);
      d._ac = () => { if (o.AZ_HAREKET) return; clearInterval(zaman); zaman = setInterval(() => { n = (n + 1) % 7; durum(Math.min(n, 5)); }, 1100); };
      d._kapat = () => clearInterval(zaman);
      return d;
    },
    ekip(o, k) {
      const d = o.el('div', 'mikro mikro-ekip');
      (k.ornek?.kisiler || k.kisiler || []).forEach(([ad, rol], i) => {
        const s = o.el('div', 'm-kisi');
        s.style.setProperty('--i', String(i));
        s.append(o.el('span', 'm-avatar', ad[0]), o.el('b', '', ad), o.el('span', `m-rol${rol === 'Admin' ? ' admin' : ''}`, rol));
        d.append(s);
      });
      const kilit = o.el('span', 'm-kasada');
      kilit.innerHTML = o.ikon('kilit');
      kilit.append(document.createTextNode('kasada şifreli'));
      d.append(kilit);
      return d;
    },
    yedek(o, k) {
      const d = o.el('div', 'mikro mikro-yedek');
      const dosya = o.el('div', 'm-dosya');
      dosya.innerHTML = `<svg viewBox="0 0 48 60" aria-hidden="true"><path d="M6 2h24l12 12v42a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="rgba(56,189,248,.08)" stroke="url(#kalkan-g)" stroke-width="2.4"/><path d="M30 2v12h12" fill="none" stroke="url(#kalkan-g)" stroke-width="2.4"/></svg><span class="m-kilit">${o.ikon('kilit')}</span>`;
      const ad = o.el('code', '', k.ornek?.dosya || k.dosya || 'yedek.tayedek');
      const cubuk = o.el('div', 'm-cubuk');
      cubuk.append(o.el('span'));
      const tamam = o.el('span', 'm-tamam', '✓ şifrelendi');
      d.append(dosya, ad, cubuk, tamam);
      return d;
    }
  };

  // ------------------------------------------------------------------ Özellikler
  function ozellikSayfasi(o) {
    const { ICERIK, el, $ } = o;
    const s = ICERIK.ozellikSayfa || {};
    const seritt = $('#sorun-listesi');
    (s.sorunlar || []).forEach((x, i) => {
      const li = el('li', 'gorun');
      li.style.transitionDelay = `${i * 0.08}s`;
      li.append(el('span', 'serit-sorun', x.sorun), el('span', 'serit-ok', '→'), el('span', 'serit-cozum', x.cozum));
      seritt.append(li);
    });
    const izgara = $('#ozellik-izgara');
    const kartlar = (s.kartlar || []).map((k, i) => {
      const kart = el('article', 'kart ozellik-kart2 gorun');
      kart.style.transitionDelay = `${(i % 4) * 0.05}s`;
      kart.style.viewTransitionName = `ozellik-${i}`;
      kart.id = `ozellik-${i + 1}`;
      const dugme = el('button', 'kart-dugme');
      dugme.type = 'button';
      dugme.setAttribute('aria-expanded', 'false');
      dugme.setAttribute('aria-controls', `ozellik-detay-${i + 1}`);
      const ik = el('span', 'ozellik-ikon');
      ik.innerHTML = o.ikon(k.ikon);
      const yazi = el('span', 'kart-yazi');
      yazi.append(el('span', 'kart-ad', k.ad), el('span', 'kart-satir', k.metin));
      dugme.append(ik, yazi, el('span', 'ac-isareti'));
      const detay = el('div', 'kart-detay');
      detay.id = `ozellik-detay-${i + 1}`;
      detay.hidden = true;
      kart.append(dugme, detay);
      izgara.append(kart);
      let kuruldu = false; let medya = null;
      const kur = () => {
        if (kuruldu) return; kuruldu = true;
        const sol = el('div', 'detay-metin');
        sol.append(el('h3', 'detay-baslik', s.neyiCozer || 'Neyi çözer'));
        const ul = el('ul', 'detay-maddeler');
        for (const m of k.maddeler || []) ul.append(el('li', '', m));
        const kapat = el('button', 'dugme-metin', s.kapat || 'Kapat');
        kapat.type = 'button';
        kapat.addEventListener('click', () => ac(null));
        const eylem = el('div', 'detay-eylem');
        eylem.append(o.izleDugmesi(s.izle || 'İzle', k.tur, 'dugme dugme-ikincil izle-ac'), kapat);
        sol.append(ul, eylem);
        const sag = el('div', 'detay-medya');
        sag.setAttribute('aria-hidden', 'true');
        if (k.medya?.mikro && MIKRO[k.medya.mikro]) { medya = MIKRO[k.medya.mikro](o, k); sag.append(medya); }
        else if (k.medya?.ekran) { const g = kesitKur(o, sag, [k.medya], { sabit: true, isiksiz: true, oran: 1, enCok: 1.9 }); requestAnimationFrame(() => g(1)); new ResizeObserver(() => g(1)).observe(sag); }
        detay.append(sol, sag);
      };
      return { kart, dugme, detay, kur, medyaAc: () => medya?._ac?.(), medyaKapat: () => medya?._kapat?.() };
    });
    let acik = null;
    function ac(hedef) {
      const uygula = () => {
        for (const x of kartlar) {
          const bu = x === hedef;
          if (bu) x.kur();
          x.kart.classList.toggle('acik', bu);
          x.detay.hidden = !bu;
          x.dugme.setAttribute('aria-expanded', String(bu));
          if (bu) x.medyaAc(); else x.medyaKapat();
        }
        acik = hedef;
      };
      if (document.startViewTransition && !o.AZ_HAREKET) document.startViewTransition(uygula).finished.then(() => hedef && hedef.kart.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
      else { uygula(); if (hedef) hedef.kart.scrollIntoView({ block: 'nearest' }); }
    }
    kartlar.forEach((x) => x.dugme.addEventListener('click', () => ac(acik === x ? null : x)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && acik && !document.querySelector('dialog[open]')) { const d = acik.dugme; ac(null); d.focus(); } });
    // Adresle doğrudan açma: ozellikler.html#ozellik-3
    const m = /^#ozellik-(\d+)$/.exec(location.hash);
    if (m && kartlar[Number(m[1]) - 1]) ac(kartlar[Number(m[1]) - 1]);
  }

  // ------------------------------------------------------------------ Güvenlik
  const GORSEL = {
    kasa(o, b) {
      const d = o.el('div', 'g-gorsel g-kasa');
      d.innerHTML = `<div class="g-kasa-merkez"><svg viewBox="0 0 120 140"><path class="kilit-kol" d="M34 64V44a26 26 0 0 1 52 0v20" fill="none" stroke="url(#kalkan-g)" stroke-width="9" stroke-linecap="round"/><rect x="16" y="62" width="88" height="70" rx="16" fill="rgba(56,189,248,.1)" stroke="url(#kalkan-g)" stroke-width="3"/><circle cx="60" cy="92" r="8" fill="#38bdf8"/><path d="M60 98v14" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/></svg><span class="g-aes">AES-256</span></div>`;
      (b.ogeler || []).forEach((x, i, l) => {
        const c = o.el('span', 'g-oge', x);
        const aci = (i / l.length) * Math.PI * 2 - Math.PI / 2;
        c.style.setProperty('--x', `${Math.cos(aci) * 150}px`);
        c.style.setProperty('--y', `${Math.sin(aci) * 120}px`);
        c.style.setProperty('--i', String(i));
        d.append(c);
      });
      const hex = o.el('code', 'g-hex', '');
      d.append(hex);
      let z = 0;
      const yaz = () => { hex.textContent = Array.from({ length: 32 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''); };
      yaz();
      d._ac = () => { if (o.AZ_HAREKET) return; clearInterval(z); z = setInterval(yaz, 120); };
      d._kapat = () => clearInterval(z);
      return d;
    },
    yerel(o, b) {
      const e = b.etiketler || {};
      const d = o.el('div', 'g-gorsel g-yerel');
      d.innerHTML = `<div class="g-kutu g-bilgisayar"><svg class="g-logo" aria-hidden="true"><use href="#kalkan"/></svg><b></b><span class="g-mini">${o.ikon('kilit')} kasa</span></div>
        <div class="g-hat"><i></i><i></i><i></i></div>
        <div class="g-kutu g-uygulama"><span class="g-uyg-ikon">${o.ikon('ekran')}</span><b></b><small>TEST</small></div>
        <div class="g-bulut"><svg viewBox="0 0 120 80"><path d="M32 68h58a20 20 0 0 0 2-39.9A28 28 0 0 0 38.5 22 23 23 0 0 0 32 68Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg><span class="g-capi">✕</span><small></small></div>`;
      d.querySelector('.g-bilgisayar b').textContent = e.bilgisayar || '';
      d.querySelector('.g-uygulama b').textContent = e.uygulama || '';
      d.querySelector('.g-bulut small').textContent = e.bulut || '';
      return d;
    },
    izinler(o, b) {
      const d = o.el('div', 'g-gorsel g-izinler');
      const satirlar = (b.izinler || []).map((ad) => {
        const s = o.el('div', 'g-izin');
        s.append(o.el('span', 'g-izin-ad', ad), o.el('span', 'g-durum', 'Kapalı'), o.el('span', 'g-anahtar'));
        d.append(s);
        return s;
      });
      const balon = o.el('span', 'g-balon', b.izinVer || 'İzin ver');
      d.append(balon);
      let z = 0; let n = 0;
      const adim = () => {
        satirlar.forEach((s) => { s.classList.remove('acik', 'soruyor'); s.querySelector('.g-durum').textContent = 'Kapalı'; });
        const s = satirlar[n % satirlar.length];
        n++;
        s.classList.add('soruyor');
        balon.style.top = `${s.offsetTop + s.offsetHeight / 2}px`;
        balon.classList.add('acik');
        setTimeout(() => { s.classList.remove('soruyor'); s.classList.add('acik'); s.querySelector('.g-durum').textContent = 'Açık'; balon.classList.remove('acik'); }, 1300);
      };
      d._ac = () => { if (o.AZ_HAREKET) return; clearInterval(z); adim(); z = setInterval(adim, 3400); };
      d._kapat = () => clearInterval(z);
      return d;
    },
    canli(o, b) {
      const p = b.pencere || {};
      const d = o.el('div', 'g-gorsel g-canli');
      d.innerHTML = `<div class="g-pencere"><div class="g-pencere-ust"><span class="g-canli-rozet">CANLI</span><b></b></div>
        <label class="g-kutu-satir"><span class="g-onay"></span><span class="g-onay-metin"></span></label>
        <div class="g-pencere-alt"><span class="g-vazgec">Vazgeç</span><span class="g-baslat"></span></div></div>`;
      d.querySelector('.g-pencere-ust b').textContent = p.baslik || '';
      d.querySelector('.g-onay-metin').textContent = p.kutu || '';
      d.querySelector('.g-baslat').textContent = p.dugme || '';
      return d;
    },
    maske(o, b) {
      const d = o.el('div', 'g-gorsel g-maske');
      const satirlar = (b.ornek || []).map(([ad, acik, gizli]) => {
        const s = o.el('div', 'g-maske-satir');
        const deger = o.el('code', '', acik);
        s.append(o.el('span', '', ad), deger);
        d.append(s);
        return { deger, acik, gizli };
      });
      const isin = o.el('span', 'g-maske-isin');
      d.append(isin);
      let z = 0; const zamanlar = [];
      const maskele = (gizle) => satirlar.forEach((x, i) => {
        const hedef = gizle ? x.gizli : x.acik; const kaynak = gizle ? x.acik : x.gizli;
        const n = Math.max(hedef.length, kaynak.length);
        for (let k = 0; k <= n; k++) zamanlar.push(setTimeout(() => { x.deger.textContent = hedef.slice(0, k) + kaynak.slice(k); }, i * 260 + k * 28));
      });
      const dongu = () => { d.classList.add('taraniyor'); maskele(true); zamanlar.push(setTimeout(() => d.classList.remove('taraniyor'), 1400)); zamanlar.push(setTimeout(() => maskele(false), 3600)); };
      if (o.AZ_HAREKET) satirlar.forEach((x) => { x.deger.textContent = x.gizli; });
      d._ac = () => { if (o.AZ_HAREKET) return; clearInterval(z); dongu(); z = setInterval(dongu, 5600); };
      d._kapat = () => { clearInterval(z); zamanlar.splice(0).forEach(clearTimeout); };
      return d;
    },
    yedek(o, b) { const d = MIKRO.yedek(o, b); d.classList.add('g-gorsel'); return d; },
    ekip(o, b) { const d = MIKRO.ekip(o, b); d.classList.add('g-gorsel'); return d; }
  };

  function guvenlikSayfasi(o) {
    const { ICERIK, el, $ } = o;
    const kap = $('#guvenlik-bloklari');
    (ICERIK.guvenlikSayfa?.bloklar || []).forEach((b, i) => {
      const blok = el('section', `g-blok${i % 2 ? ' ters' : ''}`);
      blok.id = b.id;
      blok.setAttribute('aria-labelledby', `g-${b.id}`);
      const metin = el('div', 'g-metin gorun');
      const h = el('h2', '', b.baslik);
      h.id = `g-${b.id}`;
      metin.append(el('span', 'g-no', String(i + 1).padStart(2, '0')), h, el('p', '', b.satir));
      const gorsel = GORSEL[b.id] ? GORSEL[b.id](o, b) : el('div');
      gorsel.setAttribute('aria-hidden', 'true');
      const sar = el('div', 'g-gorsel-kap gorun');
      sar.append(gorsel);
      blok.append(metin, sar);
      kap.append(blok);
      gorununce(blok, () => gorsel._ac?.(), () => gorsel._kapat?.());
    });
  }

  // ------------------------------------------------------------------ Yenilikler
  function yenilikSayfasi(o) {
    const { ICERIK, el, $ } = o;
    const liste = ICERIK.yenilikler?.liste || [];
    const cipler = $('#surum-cipleri');
    const cizgi = $('#zaman-cizgisi');
    const enYeni = liste.find((x) => !x.yakinda);
    liste.forEach((s) => {
      const a = el('a', `surum-cip${s === enYeni ? ' en-yeni' : ''}${s.yakinda ? ' yakinda' : ''}`, s.yakinda ? 'Yakında' : s.surum);
      a.href = `#${o.surumKimligi(s)}`;
      cipler.append(a);
      const li = el('li', `zaman-ogesi${s.yakinda ? ' yakinda' : ''}`);
      li.append(el('span', 'zaman-noktasi'), o.surumKarti(s));
      cizgi.append(li);
    });
  }

  // ------------------------------------------------------------------ İndir
  function indirSayfasi(o) {
    const { ICERIK, el, $ } = o;
    const s = ICERIK.indir || {};
    const sistem = o.isletimSistemi();
    const izgara = $('#indir-izgara');
    const durum = $('#indir-durum');
    const IKON = {
      mac: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-.8-3.1-.8C6.8 7.2 5.2 8.2 4.4 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.6-4.1zM14 5.5c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.7-1 2.8 1 .1 2.1-.5 2.7-1.3z" fill="currentColor"/></svg>',
      windows: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5 10.5 4.4v7.1H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7.1L3 18.5zM11.5 12.5H21V21l-9.5-1.3z" fill="currentColor"/></svg>'
    };
    // Kart: simge + ad (+ "Bu bilgisayar"), düğme ya da "Yakında", tek satır gereksinim. Kurulum adımları indirilen dosyada.
    const kartlar = {};
    for (const anahtar of sistem === 'mac' ? ['mac', 'windows'] : ['windows', 'mac']) {
      const kart = el('article', `kart indir-kart gorun${anahtar === sistem ? ' sizin' : ''}`);
      const bas = el('div', 'indir-kart-bas');
      const ik = el('span', 'indir-os');
      ik.innerHTML = IKON[anahtar];
      const ad = el('div', 'indir-ad');
      ad.append(el('h2', '', s.sistemler?.[anahtar] || anahtar));
      if (anahtar === sistem) ad.append(el('span', 'sizin-rozet', s.buBilgisayar || 'Bu bilgisayar'));
      bas.append(ik, ad);
      const eylem = el('div', 'indir-eylem');
      eylem.append(el('span', 'dugme-yukleniyor', '…'));
      const not = el('p', 'indir-not', anahtar === 'mac' ? s.dosyalar?.macArm?.not : s.dosyalar?.windows?.not);
      kart.append(bas, eylem, not);
      izgara.append(kart);
      kartlar[anahtar] = { eylem, not };
    }
    const alt = $('.indir-ilk');
    if (alt && s.kurulumNotu) alt.textContent = `${s.kurulumNotu} ${s.ilkAcilis || ''}`.trim();
    o.sonSurum().then((veri) => {
      if (!veri || !Object.keys(veri.varliklar).length) {
        durum.textContent = s.yakinda || 'İlk sürüm yakında';
        durum.className = 'indir-durum yakinda';
        for (const x of Object.values(kartlar)) x.eylem.replaceChildren(el('span', 'dugme-yakinda', 'Yakında'));
        return;
      }
      durum.className = 'indir-durum';
      const a = el('a', 'surum-cip en-yeni', `${s.sonSurum || 'Son sürüm'}: ${veri.etiket}${veri.tarih ? ` · ${veri.tarih}` : ''}`);
      a.href = 'yenilikler.html';
      durum.replaceChildren(a);
      const uret = o.indirKutusu(veri, 'sayfa');
      for (const [anahtar, x] of Object.entries(kartlar)) {
        const d = uret[anahtar]();
        x.eylem.replaceChildren(d ? d.dugme : el('span', 'dugme-yakinda', 'Yakında'));
        if (d) x.not.replaceWith(d.not);
      }
    });
  }

  window.NobetciSayfa = function (o) {
    const sayfa = document.body.dataset.sayfa;
    if (sayfa === 'nasil') nasilSayfasi(o);
    else if (sayfa === 'ozellikler') ozellikSayfasi(o);
    else if (sayfa === 'guvenlik') guvenlikSayfasi(o);
    else if (sayfa === 'yenilikler') yenilikSayfasi(o);
    else if (sayfa === 'indir') indirSayfasi(o);
  };
})();
