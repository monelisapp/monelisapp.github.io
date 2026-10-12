// NÖBETÇİ TANITIM TURU — gerçek ekran görüntüleri üzerinde video benzeri, adım adım tur.
// İçerik icerik.js'teki ICERIK.tur'dan, hedeflerin görüntüdeki yerleri assets/ekranlar/konumlar.js'ten (EKRAN_KONUMLARI) gelir.
// Zaman çizelgesi saftır: render(t) her an için aynı görüntüyü üretir; bu yüzden ileri / geri sarma ve bölüme atlama kolaydır.
(function () {
  'use strict';

  const ICERIK = window.ICERIK || {};
  const KONUM = window.EKRAN_KONUMLARI || {};
  const AZ_HAREKET = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kisit = (d, a, b) => Math.min(b, Math.max(a, d));
  const yumusak = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const ara = (a, b, x) => a + (b - a) * x;
  const el = (etiket, sinif, metin) => { const e = document.createElement(etiket); if (sinif) e.className = sinif; if (metin != null) e.textContent = metin; return e; };
  const KALKAN = '<svg aria-hidden="true"><use href="#kalkan"/></svg>';
  const IMLEC = '<svg class="tk-imlec" aria-hidden="true"><use href="#imlec"/></svg>';

  // ------------------------------------------------------------------ Telegram telefonu (sahne 4 ve turun son bölümü ortak)
  /** Kapsayıcıya telefon + sohbet kurar; durum(n): 0 boş · 1 komut · 2 liste · 3 seçim · 4 koşuyor · 5 sonuç (aynı mesaj güncellenir). */
  function telefonKur(kap) {
    const t = ICERIK.telegram || {};
    kap.classList.add('telefon');
    kap.innerHTML = '';
    const cerceve = el('div', 'telefon-cerceve');
    cerceve.innerHTML = '<div class="telefon-ust"><span class="saat">09:41</span><span class="centik"></span><span class="pil"></span></div>';
    const sohbet = el('div', 'sohbet');
    const ust = el('div', 'sohbet-ust');
    ust.innerHTML = `<span class="avatar">${KALKAN}</span>`;
    const ad = el('div'); ad.append(el('b', '', t.botAdi || 'Nöbetçi'), el('small', '', t.botDurum || 'bot'));
    ust.append(ad);
    const akis = el('div', 'sohbet-akis');
    const komut = el('div', 'balon ben', t.komut);
    const liste = el('div', 'balon bot', t.liste);
    const klavye = el('div', 'klavye');
    const dugmeler = (t.secenekler || []).map((s) => { const d = el('span', '', s); klavye.append(d); return d; });
    liste.append(klavye);
    const sonuc = el('div', 'balon bot sonuc');
    const sonucMetin = el('span', '', t.kosuyor);
    const duzenlendi = el('small', 'duzenlendi', 'düzenlendi');
    sonuc.append(sonucMetin);
    akis.append(komut, liste, sonuc);
    sohbet.append(ust, akis);
    cerceve.append(sohbet);
    kap.append(cerceve);
    let son = -1;
    return function durum(n) {
      if (n === son) return;
      son = n;
      komut.classList.toggle('acik', n >= 1);
      liste.classList.toggle('acik', n >= 2);
      dugmeler.forEach((d) => d.classList.toggle('secili', n >= 3 && d.textContent === t.secilen));
      sonuc.classList.toggle('acik', n >= 4);
      sonuc.classList.toggle('gecti', n >= 5);
      sonucMetin.textContent = n >= 5 ? t.sonuc : t.kosuyor;
      if (n >= 5) sonuc.append(duzenlendi); else duzenlendi.remove();
    };
  }

  // ------------------------------------------------------------------ zaman çizelgesi
  const SURE_TAM = { gecis: 0.4, hareket: 0.85, tik: 0.35, yakin: 0.75, bekle: 1.75, uzak: 0.5, telefon: 3.8 };
  const SURE_KISA = { gecis: 0.4, hareket: 0.8, tik: 0.3, yakin: 0.7, bekle: 1.7, uzak: 0.5, telefon: 3.6 };

  function cizelge(secim, sure) {
    const bolumler = (ICERIK.tur && ICERIK.tur.bolumler) || [];
    const liste = [];
    bolumler.forEach((b, bi) => b.adimlar.forEach((a, ai) => {
      if (secim && !secim.some(([x, y]) => x === bi && y === ai)) return;
      liste.push({ bi, ai, bolum: b, adim: a, telefon: !!b.telefon });
    }));
    let t = 0;
    for (const s of liste) {
      s.bas = t;
      s.sure = s.telefon ? sure.telefon : sure.gecis + sure.hareket + (s.adim.tik ? sure.tik : 0) + sure.yakin + sure.bekle + sure.uzak;
      t += s.sure;
    }
    return { liste, toplam: t, bolumler };
  }

  function bolgeBul(adim) {
    if (Array.isArray(adim.bolge)) return adim.bolge;
    const k = KONUM[adim.ekran] && KONUM[adim.ekran][adim.hedef];
    return Array.isArray(k) ? k : [0.4, 0.4, 0.2, 0.1];
  }

  // ------------------------------------------------------------------ tur motoru
  class Tur {
    /** @param {HTMLElement} kap @param {{ kisa?: boolean, secim?: number[][], bitince?: () => void, guncelle?: (t: number) => void }} s */
    constructor(kap, s = {}) {
      this.kap = kap;
      this.s = s;
      this.sure = s.kisa ? SURE_KISA : SURE_TAM;
      this.c = cizelge(s.secim, this.sure);
      this.t = 0;
      this.oynuyor = false;
      this.sonZaman = 0;
      this.kur();
      this.boyutla();
      this.ro = new ResizeObserver(() => { this.boyutla(); this.render(this.t); });
      this.ro.observe(kap);
      this.render(0);
    }

    get toplam() { return this.c.toplam; }

    kur() {
      const k = this.kap;
      k.innerHTML = '';
      const zemin = el('div', 'tk-zemin');
      this.tuval = el('div', 'tk-tuval');
      this.kapIc = el('div', 'tk-kap');
      this.gorseller = {};
      const ekranlar = [...new Set(this.c.liste.filter((x) => !x.telefon).map((x) => x.adim.ekran))];
      for (const ad of ekranlar) {
        const img = new Image();
        img.className = 'tk-gorsel';
        img.alt = '';
        img.decoding = 'async';
        img.src = `assets/ekranlar/${ad}.webp`;
        img.onerror = () => { if (!img.src.endsWith('.png')) img.src = `assets/ekranlar/${ad}.png`; };
        this.kapIc.append(img);
        this.gorseller[ad] = img;
      }
      this.isik = el('div', 'tk-isik');
      this.tik = el('div', 'tk-tik');
      this.kapIc.append(this.isik, this.tik);
      this.kapIc.insertAdjacentHTML('beforeend', IMLEC);
      this.imlec = this.kapIc.lastElementChild;
      this.tuval.append(this.kapIc);
      this.telefonKatmani = el('div', 'tk-telefon');
      const tel = el('div');
      this.telefonDurum = telefonKur(tel);
      this.telefonKatmani.append(tel);
      zemin.append(this.tuval, this.telefonKatmani);
      this.yazi = el('div', 'tk-yazi');
      this.bolumCip = el('div', 'tk-bolum');
      k.append(zemin, this.yazi, this.bolumCip);
      if (!this.s.kisa) {
        this.son = el('div', 'tk-son');
        this.son.innerHTML = `<svg class="kalkan-buyuk" aria-hidden="true"><use href="#kalkan"/></svg><h3>${(ICERIK.kapanis && ICERIK.kapanis.baslik) || ''}</h3>`;
        const tekrar = el('button', 'dugme dugme-ana', 'Tekrar izle');
        tekrar.type = 'button';
        tekrar.addEventListener('click', () => { this.git(0); this.oynat(); });
        this.son.append(tekrar);
        k.append(this.son);
      }
    }

    /** Tuval her zaman 16:10; kapsayıcıya sığdırılır. */
    boyutla() {
      // Yerleşim ölçüsü (dönüşümlerden etkilenmez: pencere açılış animasyonu ölçeği bozmasın).
      const r = { width: this.kap.clientWidth, height: this.kap.clientHeight };
      if (!r.width || !r.height) return;
      // Dikey (telefon) kapsayıcıda "kaplama": görüntü yüksekliği doldurur, kamera hedefe kayar. Yatayda "sığdırma".
      this.kaplama = r.height > r.width * 0.8;
      let w = r.width; let h = w / 1.6;
      if (this.kaplama) { h = r.height; w = h * 1.6; } else if (h > r.height) { h = r.height; w = h * 1.6; }
      this.tuval.style.width = `${w}px`;
      this.tuval.style.height = `${h}px`;
      this.tuval.classList.toggle('kaplama', this.kaplama);
      this.W = w; this.H = h;
      this.Vw = this.kaplama ? r.width : w; this.Vh = this.kaplama ? r.height : h;
    }

    bul(t) {
      const l = this.c.liste;
      for (let i = l.length - 1; i >= 0; i--) if (t >= l[i].bas) return i;
      return 0;
    }

    render(t) {
      this.t = t;
      const l = this.c.liste;
      if (!l.length) return;
      const i = this.bul(t);
      const s = l[i];
      const lt = t - s.bas;
      const S = this.sure;
      const bolumSayisi = this.c.bolumler.length;
      this.bolumCip.textContent = `${s.bi + 1}/${bolumSayisi} · ${s.bolum.ad}`;
      this.yazi.textContent = s.adim.yazi || '';
      let yaziAcik = false;

      if (s.telefon) {
        this.telefonKatmani.classList.add('acik');
        const o = s.adim.olay;
        let n = 0;
        if (o === 'komut') n = lt < 0.5 ? 0 : lt < 1.5 ? 1 : 2;
        else if (o === 'secim') n = lt < 1.0 ? 2 : lt < 2.0 ? 3 : 4;
        else n = lt < 1.4 ? 4 : 5;
        this.telefonDurum(n);
        yaziAcik = lt > 0.3 && lt < s.sure - 0.25;
      } else {
        this.telefonKatmani.classList.remove('acik');
        for (const [ad, img] of Object.entries(this.gorseller)) img.classList.toggle('acik', ad === s.adim.ekran);
        const r = bolgeBul(s.adim);
        const cx = r[0] + r[2] / 2; const cy = r[1] + r[3] / 2;
        // İmlecin başlangıcı: önceki adımın hedefi (aynı ekranda) ya da ekranın ortası.
        const once = l[i - 1];
        let bx = 0.55; let by = 0.62;
        if (once && !once.telefon && once.adim.ekran === s.adim.ekran) { const ro = bolgeBul(once.adim); bx = ro[0] + ro[2] / 2; by = ro[1] + ro[3] / 2; }
        let a = lt;
        const asama = (sure) => { const x = kisit(a / sure, 0, 1); a -= sure; return x; };
        asama(S.gecis);
        const hareket = yumusak(asama(S.hareket));
        const tik = s.adim.tik ? asama(S.tik) : 0;
        const yakin = yumusak(asama(S.yakin));
        const bekle = asama(S.bekle);
        const uzak = yumusak(asama(S.uzak));
        const z = AZ_HAREKET ? (yakin > 0 && uzak < 1 ? 1 : 0) : yakin * (1 - uzak);
        const ix = ara(bx, cx, hareket); const iy = ara(by, cy, hareket);
        yaziAcik = yakin > 0.6 && (bekle < 1 || uzak < 0.3);

        const W = this.W || 1; const H = this.H || 1; const Vw = this.Vw || W; const Vh = this.Vh || H;
        const hedefS = kisit(Math.min((0.5 * Vw) / (r[2] * W), (0.42 * Vh) / (r[3] * H)), 1.15, this.kaplama ? 2.4 : 2.1);
        const sc = 1 + (hedefS - 1) * z;
        // Kamera: odak imleçtir (yakınlaşınca hedef); görüntü kenarı görünmeyecek biçimde sınırlanır.
        const fx = ara(ix, cx, z); const fy = ara(iy, cy, z);
        const eksen = (v, boy, f, oran) => (boy * sc <= v ? (v - boy * sc) / 2 : kisit(v * oran - f * boy * sc, v - boy * sc, 0));
        const tx = eksen(Vw, W, fx, 0.5);
        const ty = eksen(Vh, H, fy, 0.42);
        this.kapIc.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
        const pay = 0.008;
        Object.assign(this.isik.style, {
          left: `${(r[0] - pay) * 100}%`, top: `${(r[1] - pay * 1.6) * 100}%`, width: `${(r[2] + pay * 2) * 100}%`, height: `${(r[3] + pay * 3.2) * 100}%`,
          opacity: String(z), boxShadow: `0 0 0 4000px rgba(2,5,10,${0.62 * z}), 0 0 0 ${2 / sc}px rgba(125,211,252,.95), 0 0 ${34 / sc}px ${4 / sc}px rgba(56,189,248,.55)`
        });
        this.imlec.style.left = `${ix * 100}%`;
        this.imlec.style.top = `${iy * 100}%`;
        this.imlec.style.transform = `scale(${(1 / sc) * (tik > 0 && tik < 1 ? 0.86 : 1)})`;
        this.imlec.style.opacity = String(lt < S.gecis * 0.5 && i === 0 ? 0 : 1);
        Object.assign(this.tik.style, {
          left: `${cx * 100}%`, top: `${cy * 100}%`, opacity: String(tik > 0 && tik < 1 ? 1 - tik : 0), transform: `scale(${(0.3 + tik * 1.1) / sc})`
        });
      }
      this.yazi.classList.toggle('acik', yaziAcik);
      if (this.son) this.son.classList.toggle('acik', t >= this.c.toplam - 0.001);
      if (this.s.guncelle) this.s.guncelle(t, s);
    }

    dongu = (zaman) => {
      if (!this.oynuyor) return;
      const dt = this.sonZaman ? Math.min(0.1, (zaman - this.sonZaman) / 1000) : 0;
      this.sonZaman = zaman;
      let t = this.t + dt;
      if (t >= this.c.toplam) {
        if (this.s.kisa) t = 0;
        else { this.render(this.c.toplam); this.duraklat(); if (this.s.bitince) this.s.bitince(); return; }
      }
      this.render(t);
      this.istek = requestAnimationFrame(this.dongu);
    };

    oynat() {
      if (this.oynuyor) return;
      if (this.t >= this.c.toplam - 0.001) this.t = 0;
      this.oynuyor = true;
      this.sonZaman = 0;
      this.istek = requestAnimationFrame(this.dongu);
      if (this.s.guncelle) this.s.guncelle(this.t, null);
    }

    duraklat() {
      this.oynuyor = false;
      cancelAnimationFrame(this.istek);
      if (this.s.guncelle) this.s.guncelle(this.t, null);
    }

    git(t) { this.render(kisit(t, 0, this.c.toplam)); }

    bolumBaslangici(bi) { const s = this.c.liste.find((x) => x.bi === bi); return s ? s.bas : 0; }

    birak() { this.duraklat(); this.ro.disconnect(); }
  }

  // ------------------------------------------------------------------ oynatıcı penceresi (İzle)
  const sureMetni = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  let oynatici = null;

  /** @param {HTMLElement | null} geriOdak kapanınca odağın döneceği öğe @param {number | null} [bolum] bu bölümden başlat */
  function oynaticiAc(geriOdak, bolum = null) {
    const pencere = document.getElementById('tur-pencere');
    if (!pencere) return;
    const kap = document.getElementById('oynatici');
    const sahne = document.getElementById('tur-sahne');
    const oynatDugme = document.getElementById('tur-oynat');
    const cubuk = document.getElementById('zaman-cubugu');
    const dolu = document.getElementById('zaman-dolu');
    const metin = document.getElementById('zaman-metni');
    const bolumAdi = document.getElementById('tur-bolum-adi');
    const liste = document.getElementById('bolum-listesi');
    document.getElementById('tur-baslik').textContent = (ICERIK.tur && ICERIK.tur.baslik) || 'Tur';

    const OYNAT = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
    const DURAKLAT = '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';
    let sonBolum = -1;
    const guncelle = (t, s) => {
      const tur = oynatici;
      if (!tur) return;
      const yuzde = (t / tur.toplam) * 100;
      dolu.style.width = `${yuzde}%`;
      cubuk.setAttribute('aria-valuenow', String(Math.round(yuzde)));
      cubuk.setAttribute('aria-valuetext', `${sureMetni(t)} / ${sureMetni(tur.toplam)}`);
      metin.textContent = `${sureMetni(t)} / ${sureMetni(tur.toplam)}`;
      oynatDugme.innerHTML = tur.oynuyor ? DURAKLAT : OYNAT;
      oynatDugme.setAttribute('aria-label', tur.oynuyor ? 'Duraklat' : 'Oynat');
      const bi = s ? s.bi : tur.c.liste[tur.bul(t)].bi;
      if (bi !== sonBolum) {
        sonBolum = bi;
        bolumAdi.textContent = `${bi + 1}. ${tur.c.bolumler[bi].ad}`;
        liste.querySelectorAll('button').forEach((b, j) => {
          if (j === bi) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
          b.classList.toggle('bitti', j < bi);
        });
        const etkin = liste.children[bi];
        if (etkin && liste.scrollWidth > liste.clientWidth) liste.scrollTo({ left: etkin.offsetLeft - 20, behavior: 'smooth' });
      }
      sahne.setAttribute('aria-label', `${tur.c.bolumler[bi].ad}: ${(s || tur.c.liste[tur.bul(t)]).adim.yazi}`);
    };

    if (!oynatici) {
      sahne.setAttribute('role', 'img');
      oynatici = new Tur(sahne, { guncelle });
      // bölüm listesi ve işaretler
      liste.innerHTML = '';
      const isaretler = document.getElementById('zaman-isaretleri');
      isaretler.innerHTML = '';
      oynatici.c.bolumler.forEach((b, bi) => {
        const li = el('li');
        const d = el('button');
        d.type = 'button';
        d.innerHTML = `<b>${bi + 1}</b>`;
        d.append(document.createTextNode(b.ad));
        d.addEventListener('click', () => { oynatici.git(oynatici.bolumBaslangici(bi)); oynatici.oynat(); });
        li.append(d);
        liste.append(li);
        if (bi > 0) { const i = el('span'); i.style.left = `${(oynatici.bolumBaslangici(bi) / oynatici.toplam) * 100}%`; isaretler.append(i); }
      });
      oynatDugme.addEventListener('click', () => (oynatici.oynuyor ? oynatici.duraklat() : oynatici.oynat()));
      // sarma: tıkla / sürükle / klavye
      const konumdan = (e) => { const r = cubuk.getBoundingClientRect(); return kisit((e.clientX - r.left) / r.width, 0, 1) * oynatici.toplam; };
      let surukle = false;
      cubuk.addEventListener('pointerdown', (e) => { surukle = true; cubuk.setPointerCapture(e.pointerId); oynatici.git(konumdan(e)); });
      cubuk.addEventListener('pointermove', (e) => { if (surukle) oynatici.git(konumdan(e)); });
      cubuk.addEventListener('pointerup', () => { surukle = false; });
      cubuk.addEventListener('keydown', (e) => {
        const adim = { ArrowRight: 5, ArrowLeft: -5, PageUp: 15, PageDown: -15 }[e.key];
        if (adim) { e.preventDefault(); oynatici.git(oynatici.t + adim); }
        if (e.key === 'Home') { e.preventDefault(); oynatici.git(0); }
        if (e.key === 'End') { e.preventDefault(); oynatici.git(oynatici.toplam); }
      });
      pencere.addEventListener('keydown', (e) => {
        if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); oynatDugme.click(); }
      });
      // genişlet: gerçek tam ekran, yoksa pencere içi geniş görünüm
      const genislet = document.getElementById('tur-genislet');
      genislet.addEventListener('click', async () => {
        if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
        if (kap.requestFullscreen) {
          try { await kap.requestFullscreen(); return; } catch { /* geniş görünüme düşülür */ }
        }
        pencere.classList.toggle('genis');
      });
      document.getElementById('tur-kapat').addEventListener('click', () => pencere.close());
      pencere.addEventListener('click', (e) => { if (e.target === pencere) pencere.close(); });
      pencere.addEventListener('close', () => {
        oynatici.duraklat();
        pencere.classList.remove('genis');
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        document.documentElement.style.overflow = '';
        if (pencere._geriOdak) pencere._geriOdak.focus();
      });
    }
    pencere._geriOdak = geriOdak || null;
    document.documentElement.style.overflow = 'hidden';
    pencere.showModal();
    oynatici.boyutla();
    if (bolum != null && oynatici.c.bolumler[bolum]) oynatici.git(oynatici.bolumBaslangici(bolum));
    else if (oynatici.t >= oynatici.toplam - 0.01) oynatici.git(0);
    oynatici.render(oynatici.t);
    oynatDugme.focus();
    oynatici.oynat();
  }

  window.NobetciTur = { Tur, telefonKur, oynaticiAc };
})();
