'use strict';

const { floorDiv, mod } = require('../utils');

class DinaModule {
  compute(tick) {
    const dinaDelta = floorDiv(tick, 3);
    const dinaCycleIndex = mod(dinaDelta, 420);

    return {
      deltaDinaDariAnchor: dinaDelta,
      nilaiSaatIni: dinaCycleIndex + 1,
      polaAktif: mod(dinaDelta, 2) === 0 ? 'Pola Gelap' : 'Pola Terang',
      stepInPattern: mod(tick, 3) + 1,
      macroCycle: floorDiv(dinaDelta, 420),
    };
  }
}

module.exports = {
  DinaModule,
};
