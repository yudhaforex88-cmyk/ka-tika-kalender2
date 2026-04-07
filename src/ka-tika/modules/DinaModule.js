'use strict';

const { floorDiv, mod } = require('../utils');

class DinaModule {
  constructor() {
    this.transisiPolaGelap = ['Sunset', 'Sunrise', 'Sunset'];
    this.transisiPolaTerang = ['Sunrise', 'Sunset', 'Sunrise'];
  }

  compute(tick) {
    const dinaDelta = floorDiv(tick, 3);
    const dinaCycleIndex = mod(dinaDelta, 420);
    const ketukanDauh = mod(tick, 3) + 1;
    const polaAktif = mod(dinaDelta, 2) === 0 ? 'Pola Gelap' : 'Pola Terang';
    const transisiList = polaAktif === 'Pola Gelap' ? this.transisiPolaGelap : this.transisiPolaTerang;

    return {
      deltaDinaDariAnchor: dinaDelta,
      nilaiSaatIni: dinaCycleIndex + 1,
      polaAktif,
      ketukanDauh,
      transisiSaatIni: transisiList[ketukanDauh - 1],
      akhirPolaSaatIni: ketukanDauh === 3,
      polaBerikutnya: polaAktif === 'Pola Gelap' ? 'Pola Terang' : 'Pola Gelap',
      macroCycle: floorDiv(dinaDelta, 420),
    };
  }
}

module.exports = {
  DinaModule,
};
