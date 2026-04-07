(function () {
  'use strict';

  const WITA_OFFSET_MINUTES = 8 * 60;
  const ANCHOR = { year: 2025, month: 6, day: 25, hour: 18, minute: 0 };

  const NAMES = {
    sasih: ['Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanem', 'Kapitu', 'Kawalu', 'Kasanga', 'Kedasa', 'Jyestha', 'Sadha'],
    wuku: ['Sinta', 'Landep', 'Ukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Wariga', 'Warigadian', 'Julungwangi', 'Sungsang', 'Dungulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Kelawu', 'Dukut', 'Watugunung'],
    ekaWara: ['Luang'],
    dwiWara: ['Menga', 'Pepet'],
    triWaraCustom: ['Kajeng', 'Pasah', 'Beteng', 'Pasah'],
    caturWara: ['Sri', 'Laba', 'Jaya', 'Menala'],
    pancaWaraCustom: ['Paing', 'Pon', 'Wage', 'Kliwon', 'Umanis'],
    sadWara: ['Tungleh', 'Aryang', 'Urukung', 'Paniron', 'Was', 'Maulu'],
    saptaWara: ['Redite', 'Soma', 'Anggara', 'Buda', 'Wraspati', 'Sukra', 'Saniscara'],
    astaWara: ['Sri', 'Indra', 'Guru', 'Yama', 'Ludra', 'Brahma', 'Kala', 'Uma'],
    sangaWara: ['Dangu', 'Jangur', 'Gigis', 'Nohan', 'Ogan', 'Erangan', 'Urungan', 'Tulus', 'Dadi'],
    dasaWara: ['Pati', 'Suka', 'Duka', 'Sri', 'Manuh', 'Manusa', 'Raja', 'Dewa', 'Raksasa', 'Pandita'],
  };

  const floorDiv = (a, b) => Math.floor(a / b);
  const mod = (a, m) => ((a % m) + m) % m;
  const cycleName = (list, delta) => list[mod(delta, list.length)];

  function parseInputToUtcMs(input) {
    const normalized = input.trim().replace('T', ' ');
    const m = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!m) throw new Error('Format waktu tidak valid. Gunakan YYYY-MM-DD HH:mm.');
    const [, y, mo, d, h, mi] = m;
    const utcMs = Date.UTC(+y, +mo - 1, +d, +h, +mi, 0);
    return utcMs - WITA_OFFSET_MINUTES * 60 * 1000;
  }

  class DauhModule {
    constructor(anchor) {
      this.anchorDaySerial = Date.UTC(anchor.year, anchor.month - 1, anchor.day) / 86400000;
    }

    computeTick(requestUtcMs) {
      const shifted = new Date(requestUtcMs + WITA_OFFSET_MINUTES * 60 * 1000);
      const daySerial = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) / 86400000;
      const dayDelta = daySerial - this.anchorDaySerial;
      const minuteOfDay = shifted.getUTCHours() * 60 + shifted.getUTCMinutes() + shifted.getUTCSeconds() / 60;

      if (minuteOfDay >= 18 * 60) return 2 * dayDelta;
      if (minuteOfDay >= 5 * 60 + 30) return (2 * dayDelta) - 1;
      return (2 * dayDelta) - 2;
    }

    compute(requestUtcMs) {
      const tick = this.computeTick(requestUtcMs);
      return { tick, nilai: mod(tick, 3) + 1 };
    }
  }

  class DinaModule {
    compute(tick) {
      const dinaDelta = floorDiv(tick, 3);
      return {
        deltaDinaDariAnchor: dinaDelta,
        nilaiSaatIni: mod(dinaDelta, 420) + 1,
        polaAktif: mod(dinaDelta, 2) === 0 ? 'Pola Gelap' : 'Pola Terang',
      };
    }
  }

  class SasihModule {
    constructor(sasihNames) {
      this.sasihNames = sasihNames;
      this.siklusDinaPerSasih = 27;
    }

    compute(dinaDelta) {
      const sasihDelta = floorDiv(dinaDelta, this.siklusDinaPerSasih);
      const dinaDalamSasih = mod(dinaDelta, this.siklusDinaPerSasih) + 1;
      const polaAktif = mod(sasihDelta, 2) === 0 ? 'Pola A' : 'Pola B';

      let faseUtama = 'Transisi 8 Dina';
      if (polaAktif === 'Pola A') {
        if (dinaDalamSasih === 1 || dinaDalamSasih === 19) faseUtama = 'Tilem';
        else if (dinaDalamSasih === 10) faseUtama = 'Purnama';
      } else {
        if (dinaDalamSasih === 1 || dinaDalamSasih === 19) faseUtama = 'Purnama';
        else if (dinaDalamSasih === 10) faseUtama = 'Tilem';
      }

      return {
        namaSasih: this.sasihNames[mod(sasihDelta, this.sasihNames.length)],
        polaAktif,
        step: `Dina-${dinaDalamSasih}`,
        faseUtama,
      };
    }
  }

  class WewaranModule {
    constructor(names) {
      this.names = names;
    }

    compute(dinaDelta) {
      return {
        ekaWara: cycleName(this.names.ekaWara, dinaDelta),
        dwiWara: cycleName(this.names.dwiWara, dinaDelta),
        triWara: cycleName(this.names.triWaraCustom, dinaDelta),
        caturWara: cycleName(this.names.caturWara, dinaDelta),
        pancaWara: cycleName(this.names.pancaWaraCustom, dinaDelta),
        sadWara: cycleName(this.names.sadWara, dinaDelta),
        saptaWara: cycleName(this.names.saptaWara, dinaDelta),
        astaWara: cycleName(this.names.astaWara, dinaDelta),
        sangaWara: cycleName(this.names.sangaWara, dinaDelta),
        dasaWara: cycleName(this.names.dasaWara, dinaDelta),
      };
    }
  }

  class WukuModule {
    constructor(wukuNames) {
      this.wukuNames = wukuNames;
    }

    compute(dinaDelta) {
      return this.wukuNames[mod(floorDiv(dinaDelta, 7), 30)];
    }
  }

  class KaTikaStateMachine {
    constructor() {
      this.dauhModule = new DauhModule(ANCHOR);
      this.dinaModule = new DinaModule();
      this.sasihModule = new SasihModule(NAMES.sasih);
      this.wewaranModule = new WewaranModule(NAMES);
      this.wukuModule = new WukuModule(NAMES.wuku);
    }

    resolve(requestTime) {
      const requestUtcMs = parseInputToUtcMs(requestTime);
      const dauhState = this.dauhModule.compute(requestUtcMs);
      const dinaState = this.dinaModule.compute(dauhState.tick);
      const sasihState = this.sasihModule.compute(dinaState.deltaDinaDariAnchor);
      const wewaranState = this.wewaranModule.compute(dinaState.deltaDinaDariAnchor);
      const wukuName = this.wukuModule.compute(dinaState.deltaDinaDariAnchor);

      return {
        request_time: requestTime,
        ui_display: {
          nama_wuku: wukuName,
          nama_saptawara: wewaranState.saptaWara,
          nama_pancawara: wewaranState.pancaWara,
          nama_triwara: wewaranState.triWara,
          nama_dwiwara: wewaranState.dwiWara,
          nama_ekawara: wewaranState.ekaWara,
          nama_sasih: sasihState.namaSasih,
        },
        metadata: {
          delta_dina_dari_anchor: dinaState.deltaDinaDariAnchor,
          dauh_tick: dauhState.tick,
          dina: {
            nilai_saat_ini: dinaState.nilaiSaatIni,
            pola_aktif: dinaState.polaAktif,
          },
          sasih_state: {
            pola_aktif: sasihState.polaAktif,
            step: sasihState.step,
            fase_utama: sasihState.faseUtama,
          },
        },
      };
    }
  }

  window.KaTikaStateMachine = KaTikaStateMachine;
})();
