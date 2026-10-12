// NÖBETÇİ TANITIM SİTESİ — metinleri icerik.js'ten yerleştirir; kahraman döngüsü, üzerine gelince oynayan vitrin ve küçük etkileşimler.
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
        k.style.animationDelay = `${0.1 + i * 0.08}s`;
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
    kilit: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    oneri: '<path d="M11 3.5l1.9 4.9 4.9 1.9-4.9 1.9L11 17.1l-1.9-4.9L4.2 10.3l4.9-1.9z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    akis: '<rect x="3" y="3.5" width="7" height="5" rx="1.4"/><rect x="14" y="10" width="7" height="5" rx="1.4"/><rect x="3" y="16.5" width="7" height="5" rx="1.4"/><path d="M10 6h3a2 2 0 0 1 2 2v2M14 12.5h-2.5a2 2 0 0 0-2 2v2"/>',
    kod: '<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
    hedef: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'
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
    const surec = $('#surec');
    if (surec) (ICERIK.nasil?.adimlar || []).forEach((a, i) => {
      const li = el('li', 'gorun');
      li.style.transitionDelay = `${i * 0.08}s`;
      li.append(el('h3', '', a.ad), el('p', '', a.metin));
      surec.append(li);
    });
    const fayda = $('#fayda-izgara');
    if (fayda) (ICERIK.faydalar?.liste || []).forEach((f, i) => {
      const k = el('article', 'kart fayda gorun');
      k.style.transitionDelay = `${i * 0.07}s`;
      const ik = el('span', 'fayda-ikon');
      ik.innerHTML = ikon(f.ikon);
      k.append(ik, el('b', '', f.buyuk), el('p', '', f.satir));
      fayda.append(k);
    });
    const surumler = $('#surum-listesi');
    if (surumler) (ICERIK.yenilikler?.liste || []).slice(0, 2).forEach((s) => surumler.append(surumKarti(s)));
    // Ana sayfa bölümlerinden sayfalara "Ayrıntılar →" bağlantısı
    for (const b of $$('[data-devami]')) {
      const a = el('a', 'devami', `${ICERIK.devami || 'Ayrıntılar'} →`);
      a.href = b.dataset.devami;
      b.append(a);
    }
  }

  // ------------------------------------------------------------------ kahraman: nöbet sahnesi
  // Kalkanın çevresinde ekran kartları; tarama ışını sırayla her birine uğrar (tarar → yeşil). Her turda bir kartta hata
  // bulunur: kırmızı yanar, kalkan dalga yayar, hata düzelir. Sahne yalnız görünürken döner; fare derinlik verir.
  async function nobetSahnesi() {
    const kok = $('#nobet');
    if (!kok) return;
    const kap = $('#nobet-ekranlar'); const isinlar = $('#nobet-isinlar'); const dalga = $('#nobet-dalga');
    const dar = () => innerWidth <= 700;
    const K = ICERIK.kahraman || {};
    const N = 6;
    // Her kartın iç düzeni (yazısız iskelet): satır genişlikleri; bazılarında grafik ya da düğme.
    const DUZEN = [[70, 45, 85, 'd'], ['g'], [55, 80, 40, 65], ['t'], [60, 90, 50, 'd'], [75, 35, 'g']];
    const kartlar = DUZEN.map((d, i) => {
      const k = el('div', 'nobet-ekran');
      k.style.setProperty('--i', String(i));
      const ust = el('div', 'ne-ust'); ust.append(el('i'), el('i'), el('i'), el('span', 'ne-ad', K.ekranlar?.[i] || ''), el('b', 'ne-durum'));
      const govde = el('div', 'ne-govde');
      for (const x of d) {
        if (x === 'g') { const g = el('div', 'ne-grafik'); for (let j = 0; j < 7; j++) { const c = el('span'); c.style.height = `${30 + ((j * 37 + i * 13) % 65)}%`; g.append(c); } govde.append(g); }
        else if (x === 't') { const t = el('div', 'ne-tablo'); for (let j = 0; j < 4; j++) t.append(el('span')); govde.append(t); }
        else if (x === 'd') govde.append(el('span', 'ne-dugme'));
        else { const s = el('span', 'ne-satir'); s.style.width = `${x}%`; govde.append(s); }
      }
      const etiket = el('span', 'ne-etiket');
      k.append(ust, govde, el('span', 'ne-tarayici'), etiket);
      kap.append(k);
      const cizgi = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      cizgi.setAttribute('x1', '50'); cizgi.setAttribute('y1', '50');
      isinlar.append(cizgi);
      return { k, cizgi, etiket };
    });
    const durum = (x, ad) => { x.k.dataset.durum = ad || ''; x.etiket.textContent = ad ? (K.durum?.[ad] || '') : ''; };
    // Kartlar sahnenin içinde kalır (başlığa ve düğmeye binmez): yarıçap, kart boyutu ve sahne ölçüsüne göre.
    const yerlestir = () => {
      const W = kok.clientWidth || 1; const H = kok.clientHeight || 1;
      const kw = kartlar[0].k.offsetWidth * 1.08; const kh = kartlar[0].k.offsetHeight * 1.08;
      const rx = Math.min(dar() ? 36 : 40, 50 - ((kw / 2 + 6) / W) * 100);
      const ry = Math.max(12, Math.min(38, 50 - ((kh / 2 + 6) / H) * 100));
      kartlar.forEach(({ k, cizgi }, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2 + Math.PI / N;
        const x = 50 + Math.cos(a) * rx; const y = 50 + Math.sin(a) * ry;
        k.style.left = `${x}%`; k.style.top = `${y}%`;
        k.style.setProperty('--z', String(0.6 + ((i * 3) % 4) * 0.13));
        cizgi.setAttribute('x2', String(x)); cizgi.setAttribute('y2', String(y));
      });
    };
    yerlestir();
    new ResizeObserver(yerlestir).observe(kok);
    // Fare derinliği: kartlar ve halkalar farklı katmanlarda hafifçe kayar.
    const derinlik = $('#nobet-derinlik');
    if (INCE_ISARETCI && !AZ_HAREKET) {
      $('#kahraman').addEventListener('pointermove', (e) => {
        derinlik.style.setProperty('--px', String((e.clientX / innerWidth - 0.5) * 2));
        derinlik.style.setProperty('--py', String((e.clientY / innerHeight - 0.5) * 2));
      });
    }
    if (AZ_HAREKET) { kartlar.forEach((x) => { x.k.classList.add('tamam'); durum(x, 'gecti'); }); return; }
    let gorunur = true;
    new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; }).observe(kok);
    const sira = async (ms) => { await bekle(ms); while (!gorunur || document.hidden) await bekle(300); };
    let tur = 0;
    for (;;) {
      const hatali = (tur * 4 + 1) % N;
      kartlar.forEach((x) => { x.k.classList.remove('tamam', 'hata', 'duzeldi'); durum(x, ''); });
      await sira(500);
      for (let i = 0; i < N; i++) {
        const { k, cizgi } = kartlar[i];
        k.classList.add('taraniyor'); cizgi.classList.add('acik'); durum(kartlar[i], 'taraniyor');
        await sira(900);
        k.classList.remove('taraniyor'); cizgi.classList.remove('acik');
        k.classList.add(i === hatali ? 'hata' : 'tamam'); durum(kartlar[i], i === hatali ? 'hata' : 'gecti');
        await sira(250);
      }
      // Hata yakalandı: kalkan dalga yayar, ışın hataya kilitlenir, kart yeşile döner.
      const h = kartlar[hatali];
      dalga.classList.remove('yay'); void dalga.offsetWidth; dalga.classList.add('yay');
      h.cizgi.classList.add('acik', 'kilit');
      await sira(1100);
      h.k.classList.remove('hata'); h.k.classList.add('tamam', 'duzeldi'); durum(h, 'duzeldi');
      h.cizgi.classList.remove('acik', 'kilit');
      kok.classList.add('hepsi-tamam');
      await sira(2200);
      kok.classList.remove('hepsi-tamam');
      tur++;
    }
  }

  // ------------------------------------------------------------------ vitrin sahneleri: her biri f(p), p 0 → 1 (oynatıcı sürer)
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
    kasa(kok) {
      const gorsel = $('.kasa-gorsel', kok);
      return (p) => {
        gorsel.style.setProperty('--kilit', String(harita(p, 0.12, 0.32)));
        gorsel.style.setProperty('--carpi', String(harita(p, 0.34, 0.46)));
        gorsel.style.setProperty('--bulut', String(harita(p, 0.48, 0.8)));
      };
    },
    // --- Görseli burada kurulan sahneler (metinler icerik.js → vitrin.liste) ---
    oneri(kok, v) {
      const g = $('.oneri-gorsel', kok);
      g.innerHTML = `<div class="pencere oneri-pencere"><div class="pencere-ust"><i></i><i></i><i></i><span class="pencere-adi">Sipariş formu · senaryolar</span></div>
        <div class="oneri-govde"><div class="oneri-bas"><span class="oneri-yildiz">${ikon('oneri')}</span><b></b></div><div class="oneri-liste"></div></div></div>
        <div class="oneri-sayac"><small></small><b>0</b></div>`;
      $('.oneri-bas b', g).textContent = v.baslik || '';
      $('.oneri-sayac small', g).textContent = v.sayac || '';
      const sayi = $('.oneri-sayac b', g); const sayac = $('.oneri-sayac', g); const bas = $('.oneri-bas', g);
      const satirlar = (v.oneriler || []).map(([tur, metin]) => {
        const s = el('div', 'oneri-satir');
        const d = el('span', 'oneri-ekle', v.ekle || 'Ekle');
        s.append(el('span', 'oneri-tur', tur), el('span', 'oneri-metin', metin), d);
        $('.oneri-liste', g).append(s);
        return { s, d };
      });
      const ilk = v.ilk || 0; let son = -1;
      return (p) => {
        bas.classList.toggle('dusunuyor', p > 0.03 && p < 0.3);
        bas.classList.toggle('acik', p > 0.03);
        let eklenen = 0;
        satirlar.forEach((x, i) => {
          x.s.classList.toggle('acik', p > 0.16 + i * 0.08);
          const e = p > 0.56 + i * 0.09;
          x.s.classList.toggle('eklendi', e);
          x.d.textContent = e ? `✓ ${v.eklendi || ''}` : (v.ekle || '');
          if (e) eklenen++;
        });
        if (eklenen !== son) { sayi.textContent = String(ilk + eklenen); if (son >= 0 && eklenen > son) { sayac.classList.remove('vurus'); void sayac.offsetWidth; sayac.classList.add('vurus'); } son = eklenen; }
        sayac.classList.toggle('acik', p > 0.1);
      };
    },
    akis(kok, v) {
      const g = $('.akis-gorsel', kok);
      g.innerHTML = `<div class="akis-palet"><small></small></div><div class="akis-pano"><div class="akis-baslik"></div><div class="akis-hat"><span></span></div><div class="akis-adimlar"></div></div>`;
      $('.akis-palet small', g).textContent = v.palet || '';
      $('.akis-baslik', g).textContent = v.baslik || '';
      const hat = $('.akis-hat span', g);
      const palet = (v.adimlar || []).map(([ik, tur]) => { const c = el('span', 'akis-cip'); c.innerHTML = ikon(ik); c.append(document.createTextNode(tur)); $('.akis-palet', g).append(c); return c; });
      const dugumler = [...(v.adimlar || []), ['hedef', '', v.sonuc || '']].map(([ik, tur, ad], i, l) => {
        const d = el('div', `akis-dugum${i === l.length - 1 ? ' sonuc' : ''}`);
        const k = el('span', 'akis-ikon'); k.innerHTML = ikon(ik);
        const y = el('span', 'akis-yazi'); if (tur) y.append(el('small', '', tur)); y.append(el('b', '', ad));
        d.append(k, y, el('span', 'akis-durum'));
        $('.akis-adimlar', g).append(d);
        return d;
      });
      const n = dugumler.length;
      return (p) => {
        dugumler.forEach((d, i) => {
          const gel = i < n - 1 ? 0.06 + i * 0.13 : 0.46;
          d.classList.toggle('acik', p > gel);
          d.classList.toggle('kosuyor', p > 0.52 + i * 0.1 && p <= 0.6 + i * 0.1);
          d.classList.toggle('gecti', p > 0.6 + i * 0.1);
          if (palet[i]) palet[i].classList.toggle('secili', p > gel - 0.05 && p < gel + 0.06);
        });
        hat.style.transform = `scaleY(${harita(p, 0.52, 0.52 + (n - 1) * 0.1)})`;
        g.classList.toggle('bitti', p > 0.6 + (n - 1) * 0.1);
      };
    },
    pano(kok, v) {
      const g = $('.pano-gorsel', kok);
      g.innerHTML = `<div class="pencere pano-pencere"><div class="pencere-ust"><i></i><i></i><i></i><span class="pencere-adi"></span><span class="pano-zil">${ikon('zil')}<b>1</b></span></div>
        <div class="pano-izgara">
          <div class="pk pk-basari"><small></small><b>%97</b></div>
          <div class="pk pk-trend"><small></small><div class="cubuklar mini"></div></div>
          <div class="pk pk-sql"><small></small><b>18</b><span class="rozet rozet-kirmizi"></span></div>
          <div class="pk pk-bugun"><small></small><b>58 / 60</b></div>
          <div class="pk pk-servis"><small></small><b>12 ✓</b></div>
        </div>
        <div class="pano-bildirim"><span class="pano-bildirim-ikon">${ikon('zil')}</span><span></span></div></div>
        <svg class="sanal-imlec pano-imlec"><use href="#imlec"/></svg>`;
      const yaz = (s, t) => { $(s, g).textContent = t || ''; };
      yaz('.pencere-adi', v.baslik); yaz('.pk-basari small', v.basari); yaz('.pk-trend small', v.trend); yaz('.pk-sql small', v.sql);
      yaz('.pk-bugun small', v.bugun); yaz('.pk-servis small', v.servis); yaz('.pk-sql .rozet', v.esik);
      yaz('.pano-bildirim span:last-child', v.bildirim);
      const cub = $('.cubuklar', g);
      [0.9, 1, 0.85, 1, 0.95, 1, 0.8, 1, 1, 0.92, 1, 0.97].forEach((x) => { const s = el('span'); s.style.height = `${x * 100}%`; s.style.setProperty('--b', '1'); cub.append(s); });
      const a = $('.pk-servis', g); const b = $('.pk-basari', g); const sql = $('.pk-sql', g); const sqlSayi = $('.pk-sql b', g);
      const imlec = $('.pano-imlec', g);
      return (p) => {
        // Sürükle-bırak: "Servisler" kartı "Başarı"nın yerine geçer (yer değiştirme).
        const dx = b.offsetLeft - a.offsetLeft; const dy = b.offsetTop - a.offsetTop;
        const t = harita(p, 0.14, 0.42); const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const kalk = p > 0.08 && p < 0.46;
        a.style.transform = `translate(${dx * e}px, ${dy * e}px) scale(${kalk ? 1.05 : 1})`;
        b.style.transform = `translate(${-dx * e}px, ${-dy * e}px)`;
        a.classList.toggle('tutuluyor', kalk);
        const kr = g.getBoundingClientRect(); const ar = a.getBoundingClientRect(); const o = kr.width / (g.offsetWidth || 1);
        const px = (ar.left - kr.left + ar.width * 0.62) / o; const py = (ar.top - kr.top + ar.height * 0.58) / o;
        imlec.style.setProperty('--ix', `${px}px`); imlec.style.setProperty('--iy', `${py}px`);
        imlec.style.opacity = p > 0.04 && p < 0.5 ? '1' : '0';
        // SQL kartı eşiği aşar → zil ve bildirim.
        sqlSayi.textContent = String(Math.round(18 + 9 * harita(p, 0.52, 0.7)));
        sql.classList.toggle('uyari', p > 0.7);
        g.classList.toggle('zil-caliyor', p > 0.76);
        g.classList.toggle('uyari-geldi', p > 0.82);
      };
    },
    ekip(kok, v) {
      const g = $('.ekip-gorsel', kok);
      g.innerHTML = `<div class="ekip-siz"><svg class="ekip-logo" aria-hidden="true"><use href="#kalkan"/></svg><b></b><span class="ekip-surum">v3</span><span class="ekip-yayinla"></span></div>
        <svg class="ekip-hatlar" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M150 0 C150 50 50 50 50 100"/><path d="M150 0 L150 100"/><path d="M150 0 C150 50 250 50 250 100"/>
        <path class="dolu" pathLength="1" d="M150 0 C150 50 50 50 50 100"/><path class="dolu" pathLength="1" d="M150 0 L150 100"/><path class="dolu" pathLength="1" d="M150 0 C150 50 250 50 250 100"/></svg>
        <div class="ekip-kisiler"></div>`;
      $('.ekip-siz b', g).textContent = v.siz || '';
      const yayinla = $('.ekip-yayinla', g); yayinla.textContent = v.yayinla || '';
      const dolu = $$('.ekip-hatlar .dolu', g);
      const kisiler = (v.kisiler || []).map((ad) => {
        const k = el('div', 'ekip-kisi');
        const durum = el('span', 'ekip-durum', 'v2');
        k.append(el('span', 'ekip-avatar', ad[0]), el('b', '', ad), durum);
        $('.ekip-kisiler', g).append(k);
        return { k, durum };
      });
      return (p) => {
        yayinla.classList.toggle('basildi', p > 0.1 && p < 0.18);
        g.classList.toggle('yayinda', p > 0.14);
        dolu.forEach((d, i) => { d.style.strokeDashoffset = String(1 - harita(p, 0.18 + i * 0.04, 0.44 + i * 0.04)); });
        kisiler.forEach((x, i) => {
          const geldi = p > 0.46 + i * 0.04; const guncel = p > 0.64 + i * 0.08;
          x.k.classList.toggle('geldi', geldi && !guncel);
          x.k.classList.toggle('guncel', guncel);
          x.durum.textContent = guncel ? `✓ v3` : geldi ? (v.guncelle || '') : 'v2';
        });
      };
    }
  };

  // ------------------------------------------------------------------ oynatıcı: f(p) zamanla 0 → 1
  /** f(p)'yi sure ms içinde 0'dan 1'e oynatır. Azaltılmış harekette doğrudan son hâl. */
  function oynatici(f, sure) {
    let bas = 0; let istek = 0;
    const adim = (z) => { const p = kisit((z - bas) / sure); f(p); istek = p < 1 ? requestAnimationFrame(adim) : 0; };
    return {
      oynat() { cancelAnimationFrame(istek); if (AZ_HAREKET) { istek = 0; f(1); return; } bas = performance.now(); f(0); istek = requestAnimationFrame(adim); },
      dur(p = 1) { cancelAnimationFrame(istek); istek = 0; f(p); },
      get oynuyor() { return istek !== 0; }
    };
  }

  /**
   * Oynatma tetikleri (kaydırma değil): ince işaretçide üzerine gelince; dokunmatikte görününce bir kez; her yerde tıklayınca.
   * Oynamıyorken öğe ilk hâlinde durur (ilk: 0 baş, 1 son kare).
   */
  function uzerindeOynat(kok, oyn, { tetik = kok, ilk = 1 } = {}) {
    oyn.dur(ilk);
    const oynat = () => { if (!oyn.oynuyor) oyn.oynat(); };
    if (INCE_ISARETCI) tetik.addEventListener('pointerenter', oynat);
    else new IntersectionObserver(([g], gz) => { if (g.isIntersecting) { oynat(); gz.disconnect(); } }, { threshold: 0.55 }).observe(kok);
    tetik.addEventListener('click', oynat);
  }

  // ------------------------------------------------------------------ "Neler yapar" vitrini
  function vitrinKur() {
    const kok = $('#vitrin');
    if (!kok) return;
    const v = ICERIK.vitrin || {};
    const liste = $('#vitrin-liste'); const not = $('#vitrin-not'); const sahne = $('#vitrin-sahne');
    $('#vitrin-ipucu span').textContent = INCE_ISARETCI ? (v.ipucu || '') : (v.ipucuDokun || '');
    const ogeler = (v.liste || []).map((x) => {
      const panel = $(`.vitrin-panel[data-sahne="${x.id}"]`, kok);
      if (!panel || !sahneler[x.id]) return null;
      const f = sahneler[x.id](panel, x);
      const li = el('li');
      const d = el('button', 'vitrin-oge');
      d.type = 'button';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-controls', panel.id);
      const ik = el('span', 'vitrin-ikon'); ik.innerHTML = ikon(x.ikon);
      d.append(ik, el('b', '', x.ad), el('i', 'vitrin-cubuk'));
      li.append(d); liste.append(li);
      const oyn = oynatici((p) => { f(p); d.style.setProperty('--ilerleme', String(p)); sahne.classList.toggle('oynuyor', p < 1); }, x.sure || 3600);
      return { x, panel, d, oyn };
    }).filter(Boolean);
    if (!ogeler.length) return;
    let aktif = null;
    const sec = (o, oynat) => {
      if (aktif && aktif !== o) aktif.oyn.dur(1);
      aktif = o;
      for (const y of ogeler) {
        const bu = y === o;
        y.panel.classList.toggle('acik', bu);
        y.panel.inert = !bu;
        y.d.setAttribute('aria-selected', String(bu));
        y.d.tabIndex = bu ? 0 : -1;
      }
      not.textContent = o.x.satir;
      if (oynat) o.oyn.oynat(); else o.oyn.dur(1);
    };
    // Başlıkların üzerinden geçerken titremesin: kısa bekleme (üzerinde kalınca oynar).
    let bekleme = 0;
    ogeler.forEach((o, i) => {
      if (INCE_ISARETCI) {
        o.d.addEventListener('pointerenter', () => { clearTimeout(bekleme); bekleme = setTimeout(() => { if (aktif !== o) sec(o, true); else if (!o.oyn.oynuyor) o.oyn.oynat(); }, 110); });
        o.d.addEventListener('pointerleave', () => clearTimeout(bekleme));
      }
      o.d.addEventListener('click', () => {
        if (aktif !== o || !o.oyn.oynuyor) sec(o, true);
        if (!INCE_ISARETCI) o.d.scrollIntoView({ block: 'nearest', inline: 'center', behavior: AZ_HAREKET ? 'auto' : 'smooth' });
      });
      o.d.addEventListener('keydown', (e) => {
        const yon = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!yon) return;
        e.preventDefault();
        const h = ogeler[(i + yon + ogeler.length) % ogeler.length];
        sec(h, true); h.d.focus();
      });
    });
    ogeler.forEach((o) => o.oyn.dur(1));
    sec(ogeler[0], false);
    uzerindeOynat(sahne, { oynat: () => aktif.oyn.oynat(), dur: () => {}, get oynuyor() { return aktif.oyn.oynuyor; } }, { ilk: 1 });
    // Boyut değişince (yer değiştiren kartlar ölçüyle konumlanır) son hâl yeniden kurulur.
    addEventListener('resize', () => { if (!aktif.oyn.oynuyor) aktif.oyn.dur(1); });
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
    const kur = () => { if (!tur) { tur = new window.NobetciTur.Tur(kap, { kisa: true, secim: ICERIK.tur?.tanitim }); tur.git(2.6); } return tur; };
    new IntersectionObserver(([g], gz) => { if (g.isIntersecting) { kur(); gz.disconnect(); } }, { rootMargin: '200px 0px', threshold: 0.01 }).observe(kap);
    if (AZ_HAREKET) return;
    // Ekranda (en az yarısı) görünürken oynar; kaydırıp ekrandan çıkınca durur, geri gelince kaldığı yerden sürer.
    new IntersectionObserver(([g]) => { if (g.isIntersecting) kur().oynat(); else tur?.duraklat(); }, { threshold: 0.5 }).observe(kap);
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
   * İndirme düğmeleri (İndir sayfası, sistem başına).
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
      // İki Mac paketi varsa: büyük düğme M serisi, altında aynı biçimde ikincil Intel düğmesi ve "Hangisi?" satırı.
      if (arm && intel) {
        const not = el('div', 'indir-mac-secim');
        not.append(el('p', 'indir-not', d.macArm.not));
        const ikinci = dugme(d.macIntel);
        ikinci.classList.add('dugme-indir-ikincil');
        not.append(ikinci, el('p', 'indir-not', d.macIntel.not));
        if (d.macHangisi) not.append(el('p', 'indir-hangisi', d.macHangisi));
        return { dugme: dugme(ana), not };
      }
      return { dugme: dugme(ana), not: el('p', 'indir-not', ana.not) };
    };
    const win = () => (url(d.windows) ? { dugme: dugme(d.windows), not: el('p', 'indir-not', d.windows.not) } : null);
    return { windows: win, mac };
  }

  function surumuGoster() {
    void sonSurum().then((veri) => {
      const isaret = $('#alt .surum-isareti');
      if (isaret && veri) isaret.textContent = `${ICERIK.indir?.sonSurum || 'Son sürüm'}: ${veri.etiket}${veri.tarih ? ` · ${veri.tarih}` : ''}`;
      document.documentElement.dataset.surum = veri ? 'var' : 'yok';
      // Ana sayfa: İzle'nin yanında aynı biçimde "İndir" hap düğmesi (yalnız sürüm varsa); sistem seçimi İndir sayfasında.
      const eylem = $('.kahraman .kahraman-eylem');
      if (eylem && veri && Object.keys(veri.varliklar).length && !$('.indir-hap', eylem)) {
        const a = el('a', 'izle-hap indir-hap');
        a.href = 'indir.html';
        const ik = el('span', 'izle-hap-ikon');
        ik.setAttribute('aria-hidden', 'true');
        ik.innerHTML = INDIR_SVG;
        a.append(ik, el('span', '', ICERIK.indir?.ust || 'İndir'));
        eylem.append(a);
      }
      window.dispatchEvent(new CustomEvent('nobetci-surum', { detail: veri }));
    });
  }

  // ------------------------------------------------------------------ başlat
  // Sayfaya özgü kod (js/sayfalar.js) bu ortak yardımcıları kullanır.
  const ortak = { ICERIK, AZ_HAREKET, INCE_ISARETCI, $, $$, el, kisit, harita, ikon, oynatici, uzerindeOynat, izleDugmesi, surumKarti, surumKimligi, dalgaEkle, sonSurum, indirKutusu, isletimSistemi };
  window.NobetciOrtak = ortak;
  kabukKur();
  metinleriYerlestir();
  detaylariYerlestir();
  if (typeof window.NobetciSayfa === 'function') window.NobetciSayfa(ortak);
  etkilesimler();
  vitrinKur();
  tanitimKur();
  nobetSahnesi();
  gecislerKur();
  surumuGoster();
})();
