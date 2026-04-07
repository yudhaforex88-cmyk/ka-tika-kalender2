'use strict';

const { ANCHOR, NAMES, TICK_MS } = require('./constants');
const { floorDiv, parseInputToUtcMs, witaComponentsToUtcMs } = require('./utils');
const { DauhModule } = require('./modules/DauhModule');
const { DinaModule } = require('./modules/DinaModule');
const { SasihModule } = require('./modules/SasihModule');
const { WewaranModule } = require('./modules/WewaranModule');
const { WukuModule } = require('./modules/WukuModule');

class KaTikaStateMachine {
  constructor() {
    this.anchorMsUtc = witaComponentsToUtcMs(ANCHOR);

    this.dauhModule = new DauhModule();
    this.dinaModule = new DinaModule();
    this.sasihModule = new SasihModule({ sasihNames: NAMES.sasih });
    this.wewaranModule = new WewaranModule({ names: NAMES });
    this.wukuModule = new WukuModule({ wukuNames: NAMES.wuku });
  }

  computeTicks(deltaMs) {
    return floorDiv(deltaMs, TICK_MS);
  }

  resolve(requestTime) {
    const requestUtcMs = parseInputToUtcMs(requestTime);
    const deltaMs = requestUtcMs - this.anchorMsUtc;
    const tick = this.computeTicks(deltaMs);

    const dauhState = this.dauhModule.compute(tick);
    const dinaState = this.dinaModule.compute(tick);
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
        nama_sasih: sasihState.namaSasih,
        fase_sasih: sasihState.faseSasih,
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
        },
      },
    };
  }
}

module.exports = {
  KaTikaStateMachine,
};
