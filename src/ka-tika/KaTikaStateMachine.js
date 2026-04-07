'use strict';

const { ANCHOR, NAMES } = require('./constants');
const { parseInputToUtcMs } = require('./utils');
const { DauhModule } = require('./modules/DauhModule');
const { DinaModule } = require('./modules/DinaModule');
const { SasihModule } = require('./modules/SasihModule');
const { WewaranModule } = require('./modules/WewaranModule');
const { WukuModule } = require('./modules/WukuModule');

class KaTikaStateMachine {
  constructor() {
    this.dauhModule = new DauhModule({ anchor: ANCHOR });
    this.dinaModule = new DinaModule();
    this.sasihModule = new SasihModule({ sasihNames: NAMES.sasih });
    this.wewaranModule = new WewaranModule({ names: NAMES });
    this.wukuModule = new WukuModule({ wukuNames: NAMES.wuku });
  }

  resolve(requestTime) {
    const requestUtcMs = parseInputToUtcMs(requestTime);

    const dauhState = this.dauhModule.compute(requestUtcMs);
    const dinaState = this.dinaModule.compute(dauhState.tick);
    const sasihState = this.sasihModule.compute(dinaState.deltaDinaDariAnchor);
    const wewaranState = this.wewaranModule.compute(dinaState.deltaDinaDariAnchor);
    const wukuName = this.wukuModule.compute(dinaState.deltaDinaDariAnchor);

    return {
      request_time: typeof requestTime === 'string' ? requestTime : new Date(requestUtcMs).toISOString(),
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

module.exports = {
  KaTikaStateMachine,
};
