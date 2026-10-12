// NÖBETÇİ TANITIM SİTESİ — metinleri icerik.js'ten yerleştirir; kahraman döngüsü, kaydırmalı sahneler ve küçük etkileşimler.
(function () {
  'use strict';

  const ICERIK = window.ICERIK || {};
  const AZ_HAREKET = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INCE_ISARETCI = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, k = document) => k.querySelector(s);
  const $$ = (s, k = document) => [...k.querySelectorAll(s)];
  const kisit = (d, a = 0, b = 1) => Math.min(b, Math.max(a, d));
  const harita = (p, a, b) => kisit((p - a) / (b - a));
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const yol = (nesne, anahtar) => anahtar.split('.').reduce((o, k) => (o == null ? undefined : o[k]), nesne);
  const el = (etiket, sinif, metin) => { const e = document.createElement(etiket); if (sinif) e.className = sinif; if (metin != null) e.textContent = metin; return e; };

  // ------------------------------------------------------------------ metinler
  function metinleriYerlestir() {
    for (const e of $$('[data-metin]')) {
      const d = yol(ICERIK, e.dataset.metin);
      if (typeof d === 'string') e.textContent = d;
    }
    // Başlık sözcük sözcük belirir.
    const h1 = $('#kahraman-baslik');
    if (h1 && !AZ_HAREKET) {
      const sozcukler = h1.textContent.trim().split(/\s+/);
      h1.textContent = '';
      sozcukler.forEach((s, i) => {
        const k = el('span', 'kelime', s);
        k.style.animationDelay = `${0.12 + i * 0.08}s`;
        h1.append(k, document.createTextNode(i < sozcukler.length - 1 ? ' ' : ''));
      });
      h1.setAttribute('aria-label', sozcukler.join(' '));
    }
  }

  // ------------------------------------------------------------------ ortak kabuk: üst çubuk, menü, alt bilgi, tur penceresi
  const OYNAT_SVG = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
  function kabukKur() {
    const sayfa = document.body.dataset.sayfa || 'ana';
    const ust = $('#ust');
    if (ust && !ust.children.length) {
      ust.innerHTML = `<div class="ust-ic">
        <a class="marka" href="index.html" aria-label="Nöbetçi ana sayfa"><svg class="marka-logo" aria-hidden="true"><use href="#kalkan"/></svg><span></span></a>
        <nav class="ana-menu" id="ana-menu" aria-label="Ana menü"><ul class="menu"></ul></nav>
        <button class="dugme dugme-kucuk izle-ac" type="button" data-manyetik><span>İzle</span> <span class="oynat-ikon" aria-hidden="true">▶</span></button>
        <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="ana-menu" aria-label="Menüyü aç"><span></span><span></span></button>
      </div>`;
      $('.marka span', ust).textContent = ICERIK.marka?.ad || 'Nöbetçi';
      const ul = $('.menu', ust);
      for (const m of ICERIK.menu || []) {
        const li = el('li');
        const a = el('a', '', m.ad);
        a.href = m.adres;
        if (m.sayfa === sayfa) a.setAttribute('aria-current', 'page');
        li.append(a);
        ul.append(li);
      }
      const menuDugme = $('.menu-dugme', ust);
      const menuKapat = () => { ust.classList.remove('menu-acik'); menuDugme.setAttribute('aria-expanded', 'false'); menuDugme.setAttribute('aria-label', 'Menüyü aç'); };
      menuDugme.addEventListener('click', () => {
        const acik = ust.classList.toggle('menu-acik');
        menuDugme.setAttribute('aria-expanded', String(acik));
        menuDugme.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
        if (acik) $('a', ul)?.focus();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ust.classList.contains('menu-acik')) { menuKapat(); menuDugme.focus(); } });
      ul.addEventListener('click', menuKapat);
    }
    const alt = $('#alt');
    if (alt && !alt.children.length) {
      alt.innerHTML = `<div class="alt-ic">
        <a class="marka" href="index.html"><svg class="marka-logo" aria-hidden="true"><use href="#kalkan"/></svg><span></span></a>
        <nav class="alt-menu" aria-label="Alt menü"><ul></ul></nav>
        <p class="alt-not"></p>
        <a class="surum-isareti" href="yenilikler.html"></a>
      </div>`;
      $('.marka span', alt).textContent = ICERIK.marka?.ad || 'Nöbetçi';
      for (const m of ICERIK.menu || []) { const li = el('li'); const a = el('a', '', m.ad); a.href = m.adres; li.append(a); $('ul', alt).append(li); }
      $('.alt-not', alt).textContent = ICERIK.altbilgi?.not || '';
      $('.surum-isareti', alt).textContent = `Sürüm ${ICERIK.surum} · ${ICERIK.tarih}`;
    }
    if (!$('#tur-pencere')) {
      document.body.insertAdjacentHTML('beforeend', `<dialog class="tur-pencere" id="tur-pencere" aria-labelledby="tur-baslik">
    <div class="oynatici" id="oynatici">
      <div class="oynatici-ust">
        <h2 id="tur-baslik" class="tur-baslik"></h2>
        <span class="tur-bolum-adi" id="tur-bolum-adi" aria-live="polite"></span>
        <div class="oynatici-sag">
          <button class="ikon-dugme" type="button" id="tur-genislet" aria-label="Tam ekran"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
          <button class="ikon-dugme" type="button" id="tur-kapat" aria-label="Kapat"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        </div>
      </div>
      <div class="oynatici-govde">
        <div class="tur-sahne" id="tur-sahne"></div>
        <ol class="bolum-listesi" id="bolum-listesi" aria-label="Bölümler"></ol>
      </div>
      <div class="denetimler">
        <button class="ikon-dugme oynat-dugme" type="button" id="tur-oynat" aria-label="Duraklat"></button>
        <div class="zaman-cubugu" id="zaman-cubugu" role="slider" tabindex="0" aria-label="Tur ilerlemesi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="zaman-dolu" id="zaman-dolu"></div>
          <div class="zaman-isaretleri" id="zaman-isaretleri"></div>
        </div>
        <span class="zaman-metni" id="zaman-metni">0:00</span>
      </div>
    </div>
  </dialog>`);
    }
  }

  /** "İzle ▶" düğmesi (sayfalar ortak): bolum verilirse tur o bölümden başlar. */
  function izleDugmesi(metin, bolum, sinif = 'dugme dugme-ana izle-ac') {
    const d = el('button', sinif);
    d.type = 'button';
    d.dataset.manyetik = '';
    if (bolum != null) d.dataset.bolum = String(bolum);
    d.append(el('span', '', metin));
    const o = el('span', 'oynat-daire');
    o.setAttribute('aria-hidden', 'true');
    o.innerHTML = OYNAT_SVG;
    d.append(o);
    return d;
  }

  // ------------------------------------------------------------------ sayfa geçişleri
  // Destekleyen tarayıcıda belgeler arası View Transitions (CSS: @view-transition). Desteklemeyende kısa bir solma.
  function gecislerKur() {
    const belgelerArasi = 'onpagereveal' in window;
    if (belgelerArasi || AZ_HAREKET) return;
    document.documentElement.classList.add('gecis-giris');
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname) || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      document.documentElement.classList.add('gecis-cikis');
      setTimeout(() => { location.href = url.href; }, 180);
    });
    addEventListener('pageshow', () => document.documentElement.classList.remove('gecis-cikis'));
  }

  // ------------------------------------------------------------------ detay bölümleri
  const IKONLAR = {
    ekran: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    servis: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
    veri: '<ellipse cx="12" cy="5.5" rx="8" ry="2.5"/><path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/>',
    tarama: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
    saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pano: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    telefon: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    rapor: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    zil: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    ekip: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
    yedek: '<path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z"/><path d="M4 7v10c0 1.7 3.6 3 8 3M20 7v4"/><rect x="14" y="14" width="7" height="6" rx="1.2"/><path d="M15.5 14v-1.5a2 2 0 0 1 4 0V14"/>',
    kilit: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'
  };
  const ikon = (ad) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IKONLAR[ad] || ''}</svg>`;

  /** Sürüm kartı (ana sayfa ve Yenilikler sayfası ortak). */
  const surumKimligi = (s) => `surum-${String(s.surum).toLocaleLowerCase('tr').replace(/[^a-z0-9.]+/g, '-')}`;
  /** Yayımlanmış ilk (en yeni) sürüm "yeni" rozeti alır; yakinda: true olan kayıt "Yakında" rozeti alır. */
  const enYeniYayimlanan = () => (ICERIK.yenilikler?.liste || []).find((x) => !x.yakinda);
  function surumKarti(s) {
    const k = el('article', `kart surum-kart gorun${s.yakinda ? ' yakinda' : ''}`);
    k.id = surumKimligi(s);
    const no = el('div', 'surum-no');
    no.append(document.createTextNode(s.yakinda ? 'Hazırlanıyor' : 'Sürüm'), el('b', '', s.surum));
    if (!s.yakinda && s.tarih) no.append(el('time', '', s.tarih));
    if (s.yakinda) no.querySelector('b').append(el('span', 'rozet rozet-sari yeni-rozet', 'Yakında'));
    else if (s === enYeniYayimlanan()) no.querySelector('b').append(el('span', 'rozet rozet-mavi yeni-rozet', ICERIK.yenilikSayfa?.yeni || 'yeni'));
    const ul = el('ul');
    for (const m of s.maddeler) ul.append(el('li', '', m));
    k.append(no, ul);
    return k;
  }

  function detaylariYerlestir() {
    const sorun = $('#sorun-izgara');
    if (sorun) (ICERIK.sorunlar?.liste || []).forEach((s, i) => {
      const k = el('article', 'kart sorun-kart gorun');
      k.style.transitionDelay = `${i * 0.08}s`;
      k.append(el('p', 'sorun', s.sorun), el('div', 'ok'), el('p', 'cozum', s.cozum));
      sorun.append(k);
    });
    const surec = $('#surec');
    if (surec) (ICERIK.nasil?.adimlar || []).forEach((a, i) => {
      const li = el('li', 'gorun');
      li.style.transitionDelay = `${i * 0.08}s`;
      li.append(el('h3', '', a.ad), el('p', '', a.metin));
      surec.append(li);
    });
    const sayac = $('#sayaclar');
    if (sayac) (ICERIK.ozellikler?.sayaclar || []).forEach((s) => {
      const d = el('div', 'gorun');
      const dd = el('dd', '', `${s.deger}${s.son}`);
      dd.dataset.sayac = String(s.deger);
      dd.dataset.son = s.son;
      d.append(dd, el('dt', '', s.etiket));
      sayac.append(d);
    });
    const kartlar = $('#ozellik-kartlari');
    if (kartlar) (ICERIK.ozellikler?.kartlar || []).forEach((o, i) => {
      const k = el('article', 'kart ozellik-kart gorun');
      k.style.transitionDelay = `${(i % 3) * 0.06}s`;
      const ik = el('span', 'ozellik-ikon');
      ik.innerHTML = ikon(o.ikon);
      k.append(ik, el('h3', '', o.ad), el('p', '', o.metin));
      kartlar.append(k);
    });
    const guv = $('#guvenlik-listesi');
    if (guv) (ICERIK.guvenlik?.maddeler || []).forEach((m, i) => {
      const li = el('li', 'kart gorun');
      li.style.transitionDelay = `${i * 0.06}s`;
      li.append(el('h3', '', m.ad), el('p', '', m.metin));
      guv.append(li);
    });
    const surumler = $('#surum-listesi');
    if (surumler) (ICERIK.yenilikler?.liste || []).slice(0, 2).forEach((s) => surumler.append(surumKarti(s)));
    const maddeler = $('#kasa-maddeler');
    if (maddeler) for (const m of ICERIK.sahneler?.[4]?.maddeler || []) maddeler.append(el('li', '', m));
    // Ana sayfa bölümlerinden sayfalara "Ayrıntılar →" bağlantısı
    for (const b of $$('[data-devami]')) {
      const a = el('a', 'devami', `${ICERIK.devami || 'Ayrıntılar'} →`);
      a.href = b.dataset.devami;
      b.append(a);
    }
  }

  // ------------------------------------------------------------------ kahraman: canlı mini arayüz döngüsü
  async function kahramanDongusu() {
    const k = ICERIK.kahraman || {};
    const b = k.bildirimler || {};
    if (!$('#canli-adimlar')) return;
    $('#canli-kosu-adi').textContent = k.kosuAdi || '';
    const liste = $('#canli-adimlar');
    const satirlar = (k.adimlar || []).map((a, i) => {
      const li = el('li', '', a);
      const sure = el('span', 'sure', `${(1.4 + ((i * 7) % 5) * 0.6).toFixed(1)} sn`);
      li.append(sure);
      liste.append(li);
      return li;
    });
    const kart = $('.kosu-kart');
    const cubuk = $('#canli-cubuk');
    const yuzde = $('#canli-yuzde');
    const bildirim = $('#canli-bildirim');
    const bMetin = $('#canli-bildirim-metin');
    const bAyrinti = $('#canli-bildirim-ayrinti');
    const tekrar = $('#canli-tekrar');
    const kalan = k.kalanAdim ?? -1;
    const n = satirlar.length;
    const ilerle = (x) => { cubuk.style.width = `${x * 100}%`; yuzde.textContent = `%${Math.round(x * 100)}`; };
    const kahraman = $('#kahraman');
    let gorunur = true;
    new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; }).observe(kahraman);
    const sira = async (ms) => { await bekle(ms); while (!gorunur || document.hidden) await bekle(300); };

    for (;;) {
      satirlar.forEach((s) => { s.className = ''; });
      kart.classList.remove('bitti', 'kaldi');
      bildirim.classList.remove('acik');
      ilerle(0);
      await sira(700);
      for (let i = 0; i < n; i++) {
        satirlar[i].className = 'kosuyor';
        await sira(620);
        satirlar[i].className = i === kalan ? 'kaldi' : 'gecti';
        ilerle((i + 1) / n);
        await sira(140);
      }
      kart.classList.add('bitti', 'kaldi');
      await sira(500);
      bMetin.textContent = b.kaldi; bAyrinti.textContent = b.kaldiAyrinti;
      tekrar.textContent = b.tekrar; tekrar.className = 'bildirim-dugme';
      bildirim.classList.add('acik');
      await sira(1700);
      tekrar.classList.add('basildi');
      dalgaEkle(tekrar, tekrar.clientWidth / 2, tekrar.clientHeight / 2);
      await sira(450);
      tekrar.classList.add('gizli');
      bMetin.textContent = b.kosuyor; bAyrinti.textContent = satirlar[kalan] ? satirlar[kalan].firstChild.textContent : '';
      if (satirlar[kalan]) satirlar[kalan].className = 'kosuyor';
      kart.classList.remove('bitti');
      await sira(1300);
      if (satirlar[kalan]) satirlar[kalan].className = 'gecti';
      kart.classList.remove('kaldi'); kart.classList.add('bitti');
      bMetin.textContent = b.gecti; bAyrinti.textContent = b.gectiAyrinti;
      await sira(2800);
      bildirim.classList.remove('acik');
      await sira(700);
    }
  }

  // ------------------------------------------------------------------ kaydırmalı sahneler
  const sahneler = {
    tarama(kok) {
      const yeni = $('.alan-yeni', kok); const etiket = $('.alan-etiket', kok);
      const govde = $('.form-govde', kok); const ozet = $('.fark-ozeti', kok); const cipler = $$('.fark-cip', kok);
      return (p) => {
        yeni.classList.toggle('acik', p > 0.12);
        etiket.classList.toggle('degisti', p > 0.2);
        const isin = harita(p, 0.3, 0.74);
        govde.style.setProperty('--isin', String(-0.05 + isin * 1.1));
        govde.style.setProperty('--isin-op', p > 0.28 && p < 0.78 ? '1' : '0');
        etiket.classList.toggle('isaretli', p > 0.5);
        yeni.classList.toggle('isaretli', p > 0.58);
        ozet.classList.toggle('acik', p > 0.7);
        cipler.forEach((c, i) => c.classList.toggle('acik', p > 0.74 + i * 0.05));
      };
    },
    kodsuz(kok) {
      const pencere = $('.giris-pencere', kok); const imlec = $('#k-imlec', kok);
      const kul = $('#k-kullanici', kok); const par = $('#k-parola', kok); const dugme = $('.giris-dugme', kok);
      const tarif = $('.tarif-kart', kok); const maddeler = $$('li', tarif);
      const KUL = 'demo.kullanici';
      let basildi = false;
      const merkez = (e) => { const a = pencere.getBoundingClientRect(); const b = e.getBoundingClientRect(); return [b.left - a.left + Math.min(40, b.width / 2), b.top - a.top + b.height / 2]; };
      return (p) => {
        const w = pencere.clientWidth; const h = pencere.clientHeight;
        const bas = [w * 0.9, h * 1.05];
        const k1 = merkez(kul); const k2 = merkez(par); const k3 = merkez(dugme);
        const nok = [[0, bas], [0.14, k1], [0.34, k1], [0.42, k2], [0.52, k2], [0.6, k3], [1, k3]];
        let x = bas[0]; let y = bas[1];
        for (let i = 0; i < nok.length - 1; i++) {
          const [pa, a] = nok[i]; const [pb, b] = nok[i + 1];
          if (p >= pa && p <= pb) { const t = pb === pa ? 1 : (p - pa) / (pb - pa); const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; x = a[0] + (b[0] - a[0]) * e; y = a[1] + (b[1] - a[1]) * e; }
        }
        if (p > 0.6) { x = k3[0]; y = k3[1]; }
        imlec.style.setProperty('--ix', `${x}px`);
        imlec.style.setProperty('--iy', `${y}px`);
        $('.yazi', kul).textContent = KUL.slice(0, Math.round(harita(p, 0.16, 0.33) * KUL.length));
        $('.yazi', par).textContent = '•'.repeat(Math.round(harita(p, 0.43, 0.51) * 10));
        kul.classList.toggle('odak', p > 0.14 && p < 0.38);
        par.classList.toggle('odak', p > 0.42 && p < 0.56);
        const bas2 = p > 0.6 && p < 0.66;
        if (bas2 && !basildi) { dugme.classList.remove('basildi'); void dugme.offsetWidth; dugme.classList.add('basildi'); }
        if (!bas2) dugme.classList.remove('basildi');
        basildi = bas2;
        const esikler = [0.16, 0.3, 0.47, 0.64, 0.72];
        maddeler.forEach((m, i) => m.classList.toggle('acik', p > esikler[i]));
        tarif.classList.toggle('tamam', p > 0.72);
      };
    },
    gece(kok) {
      const saat = $('#g-saat', kok); const kadran = $('.kadran', kok);
      const planlar = $$('.plan-listesi li', kok); const sabah = $('.sabah-kart', kok);
      const cubuklar = $('#g-cubuklar', kok);
      const VERI = [[1, 0], [1, 0], [0.92, 0.08], [1, 0], [0.92, 0.08], [0.92, 0.08], [1, 0], [0.92, 0.08], [1, 0], [1, 0], [0.84, 0.16], [0.92, 0.08], [1, 0], [0.97, 0.03]];
      const c = VERI.map(([y, k], i) => { const s = el('span'); s.style.height = `${y * 100}%`; s.style.setProperty('--k', `${(k / y) * 100}%`); if (i === VERI.length - 1) s.classList.add('son'); cubuklar.append(s); return s; });
      return (p) => {
        const dk = 23 * 60 + p * 480;
        const sa = Math.floor(dk / 60) % 24; const d = Math.floor(dk % 60);
        saat.textContent = `${String(sa).padStart(2, '0')}:${String(d).padStart(2, '0')}`;
        kadran.style.setProperty('--akrep', `${(dk / 60) * 30}deg`);
        kadran.style.setProperty('--yelkovan', `${dk * 6}deg`);
        planlar.forEach((l, i) => {
          const a = 0.5 + i * 0.06;
          l.classList.toggle('kosuyor', p > a && p <= a + 0.06);
          l.classList.toggle('bitti', p > a + 0.06);
        });
        c.forEach((s, i) => s.style.setProperty('--b', String(harita(p, 0.5 + i * 0.016, 0.56 + i * 0.016))));
        sabah.classList.toggle('acik', p > 0.8);
      };
    },
    cep(kok) {
      const durum = window.NobetciTur.telefonKur($('#cep-telefon', kok));
      return (p) => durum(p < 0.1 ? 0 : p < 0.2 ? 1 : p < 0.34 ? 2 : p < 0.44 ? 3 : p < 0.68 ? 4 : 5);
    },
    kasa(kok) {
      const gorsel = $('.kasa-gorsel', kok); const maddeler = () => $$('#kasa-maddeler li');
      return (p) => {
        gorsel.style.setProperty('--kilit', String(harita(p, 0.12, 0.26)));
        gorsel.style.setProperty('--carpi', String(harita(p, 0.26, 0.36)));
        gorsel.style.setProperty('--bulut', String(harita(p, 0.38, 0.64)));
        maddeler().forEach((m, i) => m.classList.toggle('acik', p > 0.55 + i * 0.09));
      };
    }
  };

  function hikayeKur() {
    const kutular = $$('.sahne');
    const ray = $('#hikaye-ray');
    if (!kutular.length || !ray) return;
    const isleyiciler = kutular.map((kok, i) => {
      const ad = kok.dataset.sahne;
      const a = el('a');
      a.href = `#s-${ad}`;
      a.setAttribute('aria-label', ICERIK.sahneler?.[i]?.baslik || ad);
      a.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: kok.getBoundingClientRect().top + scrollY + (kok.offsetHeight - innerHeight) * 0.75, behavior: AZ_HAREKET ? 'auto' : 'smooth' }); });
      ray.append(a);
      return { kok, f: sahneler[ad] ? sahneler[ad](kok) : () => {}, metin: $('.sahne-metin', kok), son: -1 };
    });
    const noktalar = $$('a', ray);
    if (AZ_HAREKET) { isleyiciler.forEach((s) => s.f(1)); return; }
    const hikaye = $('#hikaye');
    let istek = 0;
    const guncelle = () => {
      istek = 0;
      const y = innerHeight;
      isleyiciler.forEach((s, i) => {
        const r = s.kok.getBoundingClientRect();
        noktalar[i].classList.toggle('etkin', r.top <= y * 0.5 && r.bottom > y * 0.5);
        if (r.bottom < -y || r.top > y * 2) return;
        const p = kisit(-r.top / Math.max(1, r.height - y));
        s.metin.style.setProperty('--giris', String(kisit((y - r.top) / (y * 0.6))));
        if (Math.abs(p - s.son) > 0.0005) { s.son = p; s.f(p); }
      });
      const h = hikaye.getBoundingClientRect();
      ray.classList.toggle('acik', h.top < y * 0.5 && h.bottom > y * 0.5);
    };
    const iste = () => { if (!istek) istek = requestAnimationFrame(guncelle); };
    addEventListener('scroll', iste, { passive: true });
    addEventListener('resize', iste);
    guncelle();
  }

  // ------------------------------------------------------------------ küçük etkileşimler
  function dalgaEkle(hedef, x, y) {
    const d = el('span', 'dalga-izi');
    const boy = Math.max(hedef.clientWidth, hedef.clientHeight) * 2.2;
    Object.assign(d.style, { width: `${boy}px`, height: `${boy}px`, left: `${x - boy / 2}px`, top: `${y - boy / 2}px` });
    hedef.append(d);
    setTimeout(() => d.remove(), 700);
  }

  function etkilesimler() {
    // tıklama dalgası
    document.addEventListener('pointerdown', (e) => {
      const d = e.target.closest('.dugme');
      if (!d) return;
      const r = d.getBoundingClientRect();
      dalgaEkle(d, e.clientX - r.left, e.clientY - r.top);
    });
    // üst çubuk
    const ust = $('#ust');
    const ustGuncelle = () => ust.classList.toggle('dolu', scrollY > 20);
    addEventListener('scroll', ustGuncelle, { passive: true });
    ustGuncelle();
    // İzle
    document.addEventListener('click', (e) => {
      const d = e.target.closest('.izle-ac');
      if (!d) return;
      e.preventDefault();
      window.NobetciTur.oynaticiAc(d, d.dataset.bolum != null ? Number(d.dataset.bolum) : null);
    });
    // görünme
    const io = new IntersectionObserver((girdiler) => {
      for (const g of girdiler) if (g.isIntersecting) { g.target.classList.add('gorundu'); io.unobserve(g.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    $$('.gorun').forEach((e) => io.observe(e));
    // sayaçlar
    const sayacIo = new IntersectionObserver((girdiler) => {
      for (const g of girdiler) {
        if (!g.isIntersecting) continue;
        sayacIo.unobserve(g.target);
        const hedef = Number(g.target.dataset.sayac); const son = g.target.dataset.son || '';
        if (AZ_HAREKET || hedef === 0) { g.target.textContent = `${hedef}${son}`; continue; }
        const bas = performance.now(); const sure = 1400;
        const adim = (z) => { const x = kisit((z - bas) / sure); const e = 1 - Math.pow(1 - x, 4); g.target.textContent = `${Math.round(hedef * e)}${son}`; if (x < 1) requestAnimationFrame(adim); };
        g.target.textContent = `0${son}`;
        requestAnimationFrame(adim);
      }
    }, { threshold: 0.6 });
    $$('[data-sayac]').forEach((e) => sayacIo.observe(e));
    // süreç çizgisi
    const surec = $('#surec');
    if (surec) new IntersectionObserver(([g], o) => {
      if (!g.isIntersecting) return; o.disconnect();
      if (AZ_HAREKET) { surec.style.setProperty('--surec', '100%'); return; }
      const bas = performance.now();
      const adim = (z) => { const x = kisit((z - bas) / 1600); surec.style.setProperty('--surec', `${x * 100}%`); if (x < 1) requestAnimationFrame(adim); };
      requestAnimationFrame(adim);
    }, { threshold: 0.4 }).observe(surec);

    if (AZ_HAREKET || !INCE_ISARETCI) return;
    // imleç ışığı (kahraman)
    for (const isik of $$('.imlec-isigi')) {
      const kap = isik.parentElement;
      kap.addEventListener('pointermove', (e) => {
        const r = kap.getBoundingClientRect();
        isik.style.setProperty('--x', `${e.clientX - r.left}px`);
        isik.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    }
    // mıknatıslı düğmeler
    for (const d of $$('[data-manyetik]')) {
      d.addEventListener('pointermove', (e) => {
        const r = d.getBoundingClientRect();
        d.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
        d.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
      });
      d.addEventListener('pointerleave', () => { d.style.setProperty('--mx', '0px'); d.style.setProperty('--my', '0px'); });
    }
    // eğilen kartlar ve pencereler
    const egik = (e, guc) => {
      e.addEventListener('pointermove', (o) => {
        const r = e.getBoundingClientRect();
        const x = (o.clientX - r.left) / r.width; const y = (o.clientY - r.top) / r.height;
        e.style.setProperty('--ry', `${(x - 0.5) * guc}deg`);
        e.style.setProperty('--rx', `${(0.5 - y) * guc}deg`);
        e.style.setProperty('--gx', `${x * 100}%`);
        e.style.setProperty('--gy', `${y * 100}%`);
      });
      e.addEventListener('pointerleave', () => { e.style.setProperty('--rx', '0deg'); e.style.setProperty('--ry', '0deg'); });
    };
    $$('.kart').forEach((k) => egik(k, 7));
    $$('[data-egik]').forEach((k) => egik(k, 5));
  }

  // ------------------------------------------------------------------ ana sayfa tanıtım döngüsü (kısa tur)
  function tanitimKur() {
    const kap = $('#tanitim-sahne'); const cerceve = $('#tanitim-cerceve');
    if (!kap) return;
    cerceve.addEventListener('click', () => window.NobetciTur.oynaticiAc(cerceve));
    let tur = null;
    new IntersectionObserver(([g]) => {
      if (g.isIntersecting) {
        if (!tur) tur = new window.NobetciTur.Tur(kap, { kisa: true, secim: ICERIK.tur?.tanitim });
        if (AZ_HAREKET) tur.git(2.6); else tur.oynat();
      } else if (tur) tur.duraklat();
    }, { rootMargin: '200px 0px', threshold: 0.01 }).observe(kap);
  }

  // ------------------------------------------------------------------ son sürüm ve indirme (GitHub'dan canlı)
  // Tek istek: depo sürüm listesi (yayımlanmış sürüm yoksa 404 değil boş liste döner; konsolda hata çıkmaz). Sonuç bu
  // sekmede 1 saat saklanır (sessionStorage). Ağ yok / sınır aşıldı / sürüm yok → null: icerik.js'teki sürüm yazısı kalır,
  // indirme düğmeleri gizli ("İlk sürüm yakında"). Kişisel veri gönderilmez.
  const SURUM_ANAHTARI = 'nobetci.sonSurum.v1';
  const SURUM_OMRU = 60 * 60 * 1000;
  let surumSozu = null;
  function sonSurum() {
    if (surumSozu) return surumSozu;
    surumSozu = (async () => {
      try {
        const k = JSON.parse(sessionStorage.getItem(SURUM_ANAHTARI) || 'null');
        if (k && Date.now() - k.t < (k.v ? SURUM_OMRU : SURUM_OMRU / 6)) return k.v; // alınamadıysa 10 dk sonra yeniden denenir
      } catch { /* depolama yok */ }
      let veri = null;
      try {
        const kes = new AbortController();
        const zaman = setTimeout(() => kes.abort(), 8000);
        const y = await fetch(`https://api.github.com/repos/${ICERIK.indir?.depo}/releases?per_page=10`, {
          headers: { Accept: 'application/vnd.github+json' }, signal: kes.signal, credentials: 'omit', referrerPolicy: 'no-referrer'
        });
        clearTimeout(zaman);
        if (y.ok) {
          const liste = await y.json();
          const r = Array.isArray(liste) ? liste.find((x) => x && !x.draft && !x.prerelease) : null;
          if (r) {
            const varliklar = {};
            for (const a of r.assets || []) if (a && a.name) varliklar[a.name] = `https://github.com/${ICERIK.indir.depo}/releases/latest/download/${encodeURIComponent(a.name)}`;
            const d = new Date(r.published_at || r.created_at);
            veri = { etiket: String(r.tag_name || r.name || ''), tarih: isNaN(d) ? '' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }), varliklar };
          }
        }
      } catch { veri = null; }
      try { sessionStorage.setItem(SURUM_ANAHTARI, JSON.stringify({ t: Date.now(), v: veri })); } catch { /* depolama yok */ }
      return veri;
    })();
    return surumSozu;
  }

  /** 'windows' | 'mac' | 'diger' (telefon / tablet / Linux). Mac'te Apple Silicon / Intel ayrımı güvenilir değildir: Apple Silicon varsayılır. */
  function isletimSistemi() {
    const ua = navigator.userAgent || '';
    const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    if (/android|iphone|ipad|ipod/i.test(ua) || navigator.userAgentData?.mobile) return 'diger';
    if (/win/i.test(p) || /windows/i.test(ua)) return 'windows';
    if (/mac/i.test(p) || /mac os x/i.test(ua)) return navigator.maxTouchPoints > 1 ? 'diger' : 'mac';
    return 'diger';
  }

  const INDIR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /**
   * İndirme düğmeleri. kip: 'kahraman' (yalnız bu bilgisayarın düğmesi + "Diğer sistemler") ya da 'sayfa' (sistem başına).
   * Varlığı sürümde bulunmayan dosyanın düğmesi gösterilmez. Mac: Apple Silicon varsayılır; Intel için küçük bağlantı (sayfada).
   * 'sayfa' kipi { windows(), mac() } döner; her biri { dugme, not } (not: tek satır gereksinim) ya da null.
   */
  function indirKutusu(veri, kip, sistem = isletimSistemi()) {
    const d = ICERIK.indir?.dosyalar || {};
    const url = (x) => (x && veri?.varliklar?.[x.ad]) || null;
    const dugme = (x) => {
      const a = el('a', 'dugme dugme-indir');
      a.href = url(x);
      a.setAttribute('download', '');
      a.innerHTML = INDIR_SVG;
      a.append(el('span', '', x.dugme));
      return a;
    };
    const mac = () => {
      const arm = url(d.macArm); const intel = url(d.macIntel);
      if (!arm && !intel) return null;
      const ana = arm ? d.macArm : d.macIntel;
      const not = el('p', 'indir-not', ana.not);
      if (arm && intel) {
        const b = el('a', 'intel-baglanti', d.macIntel.baglanti || 'Intel');
        b.href = intel;
        b.setAttribute('download', '');
        not.append(document.createTextNode(' · '), b);
      }
      return { dugme: dugme(ana), not };
    };
    const win = () => (url(d.windows) ? { dugme: dugme(d.windows), not: el('p', 'indir-not', d.windows.not) } : null);
    if (kip === 'kahraman') {
      const kap = el('div', 'indir-kahraman');
      const ana = (sistem === 'mac' ? mac() : sistem === 'windows' ? win() : null)?.dugme;
      if (ana) kap.append(ana);
      const diger = el('a', 'indir-diger', ana ? `${ICERIK.indir?.digerleri || 'Diğer sistemler'} →` : `${ICERIK.indir?.ust || 'İndir'} →`);
      diger.href = 'indir.html';
      kap.append(diger);
      return kap;
    }
    return { windows: win, mac };
  }

  function surumuGoster() {
    void sonSurum().then((veri) => {
      const isaret = $('#alt .surum-isareti');
      if (isaret && veri) isaret.textContent = `${ICERIK.indir?.sonSurum || 'Son sürüm'}: ${veri.etiket}${veri.tarih ? ` · ${veri.tarih}` : ''}`;
      document.documentElement.dataset.surum = veri ? 'var' : 'yok';
      // Ana sayfa: İzle'nin yanında küçük indirme düğmesi (yalnız sürüm varsa).
      const eylem = $('.kahraman-eylem');
      if (eylem && veri && Object.keys(veri.varliklar).length) {
        const kutu = indirKutusu(veri, 'kahraman');
        eylem.after(kutu);
      }
      window.dispatchEvent(new CustomEvent('nobetci-surum', { detail: veri }));
    });
  }

  // ------------------------------------------------------------------ başlat
  // Sayfaya özgü kod (js/sayfalar.js) bu ortak yardımcıları kullanır.
  const ortak = { ICERIK, AZ_HAREKET, INCE_ISARETCI, $, $$, el, kisit, harita, ikon, izleDugmesi, surumKarti, surumKimligi, dalgaEkle, sonSurum, indirKutusu, isletimSistemi };
  window.NobetciOrtak = ortak;
  kabukKur();
  metinleriYerlestir();
  detaylariYerlestir();
  if (typeof window.NobetciSayfa === 'function') window.NobetciSayfa(ortak);
  etkilesimler();
  hikayeKur();
  tanitimKur();
  kahramanDongusu();
  gecislerKur();
  surumuGoster();
})();
