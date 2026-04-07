(function () {
  'use strict';

  const WITA_OFFSET_MINUTES = 8 * 60;
  const TICK_MS = 12 * 60 * 60 * 1000;
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
  };

  const floorDiv = (a, b) => Math.floor(a / b);
  const mod = (a, m) => ((a % m) + m) % m;

  function witaComponentsToUtcMs({ year, month, day, hour, minute = 0, second = 0 }) {
    return Date.UTC(year, month - 1, day, hour, minute, second) - WITA_OFFSET_MINUTES * 60 * 1000;
  }

  function parseInputToUtcMs(input) {
    const normalized = input.trim().replace('T', ' ');
    const m = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!m) throw new Error('Format waktu tidak valid. Gunakan YYYY-MM-DD HH:mm.');
    const [, y, mo, d, h, mi] = m;
    return witaComponentsToUtcMs({ year: +y, month: +mo, day: +d, hour: +h, minute: +mi });
  }

  class KaTikaStateMachine {
    constructor() {
      this.anchorMsUtc = witaComponentsToUtcMs(ANCHOR);
    }

    resolve(requestTime) {
      const requestUtcMs = parseInputToUtcMs(requestTime);
      const deltaMs = requestUtcMs - this.anchorMsUtc;
      const tick = floorDiv(deltaMs, TICK_MS);
      const dinaDelta = floorDiv(tick, 3);
      const sasihDelta = floorDiv(dinaDelta, 30);
      const dinaDalamSasih = mod(dinaDelta, 30) + 1;
      const polaSasih = mod(sasihDelta, 2) === 0 ? 'Pola A' : 'Pola B';

      let faseSasih = 'Dina Biasa';
      if (polaSasih === 'Pola A') {
        if (dinaDalamSasih === 1 || dinaDalamSasih === 20) faseSasih = 'Tilem';
        else if (dinaDalamSasih === 10 || dinaDalamSasih === 30) faseSasih = 'Purnama';
      } else {
        if (dinaDalamSasih === 1 || dinaDalamSasih === 20) faseSasih = 'Purnama';
        else if (dinaDalamSasih === 10 || dinaDalamSasih === 30) faseSasih = 'Tilem';
      }

      return {
        request_time: requestTime,
        ui_display: {
          nama_wuku: NAMES.wuku[mod(floorDiv(dinaDelta, 7), 30)],
          nama_saptawara: NAMES.saptaWara[mod(dinaDelta, 7)],
          nama_pancawara: NAMES.pancaWaraCustom[mod(dinaDelta, 5)],
          nama_triwara: NAMES.triWaraCustom[mod(dinaDelta, 4)],
          nama_sasih: NAMES.sasih[mod(sasihDelta, 12)],
          fase_sasih: faseSasih,
        },
        metadata: {
          delta_dina_dari_anchor: dinaDelta,
          dauh_tick: tick,
          dina: { nilai_saat_ini: mod(dinaDelta, 420) + 1, pola_aktif: mod(dinaDelta, 2) === 0 ? 'Pola Gelap' : 'Pola Terang' },
          sasih_state: { pola_aktif: polaSasih, step: `Dina-${dinaDalamSasih}` },
        },
      };
    }
  }

  window.KaTikaStateMachine = KaTikaStateMachine;
})();
